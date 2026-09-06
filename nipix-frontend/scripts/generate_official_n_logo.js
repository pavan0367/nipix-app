const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function makeCrcTable() {
  const cTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    cTable[n] = c;
  }
  return cTable;
}
const crcTable = makeCrcTable();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function writePngChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcBuf = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(crcBuf), 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = writePngChunk('IHDR', ihdr);

  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let srcOffset = 0, dstOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0;
    for (let x = 0; x < width * 4; x++) scanlines[dstOffset++] = rgbaBuffer[srcOffset++];
  }
  const idatChunk = writePngChunk('IDAT', zlib.deflateSync(scanlines, { level: 9 }));
  const iendChunk = writePngChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function resample(src, sw, sh, dw, dh) {
  const dst = Buffer.alloc(dw * dh * 4);
  const xRatio = (sw - 1) / Math.max(1, dw - 1);
  const yRatio = (sh - 1) / Math.max(1, dh - 1);

  for (let dy = 0; dy < dh; dy++) {
    const sy = dy * yRatio;
    const y0 = Math.floor(sy);
    const y1 = Math.min(sh - 1, y0 + 1);
    const yDiff = sy - y0;

    for (let dx = 0; dx < dw; dx++) {
      const sx = dx * xRatio;
      const x0 = Math.floor(sx);
      const x1 = Math.min(sw - 1, x0 + 1);
      const xDiff = sx - x0;

      for (let c = 0; c < 4; c++) {
        const v00 = src[(y0 * sw + x0) * 4 + c];
        const v10 = src[(y0 * sw + x1) * 4 + c];
        const v01 = src[(y1 * sw + x0) * 4 + c];
        const v11 = src[(y1 * sw + x1) * 4 + c];

        const top = v00 * (1 - xDiff) + v10 * xDiff;
        const bot = v01 * (1 - xDiff) + v11 * xDiff;
        dst[(dy * dw + dx) * 4 + c] = Math.round(top * (1 - yDiff) + bot * yDiff);
      }
    }
  }
  return dst;
}

function padToSquare(src, w, h) {
  const maxDim = Math.max(w, h);
  const sq = Buffer.alloc(maxDim * maxDim * 4);
  const offsetX = Math.floor((maxDim - w) / 2);
  const offsetY = Math.floor((maxDim - h) / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * w + x) * 4;
      const dstIdx = ((offsetY + y) * maxDim + (offsetX + x)) * 4;
      sq[dstIdx] = src[srcIdx];
      sq[dstIdx + 1] = src[srcIdx + 1];
      sq[dstIdx + 2] = src[srcIdx + 2];
      sq[dstIdx + 3] = src[srcIdx + 3];
    }
  }
  return { data: sq, dim: maxDim };
}

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let currentOffset = 6 + count * 16;

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry[0] = item.width >= 256 ? 0 : item.width;
    entry[1] = item.height >= 256 ? 0 : item.height;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buf.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    entries.push(entry);
    currentOffset += item.buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buf)]);
}

// 1. Read source image
const sourcePath = 'C:/Users/Pavaa/.gemini/antigravity-ide/brain/0472c5c6-cc62-4386-9247-293af8a4c102/.user_uploaded/media_1788686008486.png';
const buf = fs.readFileSync(sourcePath);

let offset = 8;
const idatChunks = [];
while (offset < buf.length) {
  const length = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IDAT') idatChunks.push(buf.slice(offset + 8, offset + 8 + length));
  offset += 12 + length;
}
const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
const origW = buf.readUInt32BE(16);
const origH = buf.readUInt32BE(20);

const raw = Buffer.alloc(origW * origH * 4);
const stride = origW * 4;
let srcPos = 0, dstPos = 0;
for (let y = 0; y < origH; y++) {
  const filter = decompressed[srcPos++];
  for (let x = 0; x < origW * 4; x++) {
    const b = decompressed[srcPos++];
    const a = x >= 4 ? raw[dstPos - 4] : 0;
    const c = y > 0 ? raw[dstPos - stride] : 0;
    const d = (x >= 4 && y > 0) ? raw[dstPos - stride - 4] : 0;
    let val = b;
    if (filter === 1) val = (b + a) & 0xff;
    else if (filter === 2) val = (b + c) & 0xff;
    else if (filter === 3) val = (b + Math.floor((a + c) / 2)) & 0xff;
    else if (filter === 4) {
      const p = a + c - d;
      const pa = Math.abs(p - a), pb = Math.abs(p - c), pc = Math.abs(p - d);
      const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? c : d);
      val = (b + pr) & 0xff;
    }
    raw[dstPos++] = val;
  }
}

// Exact bounds around the N
const cropX = 315;
const cropY = 14;
const cropW = 376;
const cropH = 310;

const cropped = Buffer.alloc(cropW * cropH * 4);
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((cropY + y) * origW + (cropX + x)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    cropped[dstIdx] = raw[srcIdx];
    cropped[dstIdx + 1] = raw[srcIdx + 1];
    cropped[dstIdx + 2] = raw[srcIdx + 2];
    cropped[dstIdx + 3] = raw[srcIdx + 3];
  }
}

// 2. Encode cropped N PNG
const logoPng = encodePng(cropW, cropH, cropped);

// Write to frontend paths
const frontendDir = path.resolve(__dirname, '..');
const srcLogoPath = path.join(frontendDir, 'src', 'assets', 'images', 'nipix-logo.png');
const publicLogoPath = path.join(frontendDir, 'public', 'assets', 'nipix-logo.png');
const publicOriginalPath = path.join(frontendDir, 'public', 'assets', 'nipix-logo-original.png');

fs.writeFileSync(srcLogoPath, logoPng);
fs.writeFileSync(publicLogoPath, logoPng);
fs.writeFileSync(publicOriginalPath, buf);
console.log('Saved nipix-logo.png to src and public assets (' + logoPng.length + ' bytes, ' + cropW + 'x' + cropH + ')');

// 3. Generate Square Favicon assets (32x32, 48x48)
const { data: squareData, dim: squareDim } = padToSquare(cropped, cropW, cropH);

const fav32 = resample(squareData, squareDim, squareDim, 32, 32);
const fav48 = resample(squareData, squareDim, squareDim, 48, 48);
const fav64 = resample(squareData, squareDim, squareDim, 64, 64);

const png32 = encodePng(32, 32, fav32);
const png48 = encodePng(48, 48, fav48);
const png64 = encodePng(64, 64, fav64);

const icoBuffer = createIco([
  { width: 32, height: 32, buf: png32 },
  { width: 48, height: 48, buf: png48 }
]);

const faviconIcoPath = path.join(frontendDir, 'public', 'favicon.ico');
fs.writeFileSync(faviconIcoPath, icoBuffer);
console.log('Saved transparent favicon.ico (' + icoBuffer.length + ' bytes)');

// 4. Generate transparent favicon.svg with embedded N logo
const base64Png = png64.toString('base64');
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,${base64Png}" width="64" height="64" preserveAspectRatio="xMidYMid meet" />
</svg>
`;
const faviconSvgPath = path.join(frontendDir, 'public', 'favicon.svg');
fs.writeFileSync(faviconSvgPath, svgContent);
console.log('Saved transparent favicon.svg (' + svgContent.length + ' bytes)');
