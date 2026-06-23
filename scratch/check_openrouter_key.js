const https = require('https');

const apiKey = process.argv[2] || process.env.OPENROUTER_API_KEY;

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}. Status: ${res.statusCode}. Body: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function main() {
  try {
    console.log('=== Querying OpenRouter Key Details ===');
    const keyInfo = await fetchJSON('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    console.log('Key Info Response:', JSON.stringify(keyInfo, null, 2));

    console.log('\n=== Querying OpenRouter Models List ===');
    const modelsInfo = await fetchJSON('https://openrouter.ai/api/v1/models');
    
    // Filter for models matching GLM or Nemotron
    const relevantModels = modelsInfo.data ? modelsInfo.data.filter(m => 
      m.id.toLowerCase().includes('glm') || 
      m.id.toLowerCase().includes('nemotron')
    ) : [];
    
    console.log('\nRelevant Models:');
    relevantModels.forEach(m => {
      console.log(`- ${m.id} | Pricing: (Prompt: ${m.pricing.prompt}, Completion: ${m.pricing.completion}) | Context: ${m.context_length}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
