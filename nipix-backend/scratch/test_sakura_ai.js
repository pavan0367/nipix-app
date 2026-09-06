const http = require('http');

const testCases = [
  { message: 'こんにちは means what?' },
  { message: '富士山はどこですか？' },
  { message: '「は」と「が」の違いは何ですか？' },
  { message: 'How do I say "beautiful" in Japanese?' },
  { message: 'Tell me about the kanji 学' }
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      botId: 'sakura',
      message: test.message,
      history: []
    });

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/ai/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve({ status: res.statusCode, reply: parsed.reply || parsed.message });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Testing Sakura AI Bot on local port 5000...');
  for (const t of testCases) {
    console.log(`\n==============================================`);
    console.log(`PROMPT: "${t.message}"`);
    console.log(`==============================================`);
    try {
      const res = await runTest(t);
      console.log(`STATUS: ${res.status}`);
      console.log(`REPLY:\n${res.reply}`);
    } catch (err) {
      console.error('ERROR:', err.message);
    }
  }
}

main();
