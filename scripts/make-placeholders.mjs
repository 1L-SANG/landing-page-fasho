// Generates on-brand soft-gradient PNG placeholders for /public/generated.
// Pure Node (no deps) so the landing builds + renders before real Gemini
// images exist. `scripts/generate-images.mjs` overwrites these in place.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'generated');
mkdirSync(OUT, { recursive: true });

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(body), 0);
  return Buffer.concat([len, body, crc]);
};

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

// Diagonal gradient from `from` -> `to`, kept light + tasteful.
const png = (w, h, from, to) => {
  const [r1, g1, b1] = hex(from);
  const [r2, g2, b2] = hex(to);
  const raw = Buffer.alloc(h * (1 + w * 3));
  let p = 0;
  for (let y = 0; y < h; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const t = (x / w + y / h) / 2;
      raw[p++] = Math.round(r1 + (r2 - r1) * t);
      raw[p++] = Math.round(g1 + (g2 - g1) * t);
      raw[p++] = Math.round(b1 + (b2 - b1) * t);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

const SKY = '#c3dcf6';
const SAGE = '#d8e8c6';
const SUN = '#f8d978';
const MAUVE = '#ead0e3';
const WHITE = '#ffffff';
// Soft tint = blend accent toward white so placeholders read as a wash.
const tint = (accent, amt = 0.5) => {
  const [r, g, b] = hex(accent);
  const m = (c) => Math.round(c + (255 - c) * (1 - amt));
  return `#${[m(r), m(g), m(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

const assets = [
  ['hero-studio.png', 1600, 1000, WHITE, tint(SKY, 0.6)],
  ['step-1-analyze.png', 800, 600, WHITE, tint(SKY)],
  ['step-2-mannequin.png', 800, 600, WHITE, tint(SAGE)],
  ['step-3-storyboard.png', 800, 600, WHITE, tint(MAUVE)],
  ['step-4-editor.png', 800, 600, WHITE, tint(SUN)],
  ['cut-styling.png', 600, 800, tint(SKY), WHITE],
  ['cut-horizon.png', 600, 800, tint(SAGE), WHITE],
  ['cut-product.png', 600, 800, tint(MAUVE), WHITE],
];

for (const [name, w, h, from, to] of assets) {
  writeFileSync(join(OUT, name), png(w, h, from, to));
  console.log('placeholder', name, `${w}x${h}`);
}
console.log('done →', OUT);
