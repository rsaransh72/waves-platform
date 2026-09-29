const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Desktop dropdown
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const productsLink = await page.$('nav > div.relative');
  if (productsLink) {
    await productsLink.hover();
    await new Promise(r => setTimeout(r, 500));
  }
  await page.screenshot({ path: 'nav_dropdown.png', clip: { x: 0, y: 0, width: 1440, height: 650 } });
  console.log('Dropdown done');

  // 1030 breakpoint
  await page.setViewport({ width: 1030, height: 768 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'nav_breakpoint.png', clip: { x: 0, y: 0, width: 1030, height: 80 } });
  console.log('Breakpoint done');

  // Mobile menu open
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const hamburger = await page.$('button[aria-label="Toggle navigation menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('Clicked hamburger');
  } else {
    console.log('No hamburger found');
  }
  await page.screenshot({ path: 'nav_mobile_opened.png', clip: { x: 0, y: 0, width: 375, height: 812 } });
  console.log('Mobile done');

  await browser.close();
})();
