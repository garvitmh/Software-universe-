// app/api/rag/query/route.js
import { searchRAG } from '@/lib/rag_search';
import https from 'https';

function callOpenAI(apiKey, prompt, systemContext) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemContext
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
          } else if (!json.choices || json.choices.length === 0) {
            reject(new Error('Unexpected response format from OpenAI API'));
          } else {
            resolve(json.choices[0].message.content);
          }
        } catch (e) {
          reject(new Error('Failed to parse OpenAI API response: ' + e.message));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

function callOpenRouter(apiKey, prompt, systemContext) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
      messages: [
        {
          role: 'system',
          content: systemContext
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'Software Universe',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message || 'OpenRouter API Error'));
          } else if (!json.choices || json.choices.length === 0) {
            reject(new Error('Unexpected response format from OpenRouter API'));
          } else {
            resolve(json.choices[0].message.content);
          }
        } catch (e) {
          reject(new Error('Failed to parse OpenRouter response: ' + e.message));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, apiKey: clientApiKey } = body;

    if (!query || !query.trim()) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Search local RAG data lake
    const references = searchRAG(query, 4);

    // 2. Determine API Key
    const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

    if (apiKey && apiKey.trim()) {
      // 3. Call RAG
      const contextString = references
        .map((res, i) => `[Source ${i + 1}]: Title: "${res.title}" | Path: "${res.source}" | Text:\n${res.text}\n`)
        .join('\n');

      const systemPrompt = `You are the "Socratic Architect" of Software Universe, an interactive learning platform for software engineers and vibe coders.
Your goal is to explain systems engineering concepts deeply, clearly, and socratically.
Always structure your response using the following headings:
- **WHAT**: Ground the definition of the concept using the provided sources.
- **WHY**: Explain why it is built this way, the alternatives rejected, and the trade-offs.
- **HOW**: Briefly explain how it works step-by-step.
- **WHEN IT BREAKS**: Highlight failures, edge cases, and mitigation/recovery strategies.

Context Documents from Software Universe (Google SRE Book, Stripe/Discord blogs, cloned repos):
${contextString}

Answer the user's query grounding yourself strictly in the provided context documents. If the context does not contain enough information, use your broader architectural knowledge but specify that it is general knowledge. Always write in a warm, premium, encouraging tone. Avoid childish analogies.`;

      try {
        let responseText;
        if (apiKey.startsWith('sk-or-')) {
          responseText = await callOpenRouter(apiKey, query, systemPrompt);
        } else {
          responseText = await callOpenAI(apiKey, query, systemPrompt);
        }
        return new Response(JSON.stringify({ answer: responseText, references, isMock: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (apiErr) {
        console.error('API call failed, falling back to local synthesis:', apiErr.message);
        // Fallback to local synthesis on API error
      }
    }

    // 4. Local Synthesis Fallback (when no key or API call fails)
    let answerText = `### 🎓 Socratic Assistant (Local Ingested Knowledge)

I searched the **Software Universe** local data lake. Here is the direct synthesis of what I found in the SRE textbooks, engineering blogs, and open-source repositories:

`;

    if (references.length === 0) {
      answerText += `No direct matches were found for **"${query}"** in the data lake.
      
Try asking about concepts like **monitoring**, **idempotency keys**, **cascading failures**, or **database clustering**.

*(💡 Pro-Tip: Provide an OpenAI API Key in the settings panel to get custom LLM synthesis and answers for any question!)*`;
    } else {
      const topRef = references[0];
      const secondRef = references[1] || topRef;
      
      answerText += `#### 🔍 Concept Overview (From: *${topRef.title}*)
> "${topRef.text}"

${references.length > 1 ? `#### ⚖️ Trade-offs & Decisions (From: *${secondRef.title}*)
> "${secondRef.text}"` : ''}

#### 🚨 Edge Cases & Failure Modes
Based on the SRE book chapters and outage blogs:
1. **Cascading failures** occur when a small failure triggers overloading across other services (e.g. retry storms).
2. **Double payments & race conditions** are mitigated by using unique **Idempotency Keys** (as detailed in the Stripe engineering guides).
3. **Storage performance bottlenecking** can be solved by switching databases (e.g. Discord migrating to ScyllaDB for billions of messages).

*(💡 Tip: To enable full AI-driven Socratic synthesis and follow-up dialogue, enter your OpenAI API Key in the panel below).*`;
    }

    return new Response(JSON.stringify({ answer: answerText, references, isMock: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('RAG Query Route Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
