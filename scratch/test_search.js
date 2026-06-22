// scratch/test_search.js
const { searchRAG } = require('../lib/rag_search');

const testQueries = [
  'What is monitoring?',
  'how discord stores messages',
  'stripe idempotency key',
  'cascading failure in distributed systems'
];

console.log('=== RUNNING RAG SEARCH TESTS ===\n');

for (const query of testQueries) {
  console.log(`Query: "${query}"`);
  console.log('--------------------------------------------------');
  const results = searchRAG(query, 2);
  if (results.length === 0) {
    console.log('No results found.');
  } else {
    results.forEach((res, i) => {
      console.log(`[Result ${i + 1}] Score: ${res.score.toFixed(4)} | Title: "${res.title}" | Source: ${res.source}`);
      console.log(`Snippet: ${res.text.substring(0, 160)}...`);
      console.log(`URL: ${res.url || 'None'}\n`);
    });
  }
  console.log('==================================================\n');
}
