const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  console.log("Navigating to local CRM site...");
  await page.goto('http://localhost:3000/apps/crm', { waitUntil: 'networkidle2' });
  
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\crm_custom_top.png' });
  
  // Scroll down to middle
  await page.evaluate(() => window.scrollBy(0, 1080));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\crm_custom_middle.png' });
  
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\crm_custom_bottom.png' });
  
  console.log("Screenshots of custom CRM page saved.");

  await browser.close();
})();
