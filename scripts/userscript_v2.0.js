// ==UserScript==
// @name         Software Universe Autonomous Agent Loop
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Establishes a continuous, hands-free loop between ChatGPT and Antigravity (v2.4 - Advanced Console & Diagnostics)
// @author       Antigravity
// @match        *://chatgpt.com/*
// @match        *://*.chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const LOCAL_SERVER = 'http://localhost:3000';
    const processedMessages = new Set();
    let isWaitingForResponse = false;
    let isActive = true;
    let lastActionTime = Date.now();
    let lastError = null;
    let isExpanded = false;
    let autoScroll = true;
    let logFilter = 'all';
    let searchText = '';
    let ui = null;
    let currentSessionId = '';
    let currentCycleId = 0;

    const uiLogs = [];
    const MAX_LOCAL_LOGS = 150;

    // ==========================================
    // LOGGING AND BACKEND SYNC LAYER
    // ==========================================
    function addLog(msg, level = 'info', source = 'userscript', details = null) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const logEntry = {
            timestamp,
            level,
            msg,
            source,
            details,
            sessionId: currentSessionId,
            cycleId: currentCycleId
        };

        uiLogs.push(logEntry);
        if (uiLogs.length > MAX_LOCAL_LOGS) {
            uiLogs.shift();
        }

        console.log(`[AI Loop] [${source.toUpperCase()}] [${level.toUpperCase()}] ${msg}`);
        
        // Asynchronously sync log to bridge server
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${LOCAL_SERVER}/bridge/log`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ level, msg, source, details, sessionId: currentSessionId, cycleId: currentCycleId }),
            onload: () => {},
            onerror: (err) => console.warn("Failed to sync log to server:", err)
        });

        updateUI();
    }

    // Hydrate logs from server on startup
    function hydrateLogs() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${LOCAL_SERVER}/bridge/logs`,
            onload: function(response) {
                try {
                    const logs = JSON.parse(response.responseText);
                    uiLogs.length = 0;
                    logs.forEach(log => {
                        const date = new Date(log.timestamp);
                        log.timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        uiLogs.push(log);
                    });
                    addLog("Startup log history hydrated from server.", "success", "system");
                } catch (e) {
                    addLog("Could not parse server logs on startup.", "warn", "system");
                }
            },
            onerror: function() {
                addLog("Could not connect to log server on startup.", "warn", "system");
            }
        });
    }

    addLog("Script v2.4 initialized. Syncing server...", "info", "system");
    hydrateLogs();

    // ==========================================
    // VIRTUAL STORAGE FALLBACK LAYER (Quota Limit Bypass)
    // ==========================================
    const virtualLocalStorage = new Map();
    const virtualSessionStorage = new Map();

    function patchStorage(storageName, virtualStorage) {
        try {
            const storage = window[storageName];
            if (!storage) return;

            const originalSetItem = storage.setItem;
            const originalGetItem = storage.getItem;
            const originalRemoveItem = storage.removeItem;
            const originalClear = storage.clear;

            storage.setItem = function(key, value) {
                const keyStr = String(key);
                const valueStr = String(value);
                const size = (keyStr.length + valueStr.length) * 2;
                if (size > 2 * 1024 * 1024) {
                    virtualStorage.set(keyStr, valueStr);
                    return;
                }

                try {
                    originalSetItem.call(storage, keyStr, valueStr);
                    virtualStorage.delete(keyStr);
                } catch (e) {
                    if (e.name === 'QuotaExceededError' || e.code === 22 || e.number === -2147024882 || (e.message && e.message.includes('quota'))) {
                        virtualStorage.set(keyStr, valueStr);
                        // Safe clean up of telemetries and caches
                        for (let i = storage.length - 1; i >= 0; i--) {
                            const k = storage.key(i);
                            if (k && (k.startsWith('cache/') || k.includes('system-connectors') || k.includes('telemetry'))) {
                                try { originalRemoveItem.call(storage, k); } catch(_) {}
                            }
                        }
                    } else {
                        throw e;
                    }
                }
            };

            storage.getItem = function(key) {
                const keyStr = String(key);
                if (virtualStorage.has(keyStr)) {
                    return virtualStorage.get(keyStr);
                }
                return originalGetItem.call(storage, keyStr);
            };

            storage.removeItem = function(key) {
                const keyStr = String(key);
                virtualStorage.delete(keyStr);
                try { originalRemoveItem.call(storage, keyStr); } catch(_) {}
            };

            storage.clear = function() {
                virtualStorage.clear();
                try { originalClear.call(storage); } catch(_) {}
            };
        } catch (err) {
            console.error(`AI Loop: Failed to patch ${storageName}:`, err);
        }
    }

    try {
        patchStorage('localStorage', virtualLocalStorage);
        patchStorage('sessionStorage', virtualSessionStorage);
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('cache/') || k.includes('system-connectors') || k.includes('telemetry'))) {
                localStorage.removeItem(k);
            }
        }
    } catch (e) {
        console.error("AI Loop: Storage cleanup failed:", e);
    }

    // ==========================================
    // RESILIENT DOM SELECTOR GROUP
    // ==========================================
    const SELECTORS = {
        textarea: () => document.querySelector('#prompt-textarea') || 
                          document.querySelector('textarea[placeholder*="ChatGPT"]') || 
                          document.querySelector('[data-testid="textbox"]'),
        
        sendButton: () => document.querySelector('button[data-testid="send-button"]') || 
                            document.querySelector('button[aria-label="Send message"]') || 
                            document.querySelector('button[data-testid="composer-send-button"]'),
        
        streaming: () => document.querySelector('.result-streaming') || 
                           document.querySelector('button[aria-label="Stop generating"]') || 
                           document.querySelector('button[data-testid="stop-button"]') || 
                           document.querySelector('button[aria-label="Cancel"]'),
        
        assistantMessages: () => {
            const r1 = document.querySelectorAll('[data-author-role="assistant"]');
            if (r1 && r1.length > 0) return r1;
            const r2 = document.querySelectorAll('.markdown.prose');
            if (r2 && r2.length > 0) return r2;
            return document.querySelectorAll('div.agent-turn');
        }
    };

    // ==========================================
    // FLOATING VISUAL DASHBOARD UI
    // ==========================================
    ui = document.createElement('div');
    ui.id = 'sw-agent-loop-ui';
    ui.style.position = 'fixed';
    ui.style.bottom = '20px';
    ui.style.right = '20px';
    ui.style.zIndex = '999999';
    ui.style.width = '380px';
    ui.style.padding = '14px';
    ui.style.borderRadius = '16px';
    ui.style.background = 'rgba(30, 30, 46, 0.95)';
    ui.style.backdropFilter = 'blur(12px)';
    ui.style.color = '#CDD6F4';
    ui.style.border = '2px solid #FAB387';
    ui.style.fontFamily = "'Fira Code', 'JetBrains Mono', monospace";
    ui.style.fontSize = '12px';
    ui.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.6)';
    ui.style.display = 'flex';
    ui.style.flexDirection = 'column';
    ui.style.gap = '10px';
    ui.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';

    function getFilteredLogs() {
        return uiLogs.filter(log => {
            // Text search filter
            if (searchText) {
                const query = searchText.toLowerCase();
                const matchesText = log.msg.toLowerCase().includes(query) || 
                                    (log.level && log.level.toLowerCase().includes(query)) ||
                                    (log.source && log.source.toLowerCase().includes(query));
                if (!matchesText) return false;
            }

            // Category tab filter
            if (logFilter === 'all') return true;
            if (logFilter === 'errors') return log.level === 'error' || log.level === 'warn';
            if (logFilter === 'system') return log.source === 'system';
            if (logFilter === 'dom') return log.source === 'dom' || log.msg.includes('DOM') || log.msg.includes('button') || log.msg.includes('textarea');
            if (logFilter === 'network') return log.source === 'server' || log.source === 'network' || log.msg.includes('Poll') || log.msg.includes('Sync') || log.msg.includes('Request');
            if (logFilter === 'professor') return log.source === 'professor' || log.msg.toLowerCase().includes('professor') || log.msg.toLowerCase().includes('concept');
            if (logFilter === 'simulator') return log.source === 'simulator' || log.msg.toLowerCase().includes('simulat');
            if (logFilter === 'dependency') return log.source === 'dependency' || log.msg.toLowerCase().includes('depend');
            if (logFilter === 'chaos') return log.source === 'chaosmonkey' || log.msg.toLowerCase().includes('chaos') || log.msg.toLowerCase().includes('monkey') || log.msg.toLowerCase().includes('havoc');
            return true;
        });
    }

    function updateUI() {
        if (!ui) return;
        let statusColor = '#A6E3A1'; // green
        let statusText = 'IDLE (Polling)';
        if (!isActive) {
            statusColor = '#F38BA8'; // red
            statusText = 'PAUSED';
        } else if (isWaitingForResponse) {
            statusColor = '#F9E2AF'; // yellow
            statusText = 'WAITING FOR RESP';
        }

        const timeSinceAction = Math.round((Date.now() - lastActionTime) / 1000);
        const filtered = getFilteredLogs();

        // Color coding function for rendering logs
        const getLogColor = (log) => {
            if (log.level === 'error') return '#F38BA8'; // Red
            if (log.level === 'warn') return '#F9E2AF'; // Yellow
            if (log.level === 'success') return '#A6E3A1'; // Green
            if (log.source === 'server') return '#94E2D5'; // Teal
            if (log.source === 'system') return '#CBA6F7'; // Lavender
            if (log.source === 'dom') return '#89B4FA'; // Sapphire
            if (log.source === 'professor') return '#F2CDCD'; // Rose
            if (log.source === 'simulator') return '#A6E3A1'; // Green
            if (log.source === 'dependency') return '#89DCEB'; // Sky
            if (log.source === 'chaosmonkey') return '#FAB387'; // Peach
            if (log.source === 'performance') return '#EBA0F0'; // Light magenta
            return '#CDD6F4'; // Text default
        };

        const logsHTML = filtered.map(log => {
            const color = getLogColor(log);
            const srcTag = `[${log.source.substring(0, 6).toUpperCase()}][C:${log.cycleId || 0}]`;
            return `<div style="color: ${color}; word-break: break-all; margin-bottom: 4px; line-height: 1.4;">
                <span style="opacity: 0.5;">${log.timestamp}</span> 
                <span style="font-weight: bold; opacity: 0.85;">${srcTag}</span> 
                ${log.msg}
            </div>`;
        }).join('');

        ui.style.height = isExpanded ? '460px' : '230px';

        ui.innerHTML = `
            <div id="sw-panel-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #313244; padding-bottom: 8px; cursor: pointer; user-select: none;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: bold; color: #FAB387; font-size: 13px;">🤖 SW LOOP v2.4</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${statusColor}; font-weight: bold; font-size: 11px;">● ${statusText}</span>
                    <span style="font-size: 12px; color: #6C7086;">${isExpanded ? '▼' : '▲'}</span>
                </div>
            </div>
            
            <div style="color: #A6ADC8; font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; border-bottom: 1px solid #313244; padding-bottom: 6px;">
                <div>State: <span style="font-weight:bold; color:#CDD6F4;">${isActive ? 'RUNNING' : 'STOPPED'}</span></div>
                <div>Last Action: <span style="font-weight:bold; color:#CDD6F4;">${timeSinceAction}s ago</span></div>
                <div>Processed Count: <span style="font-weight:bold; color:#CDD6F4;">${processedMessages.size}</span></div>
                <div style="grid-column: span 2; color: #F38BA8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    Err: ${lastError ? lastError.message : 'none'}
                </div>
            </div>
            
            ${isExpanded ? `
            <!-- Expanded Controls & Filters -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 2px;">
                    <span class="sw-tab" data-filter="all" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'all' ? '#FAB387; color:#11111B;' : '#313244; color:#CDD6F4;'}">ALL</span>
                    <span class="sw-tab" data-filter="system" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'system' ? '#CBA6F7; color:#11111B;' : '#313244; color:#CDD6F4;'}">SYSTEM</span>
                    <span class="sw-tab" data-filter="dom" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'dom' ? '#89B4FA; color:#11111B;' : '#313244; color:#CDD6F4;'}">DOM</span>
                    <span class="sw-tab" data-filter="network" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'network' ? '#94E2D5; color:#11111B;' : '#313244; color:#CDD6F4;'}">NET</span>
                    <span class="sw-tab" data-filter="errors" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'errors' ? '#F38BA8; color:#11111B;' : '#313244; color:#CDD6F4;'}">ERRORS</span>
                    <span class="sw-tab" data-filter="professor" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'professor' ? '#F2CDCD; color:#11111B;' : '#313244; color:#CDD6F4;'}">PROF</span>
                    <span class="sw-tab" data-filter="simulator" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'simulator' ? '#A6E3A1; color:#11111B;' : '#313244; color:#CDD6F4;'}">SIM</span>
                    <span class="sw-tab" data-filter="dependency" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'dependency' ? '#89DCEB; color:#11111B;' : '#313244; color:#CDD6F4;'}">DEP</span>
                    <span class="sw-tab" data-filter="chaos" style="padding: 2px 6px; border-radius: 4px; font-size: 9.5px; cursor: pointer; font-weight: bold; background: ${logFilter === 'chaos' ? '#FAB387; color:#11111B;' : '#313244; color:#CDD6F4;'}">CHAOS</span>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <input type="text" id="sw-search" placeholder="Search logs..." value="${searchText}" style="flex: 1; padding: 4px 8px; font-size: 10px; border-radius: 6px; border: 1px solid #313244; background: #11111B; color: #CDD6F4; outline: none; font-family: monospace;" />
                    <label style="font-size: 10px; display: flex; align-items: center; gap: 3px; cursor: pointer; color: #A6ADC8; user-select: none;">
                        <input type="checkbox" id="sw-autoscroll" ${autoScroll ? 'checked' : ''} style="cursor: pointer;" />
                        Scroll
                    </label>
                </div>
            </div>
            ` : ''}

            <!-- Live Logs Terminal -->
            <div id="sw-log-terminal" style="flex: 1; background: #11111B; border: 1px solid #313244; border-radius: 10px; padding: 10px; overflow-y: auto; display: flex; flex-direction: column; font-size: 10.5px;">
                ${logsHTML ? logsHTML : '<div style="color: #6C7086; text-align: center; margin-top: 20px;">No logs match filters.</div>'}
            </div>

            <!-- Dashboard Button Panel -->
            <div style="display: flex; gap: 6px; margin-top: 2px;">
                <button id="sw-btn-toggle" style="flex: 1; padding: 8px 6px; border: none; border-radius: 8px; background: #45475A; color: #CDD6F4; cursor: pointer; font-size: 11px; font-weight: bold; font-family: monospace; transition: background 0.2s;">
                    ${isActive ? '⏸ PAUSE' : '▶ RESUME'}
                </button>
                <button id="sw-btn-reset" style="flex: 1; padding: 8px 6px; border: none; border-radius: 8px; background: #45475A; color: #CDD6F4; cursor: pointer; font-size: 11px; font-weight: bold; font-family: monospace; transition: background 0.2s;">
                    ↻ RESET
                </button>
                <button id="sw-btn-poll" style="flex: 1; padding: 8px 6px; border: none; border-radius: 8px; background: #89B4FA; color: #11111B; cursor: pointer; font-size: 11px; font-weight: bold; font-family: monospace; transition: background 0.2s;">
                    ⚡ POLL
                </button>
            </div>

            ${isExpanded ? `
            <!-- Secondary Utility Panel -->
            <div style="display: flex; gap: 6px; margin-top: -2px;">
                <button id="sw-btn-diagnose" style="flex: 1.2; padding: 5px 6px; border: none; border-radius: 6px; background: #CBA6F7; color: #11111B; cursor: pointer; font-size: 9.5px; font-weight: bold; font-family: monospace;">
                    🛠 DIAGNOSE DOM
                </button>
                <button id="sw-btn-download" style="flex: 1; padding: 5px 6px; border: none; border-radius: 6px; background: #313244; color: #CDD6F4; cursor: pointer; font-size: 9.5px; font-weight: bold; font-family: monospace;">
                    💾 DOWNLOAD
                </button>
                <button id="sw-btn-clear" style="flex: 1; padding: 5px 6px; border: none; border-radius: 6px; background: #F38BA8; color: #11111B; cursor: pointer; font-size: 9.5px; font-weight: bold; font-family: monospace;">
                    🗑 CLEAR
                </button>
            </div>
            ` : ''}
        `;

        // Register main control event listeners
        ui.querySelector('#sw-panel-header').addEventListener('click', () => {
            isExpanded = !isExpanded;
            updateUI();
        });

        ui.querySelector('#sw-btn-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            isActive = !isActive;
            lastActionTime = Date.now();
            addLog(isActive ? "Loop Resumed." : "Loop Paused.", "info", "system");
        });

        ui.querySelector('#sw-btn-reset').addEventListener('click', (e) => {
            e.stopPropagation();
            isWaitingForResponse = false;
            processedMessages.clear();
            lastError = null;
            lastActionTime = Date.now();
            addLog("Manual state reset triggered.", "info", "system");
            runLoop();
        });

        ui.querySelector('#sw-btn-poll').addEventListener('click', (e) => {
            e.stopPropagation();
            lastActionTime = Date.now();
            addLog("Manual force-poll triggered.", "info", "system");
            forcePoll();
        });

        // Register conditional expanded logs listeners
        if (isExpanded) {
            const tabs = ui.querySelectorAll('.sw-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    logFilter = e.target.getAttribute('data-filter');
                    updateUI();
                });
            });

            const searchInput = ui.querySelector('#sw-search');
            searchInput.addEventListener('input', (e) => {
                searchText = e.target.value;
                // Re-render logs matching text without full page refresh
                const terminal = ui.querySelector('#sw-log-terminal');
                if (terminal) {
                    const filteredLogs = getFilteredLogs().map(log => {
                        const color = getLogColor(log);
                        const srcTag = `[${log.source.substring(0, 4).toUpperCase()}]`;
                        return `<div style="color: ${color}; word-break: break-all; margin-bottom: 4px; line-height: 1.4;">
                            <span style="opacity: 0.5;">${log.timestamp}</span> 
                            <span style="font-weight: bold; opacity: 0.85;">${srcTag}</span> 
                            ${log.msg}
                        </div>`;
                    }).join('');
                    terminal.innerHTML = filteredLogs ? filteredLogs : '<div style="color: #6C7086; text-align: center; margin-top: 20px;">No logs match filters.</div>';
                }
            });

            const autoscrollCb = ui.querySelector('#sw-autoscroll');
            autoscrollCb.addEventListener('change', (e) => {
                autoScroll = e.target.checked;
            });

            ui.querySelector('#sw-btn-diagnose').addEventListener('click', (e) => {
                e.stopPropagation();
                runDiagnostics();
            });

            ui.querySelector('#sw-btn-download').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadLogs();
            });

            ui.querySelector('#sw-btn-clear').addEventListener('click', (e) => {
                e.stopPropagation();
                clearLogsOnServer();
            });
        }

        // Scroll terminal to bottom if enabled
        if (autoScroll) {
            const terminal = ui.querySelector('#sw-log-terminal');
            if (terminal) {
                terminal.scrollTop = terminal.scrollHeight;
            }
        }
    }

    // Append and keep attached UI check
    function ensureUIAttached() {
        if (document.body && !document.getElementById('sw-agent-loop-ui')) {
            document.body.appendChild(ui);
            updateUI();
            addLog("Visual floating console attached to DOM.", "success", "system");
        }
    }

    const appendInterval = setInterval(ensureUIAttached, 250);

    // ==========================================
    // DIAGNOSTIC CHECKS & UTILITIES
    // ==========================================
    function runDiagnostics() {
        addLog("Starting diagnostic checks...", "info", "system");
        
        // 1. Check Local Server Connection
        const start = Date.now();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${LOCAL_SERVER}/bridge/logs`,
            onload: () => {
                const latency = Date.now() - start;
                addLog(`Server Connection: Connected (Latency: ${latency}ms)`, "success", "system");
            },
            onerror: (err) => {
                addLog(`Server Connection: Failed to reach ${LOCAL_SERVER}`, "error", "system");
            }
        });

        // 2. Check DOM Textarea
        const textarea = SELECTORS.textarea();
        if (textarea) {
            addLog(`DOM Check: Input Textarea found (${textarea.tagName} ${textarea.id || textarea.className})`, "success", "dom");
        } else {
            addLog("DOM Check: Input Textarea NOT found!", "error", "dom");
        }

        // 3. Check DOM Send Button
        const sendBtn = SELECTORS.sendButton();
        if (sendBtn) {
            addLog(`DOM Check: Send Button found (Selector match)`, "success", "dom");
        } else {
            addLog("DOM Check: Send Button NOT found!", "error", "dom");
        }

        // 4. Check Active Streaming State
        const streaming = SELECTORS.streaming();
        addLog(`State Check: Assistant generation is ${streaming ? 'ACTIVE (streaming)' : 'INACTIVE (idle)'}`, "info", "system");
    }

    function downloadLogs() {
        const textContent = uiLogs.map(log => `[${log.timestamp}] [${log.source.toUpperCase()}] [${log.level.toUpperCase()}] ${log.msg}`).join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chatgpt_loop_${new Date().toISOString().slice(0,10)}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLog("Local logs download initiated.", "success", "system");
    }

    function clearLogsOnServer() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${LOCAL_SERVER}/bridge/clear-logs`,
            onload: () => {
                uiLogs.length = 0;
                addLog("Central logs cleared successfully.", "success", "system");
            },
            onerror: () => {
                addLog("Failed to send clear command to server.", "error", "system");
            }
        });
    }

    // ==========================================
    // BULLETPROOF INPUT INSERTION ENGINE
    // ==========================================
    function writeToContentEditable(element, text) {
        element.focus();
        
        // Method A: execCommand (safest for editor states)
        try {
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, text);
        } catch (e) {
            console.warn("execCommand failed:", e);
        }
        
        // Method B: textContent fallback
        if (element.textContent !== text) {
            element.textContent = text;
        }
        
        // Trigger React/Lexical events
        const events = ['input', 'change', 'textInput'];
        events.forEach(name => {
            const ev = new Event(name, { bubbles: true, cancelable: true });
            element.dispatchEvent(ev);
        });

        // Trigger input event with details for editor engines
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text
        });
        element.dispatchEvent(inputEvent);
    }

    // ==========================================
    // CORE COMMUNICATION & DOM POLL ENGINE
    // ==========================================
    function localRequest(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: `${LOCAL_SERVER}${endpoint}`,
                headers: data ? { "Content-Type": "application/json" } : {},
                data: data ? JSON.stringify(data) : null,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    function hashText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString();
    }

    function runLoop() {
        if (!isActive) return;

        // Ensure console is attached
        ensureUIAttached();

        try {
            const streaming = SELECTORS.streaming();
            if (streaming) {
                if (!isWaitingForResponse) {
                    isWaitingForResponse = true;
                    lastActionTime = Date.now();
                    addLog("Detected ChatGPT response generation starting...", "info", "system");
                }
                return;
            }

            // Deadlock / Stall Detection & Auto-Healing:
            const timeSinceLastAction = Date.now() - lastActionTime;
            if (isWaitingForResponse && timeSinceLastAction > 45000) {
                addLog(`Detected wait stall (${Math.round(timeSinceLastAction / 1000)}s). Healing wait lock.`, "warn", "system");
                isWaitingForResponse = false;
                lastActionTime = Date.now();
                updateUI();
            }

            const assistantMessages = SELECTORS.assistantMessages();
            if (assistantMessages.length > 0) {
                const lastMsg = assistantMessages[assistantMessages.length - 1];
                const msgId = hashText(lastMsg.innerText);

                // If ChatGPT finished generating a new response, process it (even if wait lock expired)
                if (!processedMessages.has(msgId)) {
                    processedMessages.add(msgId);
                    isWaitingForResponse = false;
                    lastActionTime = Date.now();

                    const textContent = lastMsg.innerText;
                    addLog(`Processing new response (ID: ${msgId.substring(0, 6)})...`, "info", "system");

                    // Parse commands
                    const writeMatch = textContent.match(/\[WRITE_FILE:\s*([^\s\]]+)\]\s*\n*```[a-zA-Z]*\n([\s\S]*?)\n```/);
                    const readMatch = textContent.match(/\[READ_FILE:\s*([^\s\]]+)\]/);
                    const listMatch = textContent.match(/\[LIST_DIR:\s*([^\s\]]+)\]/);

                    if (writeMatch) {
                        const filePath = writeMatch[1];
                        const fileContent = writeMatch[2];
                        addLog(`Command: WRITE_FILE -> ${filePath}`, "info", "dom");
                        localRequest('POST', '/bridge/write', { path: filePath, content: fileContent })
                            .then(() => {
                                addLog(`Success: Wrote ${filePath}`, "success", "dom");
                                submitResponse(`[BRIDGE_RESPONSE: WRITE_FILE ${filePath}]\n\nSuccessfully wrote file.`);
                            })
                            .catch(err => {
                                addLog(`Err writing file: ${err.message}`, "error", "dom");
                                submitResponse(`[BRIDGE_RESPONSE: WRITE_FILE ${filePath}]\n\nError: ${err.message}`);
                            });
                    } else if (readMatch) {
                        const filePath = readMatch[1];
                        addLog(`Command: READ_FILE -> ${filePath}`, "info", "dom");
                        localRequest('GET', `/bridge/file?path=${encodeURIComponent(filePath)}`)
                            .then(content => {
                                addLog(`Success: Read ${filePath}`, "success", "dom");
                                submitResponse(`[BRIDGE_RESPONSE: READ_FILE ${filePath}]\n\n\`\`\`\n${content}\n\`\`\``);
                            })
                            .catch(err => {
                                addLog(`Err reading file: ${err.message}`, "error", "dom");
                                submitResponse(`[BRIDGE_RESPONSE: READ_FILE ${filePath}]\n\nError: ${err.message}`);
                            });
                    } else if (listMatch) {
                        const dirPath = listMatch[1];
                        addLog(`Command: LIST_DIR -> ${dirPath}`, "info", "dom");
                        localRequest('GET', `/bridge/list?path=${encodeURIComponent(dirPath)}`)
                            .then(listJson => {
                                addLog(`Success: Listed ${dirPath}`, "success", "dom");
                                submitResponse(`[BRIDGE_RESPONSE: LIST_DIR ${dirPath}]\n\n\`\`\`json\n${listJson}\n\`\`\``);
                            })
                            .catch(err => {
                                addLog(`Err listing dir: ${err.message}`, "error", "dom");
                                submitResponse(`[BRIDGE_RESPONSE: LIST_DIR ${dirPath}]\n\nError: ${err.message}`);
                            });
                    } else {
                        // Normal sync to AI_BRIDGE.md
                        localRequest('POST', '/bridge/receive', { content: textContent })
                            .then(() => addLog("Success: Synced response to AI_BRIDGE.md", "success", "system"))
                            .catch(err => { lastError = err; addLog(`Sync Error: ${err.message}`, "error", "system"); });
                    }
                    return;
                }
            }

            // 3. Poll local server if idle
            if (!isWaitingForResponse) {
                localRequest('GET', '/bridge/poll')
                    .then(res => {
                        const data = JSON.parse(res);
                        if (data && data.sessionId) {
                            currentSessionId = data.sessionId;
                            currentCycleId = data.cycleId;
                        }
                        if (data && data.messages && data.messages.length > 0) {
                            const msg = data.messages[0];
                            addLog(`Polled pending prompt (ID: ${msg.id.substring(0,8)}, Size: ${(msg.message.length / 1024).toFixed(2)} KB) [Cycle ID: ${msg.cycleId}].`, "info", "system");
                            sendToChatGPT(msg.message, msg.id);
                        }
                    })
                    .catch(err => {
                        lastError = err;
                        console.error("AI Loop: Polling error:", err);
                    });
            }
        } catch (err) {
            lastError = err;
            console.error("AI Loop error:", err);
        }
    }

    function forcePoll() {
        localRequest('GET', '/bridge/poll')
            .then(res => {
                const data = JSON.parse(res);
                if (data && data.sessionId) {
                    currentSessionId = data.sessionId;
                    currentCycleId = data.cycleId;
                }
                if (data && data.messages && data.messages.length > 0) {
                    const msg = data.messages[0];
                    addLog(`Polled new prompt (ID: ${msg.id.substring(0,8)}, Size: ${(msg.message.length / 1024).toFixed(2)} KB).`, "info", "system");
                    sendToChatGPT(msg.message, msg.id);
                } else {
                    addLog("Poll complete: No pending prompts.", "info", "system");
                }
            })
            .catch(err => {
                lastError = err;
                addLog(`Force-poll Error: ${err.message}`, "error", "system");
            });
    }

    function sendToChatGPT(text, messageId) {
        const textarea = SELECTORS.textarea();
        if (!textarea) {
            addLog("Err: Textarea not found in DOM. Will retry on next poll.", "error", "dom");
            lastError = new Error("Textarea not found");
            return;
        }

        addLog("Inserting prompt text...", "info", "dom");
        writeToContentEditable(textarea, text);
        
        setTimeout(() => {
            const sendBtn = SELECTORS.sendButton();
            if (sendBtn) {
                addLog("Clicking send button...", "info", "dom");
                sendBtn.click();
                isWaitingForResponse = true;
                lastActionTime = Date.now();
                
                // Acknowledge to server that message was successfully sent to DOM
                if (messageId) {
                    localRequest('POST', '/bridge/ack', { messageId })
                        .then(() => addLog(`ACKed message ${messageId.substring(0,8)} to server.`, "success", "system"))
                        .catch(err => addLog(`ACK failed: ${err.message}`, "warn", "system"));
                }
                
                updateUI();
            } else {
                addLog("Err: Send button not found in DOM. Will retry on next poll.", "error", "dom");
                lastError = new Error("Send button not found");
            }
        }, 600);
    }

    function submitResponse(text) {
        const textarea = SELECTORS.textarea();
        if (!textarea) {
            isWaitingForResponse = false;
            return;
        }
        addLog("Submitting response back...", "info", "dom");
        writeToContentEditable(textarea, text);

        setTimeout(() => {
            const sendBtn = SELECTORS.sendButton();
            if (sendBtn) {
                sendBtn.click();
            }
            isWaitingForResponse = true;
            lastActionTime = Date.now();
            updateUI();
        }, 600);
    }

    // Startup sync
    const startSyncInterval = setInterval(() => {
        const assistantMessages = SELECTORS.assistantMessages();
        if (assistantMessages.length > 0) {
            clearInterval(startSyncInterval);
            const lastMsg = assistantMessages[assistantMessages.length - 1];
            const msgId = hashText(lastMsg.innerText);
            processedMessages.add(msgId);
            addLog("Syncing startup message state...", "info", "system");
            localRequest('POST', '/bridge/receive', { content: lastMsg.innerText })
                .then(() => addLog("Startup state synced.", "success", "system"))
                .catch(err => { lastError = err; addLog(`Startup Sync Error: ${err.message}`, "error", "system"); });
        }
    }, 500);
    setTimeout(() => clearInterval(startSyncInterval), 10000);

    // Poll loop every 1.5 seconds
    setInterval(runLoop, 1500);
})();
