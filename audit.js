const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  const brokenLinks = [];
  
  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('localhost:3000')) {
      brokenLinks.push({ url: response.url(), status: response.status() });
    }
  });

  const dynamicApps = [
    "crm", "bigin", "bookings", "contactmanager",
    "campaigns", "social", "marketingplus", "sites", "pagesense", "backstage", "commerce",
    "desk", "assist", "salesiq", "lens",
    "books", "invoice", "expense", "inventory", "subscriptions", "checkout", "payroll",
    "people", "recruit", "workerly", "shifts",
    "creator", "analytics", "flow", "directory",
    "mail", "workdrive", "writer", "sheet", "show", "cliq", "meeting", "projects", "sprints", "connect", "sign",
    "learn", "cpaas", "voice", "touchpoint", "fortify", "agents"
  ].map(app => `/apps/${app}`);

  const pagesToTest = [
    '/',
    '/erp',
    '/school-erp',
    '/hospital-erp',
    '/pharmacy-pos',
    '/services',
    '/pricing',
    '/contact',
    ...dynamicApps
  ];

  console.log("Starting full site audit...");

  for (const p of pagesToTest) {
    const url = `http://localhost:3000${p}`;
    console.log(`Checking ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
      // Take a screenshot of the top (Navbar)
      await page.screenshot({ path: `C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\audit_${p === '/' ? 'home' : p.replace('/', '')}_top.png` });
      
      // Scroll to bottom (Footer)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 500));
      
      await page.screenshot({ path: `C:\\Users\\intel\\.gemini\\antigravity-ide\\brain\\e8a2ae1e-1e2e-4367-92ad-d0fe99194057\\audit_${p === '/' ? 'home' : p.replace('/', '')}_bottom.png` });
    } catch (e) {
      console.log(`Error on ${url}: ${e.message}`);
    }
  }

  await browser.close();

  console.log("Audit complete.");
  console.log("Broken Local Resources/Links Found:", brokenLinks.length === 0 ? "None!" : brokenLinks);
})();
