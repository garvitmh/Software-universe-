// scratch/test_openrouter.js
const apiKey = process.argv[2] || process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Error: Please provide your OpenRouter API key as an argument:');
  console.error('node scratch/test_openrouter.js <your-api-key>');
  process.exit(1);
}

const query = 'What is backpressure and how does it prevent cascading failure?';

console.log('=== TESTING OPENROUTER KEY INTEGRATION WITH NVIDIA NEMOTRON ===');
console.log(`Sending query: "${query}"...\n`);

fetch('http://localhost:3001/api/rag/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: query,
    apiKey: apiKey
  })
})
  .then(res => {
    if (!res.ok) {
      return res.text().then(text => {
        throw new Error(`HTTP ${res.status}: ${text}`);
      });
    }
    return res.json();
  })
  .then(data => {
    console.log('=== TEST SUCCESSFUL ===');
    console.log(`Is Mock Response? ${data.isMock ? 'YES (Fallback)' : 'NO (Real API response)'}`);
    console.log('\n--- Model Answer ---');
    console.log(data.answer);
    console.log('--------------------\n');
    console.log('References cited:');
    data.references.forEach((ref, idx) => {
      console.log(`[${idx + 1}] ${ref.title} (${ref.source})`);
    });
  })
  .catch(err => {
    console.error('=== TEST FAILED ===');
    console.error('Error Details:', err.message);
  });
