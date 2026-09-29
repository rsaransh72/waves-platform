const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Desktop viewport
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:3000/erp', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\erp_hero_match.png' });
  
  await browser.close();
  console.log("Screenshot taken!");
})();
