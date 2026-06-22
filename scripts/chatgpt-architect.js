#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API Key from environment or .env file
function getApiKey() {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^OPENAI_API_KEY\s*=\s*(.*)$/m);
    if (match && match[1]) {
      return match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

// Read core documentation as architect context
function getArchitectContext(extraFiles = []) {
  let context = '=== SOFTWARE UNIVERSE CONSTITUTION & RULES ===\n\n';
  const docFiles = [
    'docs/01-VISION-AND-RULES.md',
    'docs/02-PRODUCT-SPEC.md',
    'docs/OBSERVATORY.md'
  ];

  for (const docFile of docFiles) {
    const fullPath = path.join(__dirname, '..', docFile);
    if (fs.existsSync(fullPath)) {
      context += `[File: ${docFile}]\n${fs.readFileSync(fullPath, 'utf8')}\n\n`;
    }
  }

  if (extraFiles && extraFiles.length > 0) {
    context += '=== ADDITIONAL WORKSPACE CONTEXT ===\n\n';
    for (const file of extraFiles) {
      const resolved = path.isAbsolute(file) ? file : path.join(__dirname, '..', file);
      if (fs.existsSync(resolved)) {
        const basename = path.basename(resolved);
        context += `[File: ${basename}]\n${fs.readFileSync(resolved, 'utf8')}\n\n`;
      }
    }
  }

  return context;
}

// Call OpenAI Chat Completion API
function callOpenAI(prompt, systemContext) {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      reject(new Error('OpenAI API Key not found. Please set OPENAI_API_KEY in process.env or in a .env file.'));
      return;
    }

    const postData = JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are the "Chief Architect" for Software Universe. You maintain the vision and principles. Answer all queries strictly according to the following rules, spec, and codebase guidelines:\n\n${systemContext}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
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
          } else {
            resolve(json.choices[0].message.content);
          }
        } catch (e) {
          reject(e);
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

// Standard MCP Protocol JSON-RPC Implementation
function startMcpServer() {
  let buffer = '';

  process.stdin.on('data', (chunk) => {
    buffer += chunk.toString();
    let lineEnd;
    while ((lineEnd = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);
      if (line) {
        handleJsonRpcMessage(line);
      }
    }
  });
}

function sendResponse(id, result, error = null) {
  const response = {
    jsonrpc: '2.0',
    id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + '\n');
}

async function handleJsonRpcMessage(messageStr) {
  try {
    const request = JSON.parse(messageStr);
    const { method, id, params } = request;

    if (method === 'initialize') {
      sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'chatgpt-architect',
          version: '1.0.0'
        }
      });
    } else if (method === 'tools/list') {
      sendResponse(id, {
        tools: [
          {
            name: 'ask_architect',
            description: 'Ask ChatGPT (Chief Architect) for architectural decisions, system designs, and code reviews grounded in the Software Universe rules.',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'The query, task or design prompt.'
                },
                contextFiles: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional list of file paths in the workspace to load as code context.'
                }
              },
              required: ['prompt']
            }
          }
        ]
      });
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params;
      if (name === 'ask_architect') {
        const { prompt, contextFiles } = args;
        const systemContext = getArchitectContext(contextFiles);
        try {
          const answer = await callOpenAI(prompt, systemContext);
          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: answer
              }
            ]
          });
        } catch (err) {
          sendResponse(id, null, {
            code: -32000,
            message: err.message
          });
        }
      } else {
        sendResponse(id, null, {
          code: -32601,
          message: `Tool not found: ${name}`
        });
      }
    } else if (method === 'notifications' || !id) {
      // Ignore notifications/pings
    } else {
      sendResponse(id, null, {
        code: -32601,
        message: `Method not found: ${method}`
      });
    }
  } catch (err) {
    // Cannot send response back if JSON parsing failed, just output error to stderr
    console.error('Error handling JSON-RPC message:', err);
  }
}

// Direct CLI Execution Mode
async function runCliMode() {
  const args = process.argv.slice(2);
  let promptIndex = args.indexOf('--prompt');
  if (promptIndex === -1) {
    promptIndex = args.indexOf('-p');
  }

  if (promptIndex === -1 || promptIndex + 1 >= args.length) {
    console.log('Software Universe Chief Architect CLI');
    console.log('Usage: node scripts/chatgpt-architect.js --prompt "your design task" [--files file1.js,file2.js]');
    process.exit(1);
  }

  const prompt = args[promptIndex + 1];

  let files = [];
  let filesIndex = args.indexOf('--files');
  if (filesIndex === -1) {
    filesIndex = args.indexOf('-f');
  }
  if (filesIndex !== -1 && filesIndex + 1 < args.length) {
    files = args[filesIndex + 1].split(',').map(f => f.trim());
  }

  console.log('Hydrating architecture context...');
  const systemContext = getArchitectContext(files);

  console.log('Consulting Chief Architect (GPT-4o)...');
  try {
    const response = await callOpenAI(prompt, systemContext);
    console.log('\n--- ARCHITECT RESPONSE ---');
    console.log(response);
    console.log('--------------------------\n');
  } catch (err) {
    console.error('\nError contacting Chief Architect:', err.message);
    process.exit(1);
  }
}

// Main entry point
if (process.argv.includes('--mcp')) {
  startMcpServer();
} else {
  runCliMode();
}
