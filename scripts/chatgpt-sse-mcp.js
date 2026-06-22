#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const sessions = new Map();
const pendingBuilderMessages = [];
const serverLogs = [];
const MAX_LOGS = 100;

const sessionId = crypto.randomUUID();
let currentCycleId = 0;

function appendServerLog(level, msg, source = 'server', details = null, logCycleId = currentCycleId) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    msg,
    source,
    details,
    sessionId,
    cycleId: logCycleId
  };
  serverLogs.push(logEntry);
  if (serverLogs.length > MAX_LOGS) {
    serverLogs.shift();
  }
  try {
    const logsDir = path.join(__dirname, '..', 'docs/architect_logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logLine = `[${logEntry.timestamp}] [SID:${sessionId.substring(0,8)}] [CID:${logEntry.cycleId}] [${source.toUpperCase()}] [${level.toUpperCase()}] ${msg}${details ? ' - ' + JSON.stringify(details) : ''}\n`;
    fs.appendFileSync(path.join(logsDir, 'loop.log'), logLine, 'utf8');
  } catch (err) {
    console.error("Error writing server log file:", err.message);
  }
}


// Helper to check if a path is safe (within workspace)
function isPathSafe(relativePath) {
  const absolutePath = path.resolve(path.join(__dirname, '..', relativePath));
  const workspaceRoot = path.resolve(path.join(__dirname, '..'));
  return absolutePath.startsWith(workspaceRoot);
}

// Tool implementations
const tools = {
  get_constitution: () => {
    try {
      const vision = fs.readFileSync(path.join(__dirname, '..', 'docs/01-VISION-AND-RULES.md'), 'utf8');
      const spec = fs.readFileSync(path.join(__dirname, '..', 'docs/02-PRODUCT-SPEC.md'), 'utf8');
      const observatory = fs.readFileSync(path.join(__dirname, '..', 'docs/OBSERVATORY.md'), 'utf8');
      return {
        content: [{
          type: 'text',
          text: `=== CONSTITUTION ===\n\n${vision}\n\n=== SPEC ===\n\n${spec}\n\n=== OBSERVATORY ===\n\n${observatory}`
        }]
      };
    } catch (err) {
      return { content: [{ type: 'text', text: `Error reading constitution: ${err.message}` }] };
    }
  },

  list_directory: (args) => {
    const dirPath = args.path || '.';
    if (!isPathSafe(dirPath)) {
      return { content: [{ type: 'text', text: 'Error: Path access denied (outside workspace)' }] };
    }
    try {
      const fullPath = path.join(__dirname, '..', dirPath);
      const items = fs.readdirSync(fullPath, { withFileTypes: true });
      const result = items.map(item => ({
        name: item.name,
        type: item.isDirectory() ? 'directory' : 'file'
      }));
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      return { content: [{ type: 'text', text: `Error reading directory: ${err.message}` }] };
    }
  },

  view_file: (args) => {
    const filePath = args.path;
    if (!filePath || !isPathSafe(filePath)) {
      return { content: [{ type: 'text', text: 'Error: Invalid path or access denied' }] };
    }
    try {
      const fullPath = path.join(__dirname, '..', filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      return { content: [{ type: 'text', text: content }] };
    } catch (err) {
      return { content: [{ type: 'text', text: `Error reading file: ${err.message}` }] };
    }
  },

  edit_file: (args) => {
    const filePath = args.path;
    const content = args.content;
    if (!filePath || !isPathSafe(filePath) || content === undefined) {
      return { content: [{ type: 'text', text: 'Error: Invalid path, access denied, or missing content' }] };
    }
    try {
      const fullPath = path.join(__dirname, '..', filePath);
      // Ensure directory exists
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, 'utf8');
      return { content: [{ type: 'text', text: `Successfully wrote file to ${filePath}` }] };
    } catch (err) {
      return { content: [{ type: 'text', text: `Error writing file: ${err.message}` }] };
    }
  }
};

// Handle JSON-RPC request
async function handleJsonRpc(request, sessionId) {
  const { method, id, params } = request;

  if (method === 'initialize') {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'software-universe-mcp',
        version: '1.0.0'
      }
    };
  }

  if (method === 'tools/list') {
    return {
      tools: [
        {
          name: 'get_constitution',
          description: 'Get the Software Universe rules, spec, and Observatory checklist.',
          inputSchema: { type: 'object', properties: {} },
          outputSchema: {
            type: 'object',
            properties: {
              content: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    text: { type: 'string', description: 'The text of the constitution and rules.' }
                  }
                }
              }
            }
          }
        },
        {
          name: 'list_directory',
          description: 'List directories and files in a workspace folder.',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Relative path from workspace root (e.g. "components" or ".").' }
            }
          },
          outputSchema: {
            type: 'object',
            properties: {
              content: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    text: { type: 'string', description: 'JSON stringified array of files and directories.' }
                  }
                }
              }
            }
          }
        },
        {
          name: 'view_file',
          description: 'Read the contents of a file in the workspace.',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Relative path of the file.' }
            },
            required: ['path']
          },
          outputSchema: {
            type: 'object',
            properties: {
              content: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    text: { type: 'string', description: 'The plain text contents of the file.' }
                  }
                }
              }
            }
          }
        },
        {
          name: 'edit_file',
          description: 'Create a new file or overwrite an existing file in the workspace.',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'Relative path of the file.' },
              content: { type: 'string', description: 'Entire new contents for the file.' }
            },
            required: ['path', 'content']
          },
          outputSchema: {
            type: 'object',
            properties: {
              content: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    text: { type: 'string', description: 'Success or error message.' }
                  }
                }
              }
            }
          }
        }
      ]
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    if (tools[name]) {
      return tools[name](args);
    }
    throw new Error(`Tool not found: ${name}`);
  }

  return {};
}

// Server setup
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // SSE setup route
  if (req.method === 'GET' && url.pathname === '/sse') {
    const sessionId = crypto.randomUUID();
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    sessions.set(sessionId, res);
    
    // Write initial endpoint event pointing to the message route
    res.write(`event: endpoint\ndata: /message?sessionId=${sessionId}\n\n`);
    
    req.on('close', () => {
      sessions.delete(sessionId);
    });
    return;
  }

  // Messaging route
  if (req.method === 'POST' && url.pathname === '/message') {
    const sessionId = url.searchParams.get('sessionId');
    const sseResponse = sessions.get(sessionId);

    if (!sseResponse) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid or expired sessionId');
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const json = JSON.parse(body);
        const responsePayload = { jsonrpc: '2.0', id: json.id };

        try {
          const result = await handleJsonRpc(json, sessionId);
          responsePayload.result = result;
        } catch (err) {
          responsePayload.error = { code: -32000, message: err.message };
        }

        // Send back the response over the open SSE stream
        sseResponse.write(`event: message\ndata: ${JSON.stringify(responsePayload)}\n\n`);
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(`Invalid JSON: ${err.message}`);
      }
    });
    return;
  }

  // Bridge Poll Route
  if (req.method === 'GET' && url.pathname === '/bridge/poll') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      messages: pendingBuilderMessages,
      sessionId,
      cycleId: currentCycleId
    }));
    return;
  }

  // Bridge File Route (Read file contents)
  if (req.method === 'GET' && url.pathname === '/bridge/file') {
    const filePath = url.searchParams.get('path');
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing path parameter');
      return;
    }
    if (!isPathSafe(filePath)) {
      appendServerLog('error', `Access denied for reading file: ${filePath}`, 'server');
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied (outside workspace)');
      return;
    }
    try {
      const fullPath = path.join(__dirname, '..', filePath);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        appendServerLog('warn', `File not found: ${filePath}`, 'server');
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      const content = fs.readFileSync(fullPath, 'utf8');
      appendServerLog('info', `Successfully read file: ${filePath}`, 'server');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(content);
    } catch (err) {
      appendServerLog('error', `Error reading file ${filePath}: ${err.message}`, 'server');
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err.message);
    }
    return;
  }

  // Bridge List Route (List directory contents)
  if (req.method === 'GET' && url.pathname === '/bridge/list') {
    const dirPath = url.searchParams.get('path') || '.';
    if (!isPathSafe(dirPath)) {
      appendServerLog('error', `Access denied for listing directory: ${dirPath}`, 'server');
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied (outside workspace)');
      return;
    }
    try {
      const fullPath = path.join(__dirname, '..', dirPath);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
        appendServerLog('warn', `Directory not found: ${dirPath}`, 'server');
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Directory not found');
        return;
      }
      const items = fs.readdirSync(fullPath, { withFileTypes: true });
      const result = items.map(item => ({
        name: item.name,
        type: item.isDirectory() ? 'directory' : 'file'
      }));
      appendServerLog('info', `Successfully listed directory: ${dirPath}`, 'server');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result, null, 2));
    } catch (err) {
      appendServerLog('error', `Error listing directory ${dirPath}: ${err.message}`, 'server');
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err.message);
    }
    return;
  }

  // Bridge Receive Route
  if (req.method === 'POST' && url.pathname === '/bridge/receive') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.content) {
          const mailboxPath = path.join(__dirname, '..', 'docs/AI_BRIDGE.md');
          fs.writeFileSync(mailboxPath, json.content, 'utf8');
          console.log(`\n=== CHATGPT_MESSAGE_RECEIVED ===\n${json.content}\n=================================\n`);
          
          appendServerLog('info', 'Received response from ChatGPT. Syncing to AI_BRIDGE.md', 'server');

          // Archive response to docs/architect_logs
          const logsDir = path.join(__dirname, '..', 'docs/architect_logs');
          if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
          }
          const timestamp = new Date().toISOString().replace(/:/g, '-');
          const logFilePath = path.join(logsDir, `architect_response_${timestamp}.md`);
          fs.writeFileSync(logFilePath, json.content, 'utf8');
          
          const historyPath = path.join(logsDir, 'chat_history.md');
          const historyEntry = `\n\n## Architect Response - ${new Date().toISOString()}\n\n${json.content}\n\n---\n`;
          fs.appendFileSync(historyPath, historyEntry, 'utf8');
          
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Mailbox updated');
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing content');
        }
      } catch (err) {
        appendServerLog('error', `Error handling bridge receive: ${err.message}`, 'server');
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
    return;
  }

  // Bridge Write Route (Write file contents)
  if (req.method === 'POST' && url.pathname === '/bridge/write') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const { path: filePath, content } = json;
        if (!filePath || content === undefined) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing path or content parameter');
          return;
        }
        if (!isPathSafe(filePath)) {
          appendServerLog('error', `Access denied for writing file: ${filePath}`, 'server');
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Access denied (outside workspace)');
          return;
        }
        const fullPath = path.join(__dirname, '..', filePath);
        // Ensure parent directory exists
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, 'utf8');
        appendServerLog('info', `Successfully wrote to ${filePath}`, 'server');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Successfully wrote to ${filePath}`);
      } catch (err) {
        appendServerLog('error', `Error writing file ${filePath}: ${err.message}`, 'server');
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
    return;
  }

  // Bridge Send Route (For Builder)
  if (req.method === 'POST' && url.pathname === '/bridge/send') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.message) {
          currentCycleId++; // Increment cycle ID
          const msgId = crypto.randomUUID();
          pendingBuilderMessages.push({
            id: msgId,
            message: json.message,
            cycleId: currentCycleId
          });
          appendServerLog('info', `Builder queued new message (ID: ${msgId.substring(0,8)}, Size: ${(json.message.length/1024).toFixed(2)} KB)`, 'server');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'queued', messageId: msgId }));
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing message');
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
    return;
  }

  // Bridge Ack Route (Confirm successful DOM injection)
  if (req.method === 'POST' && url.pathname === '/bridge/ack') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const { messageId } = json;
        if (messageId) {
          const index = pendingBuilderMessages.findIndex(m => m.id === messageId);
          if (index !== -1) {
            pendingBuilderMessages.splice(index, 1);
            appendServerLog('info', `Acknowledged and removed message: ${messageId.substring(0,8)}`, 'server');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('ACK OK');
            return;
          }
        }
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Message ID not found or missing');
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
    return;
  }

  // POST /bridge/log
  if (req.method === 'POST' && url.pathname === '/bridge/log') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.msg && json.level) {
          appendServerLog(
            json.level, 
            json.msg, 
            json.source || 'userscript', 
            json.details,
            json.cycleId !== undefined ? json.cycleId : currentCycleId
          );
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Log captured');
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing log level or message');
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
    return;
  }

  // GET /bridge/logs
  if (req.method === 'GET' && url.pathname === '/bridge/logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(serverLogs));
    return;
  }

  // POST /bridge/clear-logs
  if (req.method === 'POST' && url.pathname === '/bridge/clear-logs') {
    serverLogs.length = 0;
    try {
      const logFile = path.join(__dirname, '..', 'docs/architect_logs/loop.log');
      if (fs.existsSync(logFile)) {
        fs.writeFileSync(logFile, '', 'utf8');
      }
      appendServerLog('info', 'Logs cleared by user request', 'server');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Logs cleared');
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err.message);
    }
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Software Universe MCP SSE Server running on http://localhost:${PORT}`);
  console.log(`SSE Route: http://localhost:${PORT}/sse`);
  console.log(`Message Route: http://localhost:${PORT}/message`);
});
