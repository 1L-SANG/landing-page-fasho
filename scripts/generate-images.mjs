// Generates the landing-page imagery with Gemini and writes PNGs into
// /public/generated, overwriting the committed placeholders. Run manually:
//   pnpm generate:images        (or: node scripts/generate-images.mjs)
// Requires GEMINI_API_KEY in .env.local. No runtime calls — build-time only.
import { GoogleGenAI } from '@google/genai';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'generated');

// --- load .env.local (KEY=VALUE per line) into process.env ---
const envPath = join(ROOT, '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error(
    '\n✖ GEMINI_API_KEY is not set. Add it to .env.local:\n' +
      '    GEMINI_API_KEY=your_key_here\n' +
      'Placeholders in public/generated remain unchanged.\n',
  );
  process.exit(1);
}

const MODEL = process.env.MODEL_ROUTING_IMAGE_HIGH ?? 'gemini-3-pro-image';

// Shared art direction so every asset reads as one brand system.
const STYLE =
  'Pure white background, bright airy studio lighting, premium minimal fashion ' +
  'e-commerce aesthetic, a soft pastel aurora glow (pale sky-blue #c3dcf6, sage ' +
  '#d8e8c6, warm yellow #f8d978, mauve #ead0e3) diffusing faintly in the far ' +
  'background only. No human face, no readable text, no logo, no watermark.';

const ASSETS = [
  {
    file: 'hero-studio.png',
    aspectRatio: '16:9',
    imageSize: '2K',
    prompt:
      'Editorial flat lay of a neatly folded minimalist beige knit garment with a ' +
      'few clean angle shots on the left, flowing into a tidy vertical fashion ' +
      'detail-page composition of stacked product image blocks on the right. ' +
      STYLE,
  },
  {
    file: 'step-1-analyze.png',
    aspectRatio: '4:3',
    imageSize: '1K',
    prompt:
      'A single neatly folded cotton t-shirt photographed top-down, with a few ' +
      'small minimalist floating swatch dots beside it (no text). Sky-blue pastel ' +
      'accent. ' +
      STYLE,
  },
  {
    file: 'step-2-mannequin.png',
    aspectRatio: '4:3',
    imageSize: '1K',
    prompt:
      'A faceless matte light-gray dress-form mannequin torso wearing a simple ' +
      'beige t-shirt, centered on white. Sage-green pastel accent. ' +
      STYLE,
  },
  {
    file: 'step-3-storyboard.png',
    aspectRatio: '4:3',
    imageSize: '1K',
    prompt:
      'A neat grid of small fashion product photo cards arranged like a storyboard ' +
      'on a clean white surface, soft drop shadows. Mauve pastel accent. ' +
      STYLE,
  },
  {
    file: 'step-4-editor.png',
    aspectRatio: '4:3',
    imageSize: '1K',
    prompt:
      'A long vertical fashion e-commerce detail page shown as cleanly stacked ' +
      'image blocks and blank caption bars (no text) on white, like a design ' +
      'canvas. Warm-yellow pastel accent. ' +
      STYLE,
  },
  {
    file: 'cut-styling.png',
    aspectRatio: '3:4',
    imageSize: '1K',
    prompt:
      'Full-body fashion lookbook styling cut of a casual minimalist outfit on a ' +
      'faceless mannequin, neutral studio sweep. Sky-blue pastel accent. ' +
      STYLE,
  },
  {
    file: 'cut-horizon.png',
    aspectRatio: '3:4',
    imageSize: '1K',
    prompt:
      'Front, back and side study of a beige garment on a clean seamless white ' +
      'studio sweep, evenly lit. Sage-green pastel accent. ' +
      STYLE,
  },
  {
    file: 'cut-product.png',
    aspectRatio: '3:4',
    imageSize: '1K',
    prompt:
      'Macro detail product shot of garment fabric texture, stitching and a button ' +
      'on white. Mauve pastel accent. ' +
      STYLE,
  },
];

// Pick the right backend. A key starting with "AQ." or the presence of
// VERTEX_* means Vertex AI (aiplatform.googleapis.com); "AIza" keys use the
// Gemini Developer API (generativelanguage.googleapis.com).
// Vertex AI express mode uses the API key ALONE (project/location are
// mutually exclusive with apiKey in this SDK). A key starting with "AQ." is a
// Vertex express key; "AIza" keys use the Gemini Developer API.
const useVertex = API_KEY.startsWith('AQ.');
const ai = useVertex
  ? new GoogleGenAI({ vertexai: true, apiKey: API_KEY })
  : new GoogleGenAI({ apiKey: API_KEY });
console.log(`backend: ${useVertex ? 'Vertex AI (express)' : 'Gemini Developer API'}\n`);
mkdirSync(OUT, { recursive: true });

const writeFirstImage = (response, file) => {
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      writeFileSync(join(OUT, file), Buffer.from(part.inlineData.data, 'base64'));
      return true;
    }
  }
  return false;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FORCE = process.argv.includes('--force');
// A real generated PNG is ~1MB+; committed placeholders are ~12KB.
const REAL_BYTES = 100_000;
const isReal = (file) => {
  const p = join(OUT, file);
  return existsSync(p) && statSync(p).size > REAL_BYTES;
};

const generate = async (asset) => {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: asset.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          responseFormat: {
            image: { aspectRatio: asset.aspectRatio, imageSize: asset.imageSize },
          },
        },
      });
      return writeFirstImage(response, asset.file) ? 'done' : 'no-image';
    } catch (err) {
      const msg = String(err?.message ?? err);
      const is429 = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
      if (is429 && attempt < 4) {
        const wait = 15000 * attempt;
        process.stdout.write(`429, retry in ${wait / 1000}s ... `);
        await sleep(wait);
        continue;
      }
      return `failed: ${msg.slice(0, 80)}`;
    }
  }
  return 'failed: retries exhausted';
};

let ok = 0;
let done = 0;
for (const asset of ASSETS) {
  process.stdout.write(`→ ${asset.file} (${asset.aspectRatio}) ... `);
  if (!FORCE && isReal(asset.file)) {
    console.log('skip (already generated)');
    ok++;
    continue;
  }
  const result = await generate(asset);
  console.log(result === 'done' ? 'done' : `${result} (kept placeholder)`);
  if (result === 'done') {
    ok++;
    done++;
    await sleep(5000); // space out premium-model requests
  }
}

console.log(`\n${ok}/${ASSETS.length} ready (${done} newly generated) → ${OUT}`);
process.exit(ok === ASSETS.length ? 0 : 1);
