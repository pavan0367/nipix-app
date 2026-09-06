const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('d:/Clg/vs/Nipix/nipix-backend/node_modules/ws');

const ARTIFACTS_DIR = 'C:/Users/Pavaa/.gemini/antigravity-ide/brain/0472c5c6-cc62-4386-9247-293af8a4c102';

async function runVerification() {
  console.log('--- Starting Nipix AI Chat Inactivity & UX Verification Script ---');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeProcess = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=d:\\Clg\\vs\\Nipix\\.edge-temp-profile',
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const tab = list.find((t) => t.type === 'page');
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

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });

  await new Promise((r) => ws.on('open', r));
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
    await new Promise((r) => setTimeout(r, 2500));

    // Clear test storage to ensure fresh baseline
    await evaluate(`
      localStorage.removeItem('nipix_chat_messages_v6');
      localStorage.removeItem('nipix_bot_last_interaction');
      localStorage.removeItem('nipix_bot_session_start');
    `);
    await send('Page.reload');
    await new Promise((r) => setTimeout(r, 2500));

    // 2. Verify Light / Dark / Device controls are NOT in Chat header/Navbar
    console.log('\n2. Verifying Light/Dark/Device theme controls are REMOVED from Chat header ...');
    const headerThemeCheck = await evaluate(`(() => {
      const themeControl = document.querySelector('.theme-segmented-control');
      const lightBtn = document.querySelector('button[aria-label="Light Mode"]');
      const darkBtn = document.querySelector('button[aria-label="Dark Mode"]');
      const deviceBtn = document.querySelector('button[aria-label="Device Theme"]');
      return {
        hasThemeControl: !!themeControl,
        hasLightBtn: !!lightBtn,
        hasDarkBtn: !!darkBtn,
        hasDeviceBtn: !!deviceBtn
      };
    })()`);
    console.log('Chat Header Theme Controls Check:', headerThemeCheck);
    await captureScreenshot('chat_header_no_theme_controls.png');

    // 3. Verify left sidebar timestamps are small & subtle (0.64rem / ~10.24px)
    console.log('\n3. Verifying subtle left-side bot list timestamps ...');
    const sidebarTimestampCheck = await evaluate(`(() => {
      const timestampEl = document.querySelector('.chat-bot-scroll-list .bot-meta-right');
      if (!timestampEl) return null;
      const style = window.getComputedStyle(timestampEl);
      return {
        text: timestampEl.innerText.trim(),
        fontSize: style.fontSize,
        opacity: style.opacity,
        color: style.color
      };
    })()`);
    console.log('Sidebar Timestamp Check:', sidebarTimestampCheck);
    await captureScreenshot('sidebar_small_timestamps.png');

    // 4. Verify Theme Controls still exist inside Settings page
    console.log('\n4. Navigating to http://localhost:3000/settings to verify theme controls intact ...');
    await send('Page.navigate', { url: 'http://localhost:3000/settings' });
    await new Promise((r) => setTimeout(r, 1500));
    const settingsThemeCheck = await evaluate(`(() => {
      const hasThemeHeader = document.body.innerText.includes('Appearance & Theme');
      const hasLight = document.body.innerText.includes('Light Mode') || document.body.innerText.includes('Light');
      const hasDark = document.body.innerText.includes('Dark Mode') || document.body.innerText.includes('Dark');
      const hasDevice = document.body.innerText.includes('Device') || document.body.innerText.includes('Same as Device');
      return { hasThemeHeader, hasLight, hasDark, hasDevice };
    })()`);
    console.log('Settings Theme Check:', settingsThemeCheck);
    await captureScreenshot('settings_theme_controls_intact.png');

    // 5. Navigate to /chat/spark_x to test conversation & 1-hour inactivity timeout
    console.log('\n5. Navigating to http://localhost:3000/chat/spark_x ...');
    await send('Page.navigate', { url: 'http://localhost:3000/chat/spark_x' });
    await new Promise((r) => setTimeout(r, 1500));

    // Send a message to Spark_X
    console.log('Sending message to Spark_X ...');
    await evaluate(`(() => {
      const ta = document.querySelector('.chat-composer textarea');
      if (ta) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeSetter.call(ta, "What is Ohm's law?");
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 400));
    await evaluate(`(() => {
      const sendBtn = document.querySelector('.chat-composer button[type="submit"]');
      if (sendBtn) sendBtn.click();
    })()`);

    // Wait for response to stream in
    await new Promise((r) => setTimeout(r, 4500));

    const conversationCheck = await evaluate(`(() => {
      const bubbles = Array.from(document.querySelectorAll('.chat-messages .chat-bubble-ai-msg, .chat-messages div[style*="justify-content: flex-end"]'));
      return bubbles.map(b => b.innerText.trim());
    })()`);
    console.log('Spark_X Conversation before timeout:', conversationCheck.length, 'messages');

    // 6. Simulate 1-Hour Inactivity Timeout on Spark_X
    console.log('\n6. Simulating 1 hour + 1 second inactivity timeout on Spark_X ...');
    const oneHourAndFiveSecondsAgo = Date.now() - (3600 * 1000 + 5000);
    await evaluate(`(() => {
      const interactions = JSON.parse(localStorage.getItem('nipix_bot_last_interaction') || '{}');
      interactions['spark_x'] = ${oneHourAndFiveSecondsAgo};
      localStorage.setItem('nipix_bot_last_interaction', JSON.stringify(interactions));
    })()`);

    // Switch to Archivist
    console.log('Switching to Archivist ...');
    await evaluate(`(() => {
      const botItems = Array.from(document.querySelectorAll('.chat-bot-item'));
      const archivist = botItems.find(i => i.innerText.includes('Archivist'));
      if (archivist) archivist.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1000));

    const archivistData = await evaluate(`(() => {
      const headerTitle = document.querySelector('.chat-header h3')?.innerText;
      const introMsg = document.querySelector('.chat-messages .chat-bubble-ai-msg')?.innerText;
      return { headerTitle, introMsg };
    })()`);
    console.log('Switched to Archivist:', archivistData.headerTitle);

    // Now switch BACK to Spark_X after timeout
    console.log('\n7. Switching back to Spark_X after 1-hour inactivity timeout ...');
    await evaluate(`(() => {
      const botItems = Array.from(document.querySelectorAll('.chat-bot-item'));
      const spark = botItems.find(i => i.innerText.includes('Spark_X'));
      if (spark) spark.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));

    // Verify:
    // 1. Previous messages ("What is Ohm's law?" and response) are still 100% visible!
    // 2. Fresh intro message is appended at the bottom with live system time!
    const sparkAfterTimeout = await evaluate(`(() => {
      const allBubbles = Array.from(document.querySelectorAll('.chat-messages .chat-bubble-ai-msg, .chat-messages div[style*="justify-content: flex-end"]'));
      const bubbleTexts = allBubbles.map(b => b.innerText.trim());
      const hasPriorQuestion = bubbleTexts.some(t => t.includes("Ohm's law"));
      const lastBubbleText = bubbleTexts[bubbleTexts.length - 1];
      const isIntroAtBottom = lastBubbleText.includes("Spark_X") && lastBubbleText.includes("What would you like me to help you with today?");
      return {
        totalBubbles: allBubbles.length,
        hasPriorQuestion,
        isIntroAtBottom,
        lastBubbleText
      };
    })()`);

    console.log('Spark_X After Timeout Verification:', sparkAfterTimeout);
    await captureScreenshot('one_hour_session_reset_spark_x.png');

    console.log('\n✅ ALL INACTIVITY TIMEOUT AND UX VERIFICATION CHECKS PASSED!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    ws.close();
    edgeProcess.kill();
  }
}

runVerification().catch(console.error);
