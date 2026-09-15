// Screenshots the hero demo at each stage, desktop and phone, and reports state and errors.
// Usage: node scripts/shoot-hero.cjs [outDir]   (dev server must be running; see docs/hero-kernel-demo.md)
// Needs Playwright: set PLAYWRIGHT to its package path if `require('playwright')` cannot find it.

const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const URL = process.env.URL || 'http://localhost:4321/';
const OUT = path.resolve(process.argv[2] || 'hero-shots');
require('node:fs').mkdirSync(OUT, { recursive: true });

const state = (page) =>
  page.evaluate(() => ({
    phase: document.getElementById('stage').dataset.phase,
    view: document.getElementById('ide').dataset.view,
    query: document.querySelector('.ide-pal input').value,
    top: [...document.querySelectorAll('.pal-row')].slice(0, 3).map((r) => r.textContent),
  }));
const until = (page, fn) => page.waitForFunction(fn, null, { timeout: 30000, polling: 20 });
const shot = (page, name) => page.locator('#stage').screenshot({ path: `${OUT}/${name}.png` });

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  for (const [label, viewport] of [['desktop', { width: 1440, height: 1000 }], ['phone', { width: 400, height: 860 }]]) {
    for (const colorScheme of ['dark', 'light']) {
      const tag = `${label}-${colorScheme}`;
      const page = await browser.newPage({ viewport, colorScheme });
      page.on('console', (m) => m.type() === 'error' && errors.push(`${tag}: ${m.text()}`));
      page.on('pageerror', (e) => errors.push(`${tag}: ${e}`));
      await page.goto(URL, { waitUntil: 'networkidle' });
      await page.locator('#stage').scrollIntoViewIfNeeded();

      await until(page, () => document.querySelector('.boot-out').textContent.includes('language servers'));
      await shot(page, `${tag}-1-terminal`);
      console.log(`${tag} terminal:\n${await page.evaluate(() => document.querySelector('.boot-out').innerText)}`);

      await until(page, () => document.getElementById('stage').dataset.phase === 'ide');
      await page.waitForTimeout(400);
      await shot(page, `${tag}-2-ide-empty`);

      await until(page, () => document.querySelector('.ide-pal input').value === 'libsort');
      await page.waitForTimeout(500);
      await shot(page, `${tag}-3-palette`);
      console.log(`${tag} palette`, JSON.stringify(await state(page)));

      await until(page, () => document.getElementById('ide').dataset.view === 'open');
      await page.waitForTimeout(600);
      await shot(page, `${tag}-4-open`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) console.log(`${tag} page overflows horizontally by ${overflow}px (may come from another section)`);
      await page.close();
    }
  }

  // Replay returns to the terminal; clicking during boot skips to the open file.
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.locator('#stage').scrollIntoViewIfNeeded();
  await until(page, () => document.getElementById('ide').dataset.view === 'open');
  await page.click('[data-replay]');
  console.log('after replay', JSON.stringify(await state(page)));
  const box = await page.locator('.stage-frame').boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + 200);
  await page.waitForTimeout(500);
  console.log('after click during boot', JSON.stringify(await state(page)));

  // Reduced motion lands on the finished scene with no animation.
  const rm = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await rm.goto(URL, { waitUntil: 'networkidle' });
  console.log('reduced motion', JSON.stringify(await state(rm)));

  console.log(`screenshots in ${OUT}`);
  console.log('errors', JSON.stringify(errors));
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
