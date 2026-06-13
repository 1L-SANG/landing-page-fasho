// QA screenshots via system Chrome (puppeteer-core). Scrolls to trigger
// reveal animations, then captures full page + viewport sections.
//   node scripts/shot.mjs [url] [outPrefix] [width]
import puppeteer from 'puppeteer-core';

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.argv[2] || 'http://localhost:3000/';
const prefix = process.argv[3] || '/tmp/wl';
const width = Number(process.argv[4] || 1440);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// Scroll through to fire IntersectionObservers, then back to top.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 180));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});

await page.screenshot({ path: `${prefix}-full.png`, fullPage: true });

// Section viewport captures by scrolling to each id.
const ids = ['home', 'how', 'features'];
for (const id of ids) {
  const ok = await page.evaluate((i) => {
    const el = document.getElementById(i);
    if (!el) return false;
    el.scrollIntoView({ block: 'start' });
    return true;
  }, id);
  if (ok) {
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${prefix}-${id}.png` });
  }
}

await browser.close();
console.log('shots written:', `${prefix}-full.png`, ...ids.map((i) => `${prefix}-${i}.png`));
