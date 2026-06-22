// scripts/embed_data.js
const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');
const PROCESSED_DIR = path.join(__dirname, '..', 'data', 'processed');
const OUTPUT_FILE = path.join(PROCESSED_DIR, 'search_index.json');

// Stopwords for TF-IDF tokenization
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

// Canonical URLs mapping
const CANONICAL_URLS = {
  'books/google-sre/introduction.html': 'https://sre.google/sre-book/introduction/',
  'books/google-sre/monitoring.html': 'https://sre.google/sre-book/monitoring-distributed-systems/',
  'books/google-sre/cascading-failures.html': 'https://sre.google/sre-book/addressing-cascading-failures/',
  'blogs/stripe-idempotency.html': 'https://stripe.com/blog/idempotency',
  'blogs/discord-scylldadb.html': 'https://discord.com/blog/how-discord-stores-billions-of-messages'
};

const REPO_URLS = {
  'every-programmer-should-know': 'https://github.com/mtdvio/every-programmer-should-know',
  'ai-engineering-from-scratch': 'https://github.com/rohitg00/ai-engineering-from-scratch',
  'awesome-sre': 'https://github.com/dastergon/awesome-sre',
  'professional-programming': 'https://github.com/charlax/professional-programming'
};

// Helper: Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Tokenize text into normalized words
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s_]+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

// Strip HTML tags and clean up entities
function cleanHtml(html) {
  let text = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '');
  
  // Clean entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '-');

  return text;
}

// Get files recursively
function getFilesRec(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    // Ignore .git folder
    if (file === '.git') continue;
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFilesRec(name, fileList);
    } else {
      fileList.push(name);
    }
  }
  return fileList;
}

// Process single HTML file
function processHtmlFile(filePath, relativePath) {
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  const cleanBody = cleanHtml(rawHtml);

  // Simple state machine to parse out paragraphs and headers
  const chunks = [];
  let currentHeading = 'General Content';
  const canonicalUrl = CANONICAL_URLS[relativePath.replace(/\\/g, '/')] || '';

  // Extract titles and paragraphs using regex
  const tagsRegex = /<(h[1-6]|p|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = tagsRegex.exec(cleanBody)) !== null) {
    const tagName = match[1].toLowerCase();
    let content = match[2].replace(/<[^>]+>/g, ' ').trim(); // strip inner tags

    if (!content) continue;

    if (tagName.startsWith('h')) {
      currentHeading = content;
    } else {
      // Chunk it
      if (content.length > 80) { // Skip tiny sentences or single words
        chunks.push({
          source: relativePath.replace(/\\/g, '/'),
          category: relativePath.startsWith('books') ? 'books' : 'blogs',
          title: currentHeading,
          text: content,
          url: canonicalUrl
        });
      }
    }
  }

  return chunks;
}

// Process single Markdown file
function processMarkdownFile(filePath, relativePath) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  
  // Extract repository name if it belongs to a cloned repo
  let repoName = '';
  let repoUrl = '';
  if (relativePath.startsWith('repos')) {
    const parts = relativePath.split(/[\\/]/);
    repoName = parts[1];
    repoUrl = REPO_URLS[repoName] || '';
  }

  const lines = markdown.split(/\r?\n/);
  const chunks = [];
  let currentHeading = 'README Overview';
  let currentBlock = [];

  for (let line of lines) {
    const headingMatch = line.match(/^#+\s+(.*)$/);
    if (headingMatch) {
      // Flush previous block
      if (currentBlock.length > 0) {
        const text = currentBlock.join(' ').trim();
        if (text.length > 80) {
          chunks.push({
            source: relativePath.replace(/\\/g, '/'),
            category: 'repos',
            title: `${repoName ? repoName + ': ' : ''}${currentHeading}`,
            text: text,
            url: repoUrl ? `${repoUrl}/blob/master/${relativePath.split(/[\\/]/).slice(2).join('/')}` : ''
          });
        }
        currentBlock = [];
      }
      currentHeading = headingMatch[1].replace(/<[^>]+>/g, '').trim();
    } else {
      const cleanLine = line.trim();
      if (cleanLine) {
        currentBlock.push(cleanLine);
      } else if (currentBlock.length > 0) {
        // Double newlines act as separators
        const text = currentBlock.join(' ').trim();
        if (text.length > 80) {
          chunks.push({
            source: relativePath.replace(/\\/g, '/'),
            category: 'repos',
            title: `${repoName ? repoName + ': ' : ''}${currentHeading}`,
            text: text,
            url: repoUrl ? `${repoUrl}/blob/master/${relativePath.split(/[\\/]/).slice(2).join('/')}` : ''
          });
        }
        currentBlock = [];
      }
    }
  }

  // Flush remaining block
  if (currentBlock.length > 0) {
    const text = currentBlock.join(' ').trim();
    if (text.length > 80) {
      chunks.push({
        source: relativePath.replace(/\\/g, '/'),
        category: 'repos',
        title: `${repoName ? repoName + ': ' : ''}${currentHeading}`,
        text: text,
        url: repoUrl ? `${repoUrl}/blob/master/${relativePath.split(/[\\/]/).slice(2).join('/')}` : ''
      });
    }
  }

  return chunks;
}

function runIndexing() {
  console.log('=== STARTING DATA LAKE CHUNKING & TF-IDF INDEXING ===');
  const allFiles = getFilesRec(RAW_DIR);
  console.log(`Found ${allFiles.length} files in raw data lake.`);

  let allChunks = [];

  for (const file of allFiles) {
    const relativePath = path.relative(RAW_DIR, file);
    const ext = path.extname(file).toLowerCase();

    try {
      if (ext === '.html' || ext === '.htm') {
        const fileChunks = processHtmlFile(file, relativePath);
        allChunks = allChunks.concat(fileChunks);
      } else if (ext === '.md' || ext === '.markdown') {
        const fileChunks = processMarkdownFile(file, relativePath);
        allChunks = allChunks.concat(fileChunks);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to process ${relativePath}:`, err.message);
    }
  }

  console.log(`Extracted ${allChunks.length} chunks from files.`);

  // Build TF-IDF Vocabulary and Term Frequencies for each chunk
  console.log('Building TF-IDF Index...');
  const dfMap = {};
  
  // 1. Assign IDs and compute Term Frequencies (TFs)
  allChunks.forEach((chunk, index) => {
    chunk.id = `chunk_${index}`;
    const words = tokenize(chunk.text);
    const termCounts = {};
    words.forEach(word => {
      termCounts[word] = (termCounts[word] || 0) + 1;
    });

    chunk.tf = {};
    const totalWords = words.length || 1;
    const uniqueWordsInChunk = Object.keys(termCounts);
    
    uniqueWordsInChunk.forEach(word => {
      chunk.tf[word] = termCounts[word] / totalWords;
      dfMap[word] = (dfMap[word] || 0) + 1;
    });
  });

  // 2. Compute IDF Map
  const totalDocs = allChunks.length;
  const idfMap = {};
  Object.keys(dfMap).forEach(word => {
    idfMap[word] = Math.log(totalDocs / (1 + dfMap[word]));
  });

  // 3. Keep only the necessary properties on chunks to save file size
  const indexedChunks = allChunks.map(chunk => ({
    id: chunk.id,
    source: chunk.source,
    category: chunk.category,
    title: chunk.title,
    text: chunk.text,
    url: chunk.url,
    tf: chunk.tf
  }));

  // Create processed output folder
  ensureDir(PROCESSED_DIR);

  // Write index file
  const indexData = {
    totalDocs,
    idfMap,
    chunks: indexedChunks
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), 'utf8');
  console.log(`Successfully wrote TF-IDF Index to: ${OUTPUT_FILE}`);
  console.log(`Index file size: ${(fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2)} MB`);
  console.log('=== INDEXING COMPLETED ===');
}

runIndexing();
