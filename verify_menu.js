const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to local site...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Wait for the Products button and click it to open the Mega Menu
  console.log("Hovering over Products menu...");
  // Using evaluate since hover with text is tricky in raw puppeteer without custom selectors
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const productsBtn = btns.find(b => b.textContent.includes('Products'));
    if (productsBtn) productsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Take a screenshot of the open mega menu
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\megamenu_open.png' });
  console.log("Screenshot of Mega Menu saved.");

  // Hover over "Marketing"
  console.log("Clicking Marketing category...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const marketingBtn = btns.find(b => b.textContent.includes('Marketing'));
    if (marketingBtn) marketingBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\megamenu_marketing.png' });
  console.log("Screenshot of Marketing Category saved.");

  // Click on Waves Campaigns
  console.log("Navigating to Waves Campaigns...");
  await page.goto('http://localhost:3000/apps/campaigns', { waitUntil: 'networkidle2' });
  
  await page.screenshot({ path: 'C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\dynamic_campaigns.png' });
  console.log("Screenshot of Dynamic Campaigns Page saved.");

  await browser.close();
})();
