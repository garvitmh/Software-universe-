// lib/rag_search.js
const fs = require('fs');
const path = require('path');

// Stopwords for search query tokenization
const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now'
]);

let indexCache = null;

function loadIndex() {
  if (indexCache) return indexCache;

  // Try the large (gitignored) processed lake first, then a small bundled,
  // deploy-safe index committed in-repo. If neither exists, degrade to an
  // empty index so the assistant NEVER throws (it answers LLM-only instead).
  const candidates = [
    path.join(process.cwd(), 'data', 'processed', 'search_index.json'),
    path.join(process.cwd(), 'lib', 'knowledge', 'search_index.json'),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        indexCache = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (indexCache && Array.isArray(indexCache.chunks)) return indexCache;
      }
    } catch (e) {
      console.warn(`RAG: failed to load index at ${p}: ${e.message}`);
    }
  }

  indexCache = { chunks: [], idfMap: {} };
  return indexCache;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s_]+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

function searchRAG(query, limit = 6) {
  const index = loadIndex();
  const queryTerms = tokenize(query);

  if (queryTerms.length === 0 || !index || !Array.isArray(index.chunks) || index.chunks.length === 0) {
    return [];
  }

  const scoredChunks = [];

  for (const chunk of index.chunks) {
    let score = 0;
    let matchedTermsCount = 0;

    for (const term of queryTerms) {
      if (chunk.tf[term]) {
        const idf = index.idfMap[term] || 0;
        score += chunk.tf[term] * idf;
        matchedTermsCount++;
      }

      // Title match boost
      if (chunk.title && chunk.title.toLowerCase().includes(term)) {
        const idf = index.idfMap[term] || 1;
        score += idf * 0.15; // fixed boost weight
      }
    }

    if (score > 0) {
      // Coherence boost: reward chunks that match multiple query terms
      if (matchedTermsCount > 1) {
        score *= (1 + 0.2 * (matchedTermsCount - 1));
      }

      scoredChunks.push({
        id: chunk.id,
        source: chunk.source,
        category: chunk.category,
        title: chunk.title,
        text: chunk.text,
        url: chunk.url,
        score: score
      });
    }
  }

  // Sort by score descending
  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, limit);
}

module.exports = {
  searchRAG
};
