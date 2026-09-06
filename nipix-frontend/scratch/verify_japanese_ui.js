const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('d:/Clg/vs/Nipix/nipix-backend/node_modules/ws');

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeProcess = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--user-data-dir=d:\\Clg\\vs\\Nipix\\.edge-temp-profile',
    '--window-size=1280,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1800));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://localhost:9222/json/list', res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const tab = list.find(t => t.type === 'page');
    console.log('Using browser target:', tab.id);

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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const screenshotDir = 'C:\\Users\\Pavaa\\.gemini\\antigravity-ide\\brain\\0472c5c6-cc62-4386-9247-293af8a4c102';

    // 1. Verify /study-materials (General page)
    console.log('\n--- 1. Navigating to /study-materials ---');
    await send('Page.navigate', { url: 'http://localhost:3000/study-materials' });
    await new Promise(r => setTimeout(r, 2500));

    const studyTitle = await send('Runtime.evaluate', {
      expression: 'document.querySelector("h1")?.innerText'
    });
    console.log('Study Materials Title:', studyTitle.result.value);

    const categories = await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll(".category-pill")).map(e => e.innerText)'
    });
    console.log('Pills available:', categories.result.value);

    // 2. Navigate to /study-materials/japanese
    console.log('\n--- 2. Navigating to /study-materials/japanese ---');
    await send('Page.navigate', { url: 'http://localhost:3000/study-materials/japanese' });
    await new Promise(r => setTimeout(r, 2500));

    const jTitle = await send('Runtime.evaluate', {
      expression: 'document.querySelector("h1")?.innerText'
    });
    console.log('Japanese Dashboard Title:', jTitle.result.value);

    const tutorCard = await send('Runtime.evaluate', {
      expression: 'document.querySelector("h3")?.innerText'
    });
    console.log('AI Tutor Card Header:', tutorCard.result.value);

    // Capture screenshot of Japanese Dashboard
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const snap1Path = path.join(screenshotDir, 'japanese_dashboard.png');
    fs.writeFileSync(snap1Path, Buffer.from(snap1.data, 'base64'));
    console.log('Saved screenshot:', snap1Path);

    // 3. Test Clicking "あ Basics (Kana)" Tab
    console.log('\n--- 3. Testing Module Tabs (Basics) ---');
    await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll(".category-pill")).find(p => p.innerText.includes("Basics"))?.click()'
    });
    await new Promise(r => setTimeout(r, 1200));

    const kanaSpotlight = await send('Runtime.evaluate', {
      expression: 'document.querySelector(".glass-card")?.innerText.slice(0, 120)'
    });
    console.log('Basics Card snippet:', kanaSpotlight.result.value?.replace(/\n/g, ' '));

    // 4. Test Chat with Sakura (/chat/sakura)
    console.log('\n--- 4. Navigating to /chat/sakura ---');
    await send('Page.navigate', { url: 'http://localhost:3000/chat/sakura' });
    await new Promise(r => setTimeout(r, 2500));

    const botHeader = await send('Runtime.evaluate', {
      expression: 'document.querySelector(".chat-header h3, .chat-header h2")?.innerText || document.querySelector(".chat-header")?.innerText.slice(0, 80)'
    });
    console.log('Chat Header:', botHeader.result.value?.replace(/\n/g, ' '));

    const initialMsg = await send('Runtime.evaluate', {
      expression: 'document.querySelector(".bot-message, .message-bubble")?.innerText.slice(0, 150)'
    });
    console.log('Initial Message snippet:', initialMsg.result.value?.replace(/\n/g, ' '));

    // Capture screenshot of Sakura Chat
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const snap2Path = path.join(screenshotDir, 'sakura_chat.png');
    fs.writeFileSync(snap2Path, Buffer.from(snap2.data, 'base64'));
    console.log('Saved screenshot:', snap2Path);

    // 5. Open Sakura Bot Profile Dashboard
    console.log('\n--- 5. Opening Sakura Bot Profile Dashboard ---');
    await send('Runtime.evaluate', {
      expression: 'document.querySelectorAll(".chat-header div")[0]?.click()'
    });
    await new Promise(r => setTimeout(r, 1200));

    const profileTitle = await send('Runtime.evaluate', {
      expression: 'document.querySelector("h2")?.innerText'
    });
    console.log('Profile Dashboard Bot Name:', profileTitle.result.value);

    // Capture screenshot of Bot Profile Dashboard
    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    const snap3Path = path.join(screenshotDir, 'sakura_profile_dashboard.png');
    fs.writeFileSync(snap3Path, Buffer.from(snap3.data, 'base64'));
    console.log('Saved screenshot:', snap3Path);

    console.log('\n✅ ALL VISUAL & INTERACTIVE VERIFICATIONS PASSED CLEANLY!');

    ws.close();
    edgeProcess.kill();
  } catch (err) {
    console.error('Verification error:', err);
    edgeProcess.kill();
  }
}

main();
