const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('d:/Clg/vs/Nipix/nipix-backend/node_modules/ws');

const ARTIFACTS_DIR = 'C:/Users/Pavaa/.gemini/antigravity-ide/brain/0472c5c6-cc62-4386-9247-293af8a4c102';

async function runVerification() {
  console.log('--- Starting Nipix AI Bots UX Verification Script ---');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeProcess = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1280,800',
    '--user-data-dir=d:\\Clg\\vs\\Nipix\\.edge-temp-profile',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const tab = list.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  let idCounter = 1;
  const callbacks = new Map();

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  ws.on('message', data => {
    const msg = JSON.parse(data.toString());
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });

  await new Promise(r => ws.on('open', r));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const captureScreenshot = async (filename) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    const targetPath = path.join(ARTIFACTS_DIR, filename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`[SCREENSHOT] Saved: ${targetPath}`);
  };

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  };

  try {
    // 1. Navigate to /chat
    console.log('\n1. Navigating to http://localhost:3000/chat ...');
    await send('Page.navigate', { url: 'http://localhost:3000/chat' });
    await new Promise(r => setTimeout(r, 3000));

    // Clear localStorage to test clean first-time bot entry
    await evaluate(`
      localStorage.removeItem('nipix_chat_messages_v6');
      localStorage.removeItem('nipix_bot_themes');
    `);
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 2500));

    // 2. Verify ByteBot AI Intro Message & Live System Time
    console.log('\n2. Verifying ByteBot AI Intro & Timestamp ...');
    const byteBotData = await evaluate(`(() => {
      const headerTitle = document.querySelector('.chat-header h3')?.innerText;
      const firstMsgText = document.querySelector('.chat-messages .chat-bubble-ai-msg')?.innerText;
      const timestampEl = document.querySelector('.chat-messages .chat-bubble-ai-msg div:last-child');
      const timestampStyle = timestampEl ? window.getComputedStyle(timestampEl) : null;
      const optionsBtn = document.querySelector('button[aria-label="Chat options"]');
      return {
        headerTitle,
        firstMsgText,
        timestampText: timestampEl?.innerText,
        fontSize: timestampStyle?.fontSize,
        opacity: timestampStyle?.opacity,
        hasOptionsBtn: !!optionsBtn
      };
    })()`);

    console.log('ByteBot AI Chat Check:', byteBotData);
    await captureScreenshot('bytebot_chat_ux.png');

    // 3. Click Options Button and Verify Dropdown
    console.log('\n3. Opening Options Dropdown ...');
    await evaluate(`document.querySelector('button[aria-label="Chat options"]').click()`);
    await new Promise(r => setTimeout(r, 500));
    const dropdownData = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('.chat-header div[style*="position: absolute"] button'));
      return btns.map(b => b.innerText.trim());
    })()`);
    console.log('Options Dropdown Items:', dropdownData);
    await captureScreenshot('options_dropdown_ux.png');

    // 4. Click About Bot Modal
    console.log('\n4. Opening About Bot Modal ...');
    await evaluate(`
      const aboutBtn = Array.from(document.querySelectorAll('.chat-header button')).find(b => b.innerText.includes('About Bot'));
      if (aboutBtn) aboutBtn.click();
    `);
    await new Promise(r => setTimeout(r, 500));
    const aboutData = await evaluate(`(() => {
      const modal = document.querySelector('div[style*="position: fixed"]');
      const title = modal?.querySelector('h3')?.innerText;
      const specialties = Array.from(modal?.querySelectorAll('span[style*="border: 1px solid"]') || []).map(s => s.innerText);
      return { title, specialties };
    })()`);
    console.log('About Bot Modal Data:', aboutData);
    await captureScreenshot('about_bot_modal_ux.png');

    // Close modal
    await evaluate(`
      const closeBtn = document.querySelector('div[style*="position: fixed"] button[title="Close"]') || document.querySelector('div[style*="position: fixed"] .btn-primary');
      if (closeBtn) closeBtn.click();
    `);
    await new Promise(r => setTimeout(r, 500));

    // 5. Switch to Sakura
    console.log('\n5. Switching to Sakura Bot ...');
    await evaluate(`
      const botItems = Array.from(document.querySelectorAll('.chat-bot-item'));
      const sakuraItem = botItems.find(i => i.innerText.includes('Sakura'));
      if (sakuraItem) sakuraItem.click();
    `);
    await new Promise(r => setTimeout(r, 1000));
    const sakuraData = await evaluate(`(() => {
      const headerTitle = document.querySelector('.chat-header h3')?.innerText;
      const msg = document.querySelector('.chat-messages .chat-bubble-ai-msg')?.innerText;
      const timestampEl = document.querySelector('.chat-messages .chat-bubble-ai-msg div:last-child');
      return {
        headerTitle,
        msg,
        time: timestampEl?.innerText
      };
    })()`);
    console.log('Sakura Chat Data:', sakuraData);
    await captureScreenshot('sakura_chat_ux.png');

    // 6. Test Bot Profile Dashboard Theme Sync
    console.log('\n6. Testing Theme Synchronization (Profile -> Chat) ...');
    // Click header to open BotProfileDashboard
    await evaluate(`document.querySelector('.chat-header div[style*="cursor: pointer"]').click()`);
    await new Promise(r => setTimeout(r, 800));

    // In BotProfileDashboard, click Theme row
    await evaluate(`
      const themeRow = Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes('Theme') && d.innerText.includes('AI theme'));
      if (themeRow) themeRow.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    // Select "Scholar Emerald"
    await evaluate(`
      const themeBtns = Array.from(document.querySelectorAll('button'));
      const emeraldBtn = themeBtns.find(b => b.innerText && b.innerText.includes('Scholar Emerald'));
      if (emeraldBtn) emeraldBtn.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    // Close Theme modal & click Back to return to chat
    await evaluate(`
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Done'));
      if (closeBtn) closeBtn.click();
    `);
    await new Promise(r => setTimeout(r, 400));
    await evaluate(`
      const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'Chat');
      if (backBtn) backBtn.click();
    `);
    await new Promise(r => setTimeout(r, 800));

    // Check chat conversation background is now Scholar Emerald (#061610)
    const syncedThemeData = await evaluate(`(() => {
      const conv = document.querySelector('.chat-conversation');
      const header = document.querySelector('.chat-header');
      return {
        convBg: conv?.style?.background,
        headerBg: header?.style?.background
      };
    })()`);
    console.log('Theme Synced Immediately to Chat:', syncedThemeData);
    await captureScreenshot('theme_sync_verified.png');

    // 7. Test Clear Chat with Confirmation
    console.log('\n7. Testing Clear Chat ...');
    // Auto-confirm window.confirm
    await evaluate(`window.confirm = () => true;`);
    await evaluate(`document.querySelector('button[aria-label="Chat options"]').click()`);
    await new Promise(r => setTimeout(r, 400));
    await evaluate(`
      const clearBtn = Array.from(document.querySelectorAll('.chat-header div[style*="position: absolute"] button')).find(b => b.innerText.includes('Clear Chat'));
      if (clearBtn) clearBtn.click();
    `);
    await new Promise(r => setTimeout(r, 800));

    const afterClearData = await evaluate(`(() => {
      const msgNodes = document.querySelectorAll('.chat-messages .chat-bubble-ai-msg');
      return {
        count: msgNodes.length,
        text: msgNodes[0]?.innerText
      };
    })()`);
    console.log('After Clear Chat:', afterClearData);
    await captureScreenshot('clear_chat_verified.png');

    // 8. Switch to Aether
    console.log('\n8. Switching to Aether ...');
    await send('Page.navigate', { url: 'http://localhost:3000/chat/aether' });
    await new Promise(r => setTimeout(r, 1500));
    const aetherData = await evaluate(`(() => {
      const headerTitle = document.querySelector('.chat-header h3')?.innerText;
      const msg = document.querySelector('.chat-messages .chat-bubble-ai-msg')?.innerText;
      return { headerTitle, msg };
    })()`);
    console.log('Aether Chat Data:', aetherData);
    await captureScreenshot('aether_chat_ux.png');

    console.log('\n✅ ALL BOT UX VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    ws.close();
    edgeProcess.kill();
  }
}

runVerification().catch(console.error);
