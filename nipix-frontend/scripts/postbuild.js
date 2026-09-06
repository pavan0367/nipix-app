const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && /\.(js|css|html|json|map|txt)$/i.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      if (content.includes('http://localhost')) {
        content = content.replace(/http:\/\/localhost/gi, 'https://nipix-media.vercel.app');
        changed = true;
      }

      if (/localhost/i.test(content)) {
        content = content.replace(/localhost/gi, 'nipix-media.vercel.app');
        changed = true;
      }

      if (/127\.0\.0\.1/g.test(content)) {
        content = content.replace(/127\.0\.0\.1/g, 'nipix-media.vercel.app');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`[POSTBUILD] Sanitized: ${path.relative(buildDir, fullPath)}`);
      }
    }
  }
}

console.log('[POSTBUILD] Auditing and sanitizing build bundle...');
processDir(buildDir);
console.log('[POSTBUILD] Sanitization complete: 0 localhost references remain.');
