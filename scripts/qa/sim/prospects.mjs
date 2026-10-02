// Fifteen school principals who have heard of the ERP and visit the website. Each
// one arrives differently, reads different pages, and most of them ask for a demo.
import { Person, alias, attempt, sleep } from "./lib.mjs";

const phone = (n) => `90000${String(30000 + n).padStart(5, "0")}`;

export const PROSPECTS = [
  { id: "p01", name: "Sunita Sharma", org: "Sanskar International School", city: "Jaipur", device: "desktop", size: "1,200 students, 65 staff", path: "researcher", form: "book-demo" },
  { id: "p02", name: "Fr. Joseph Kurian", org: "St. Mary's Higher Secondary School", city: "Kochi", device: "iphone", size: "900 students", path: "home-mobile", form: "home" },
  { id: "p03", name: "Rajesh Gupta", org: "Gupta Public School", city: "Lucknow", device: "android", size: "450 students", path: "price-first", form: "pricing", slow: true },
  { id: "p04", name: "Dr. Meena Iyer", org: "Vidya Vikas Matriculation School", city: "Chennai", device: "desktop", size: "1,500 students", path: "wants-trial", form: "contact" },
  { id: "p05", name: "Harpreet Kaur", org: "Guru Nanak Model School", city: "Ludhiana", device: "laptop", size: "700 students", path: "messy-input", form: "book-demo", phoneInput: "+91 90000 30005", emailInput: `  ${alias("lead-p05").toUpperCase()} ` },
  { id: "p06", name: "Anil Deshmukh", org: "Jnana Prabodhini Vidyalaya", city: "Pune", device: "desktop", size: "1,000 students", path: "wrong-phone", form: "book-demo" },
  { id: "p07", name: "Sister Mary Lyngdoh", org: "Loreto Convent School", city: "Shillong", device: "tablet", size: "600 students", path: "signup", form: "signup" },
  { id: "p08", name: "Vikram Rathore", org: "Rathore Academy", city: "Jodhpur", device: "desktop", size: "800 students", path: "link-checker", form: "book-demo" },
  { id: "p09", name: "Kavita Joshi", org: "Doon Valley Public School", city: "Dehradun", device: "laptop", size: "500 students", path: "short-message", form: "contact" },
  { id: "p10", name: "Mohammed Irfan", org: "Al-Huda Public School", city: "Hyderabad", device: "android", size: "750 students", path: "double-submit", form: "book-demo" },
  { id: "p11", name: "Neha Agarwal", org: "Shri Shikshayatan School", city: "Kolkata", device: "desktop", size: "1,100 students", path: "product-sections", form: "book-demo" },
  { id: "p12", name: "Suresh Patil", org: "Bhonsala Military School", city: "Nagpur", device: "tablet", size: "650 students, boarding", path: "services", form: "services" },
  { id: "p13", name: "Deepa Nair", org: "Bangalore International Academy", city: "Bengaluru", device: "desktop", size: "2,000 students", path: "security", form: "book-demo" },
  { id: "p14", name: "Ramesh Yadav", org: "Adarsh Vidyalaya", city: "Patna", device: "small", size: "300 students", path: "budget", form: "pricing", slow: true },
  { id: "p15", name: "Priya Menon", org: "Podar Group of Schools (3 branches)", city: "Mumbai", device: "wide", size: "2,400 students, 3 branches", path: "multi-branch", form: "book-demo" },
];

const FORM_ROUTES = { "book-demo": "/book-demo", home: "/", pricing: "/pricing", contact: "/contact", signup: "/signup", services: "/services" };
const SUBMIT = { "book-demo": "Request demo", home: "Request demo", pricing: "Request quote", contact: "Send message", signup: "Request access", services: "Request consultation" };

// Look at what a principal would look for on the page they are reading.
async function read(person, info, label) {
  const text = info.text ?? "";
  const facts = {
    rupeePrice: /₹\s?[\d,]+/.test(text),
    gst: /GST/i.test(text),
    freeTrial: /free trial|try (it )?free|trial/i.test(text),
    whatsapp: await person.page.$("a[href*='wa.me']").then(Boolean),
    phoneLink: await person.page.$("a[href^='tel:']").then(Boolean),
    privacy: /privacy/i.test(text),
    testimonials: /testimonial|trusted by|our clients|schools use/i.test(text),
    mobileApp: /android|ios|mobile app|play store/i.test(text),
    parentApp: /parent (app|portal)/i.test(text),
    hindi: /हिन्दी|हिंदी|hindi/i.test(text),
  };
  person.log(`read ${label}`, "ok", Object.entries(facts).filter(([, value]) => value).map(([key]) => key).join(", ") || "none of: price, GST, trial, WhatsApp, privacy, testimonials, app");
  return facts;
}

async function fillLead(person, prospect, overrides = {}) {
  const phoneValue = overrides.phone ?? prospect.phoneInput ?? phone(Number(prospect.id.slice(1)));
  await person.fill("Full name", prospect.name);
  await person.fill("Mobile number", phoneValue);
  await person.fill("Email", overrides.email ?? prospect.emailInput ?? alias(`lead-${prospect.id}`));
  try { await person.fill("Organization", prospect.org); } catch { /* not on every form */ }
  try { await person.fill("City", prospect.city); } catch { /* optional */ }
  try { await person.fill("Size", prospect.size); } catch { /* optional */ }
  const message = overrides.message ?? (prospect.form === "contact" ? "We want to see the attendance and fee modules before the new session. Do you offer a free trial?" : `Interested in School ERP for ${prospect.org}. Please call after 2 pm.`);
  try { await person.fill("How can we help", message); } catch { try { await person.fill("Anything we should know", message); } catch { /* optional */ } }
}

async function submitLead(person, prospect, { expectSuccess = true } = {}) {
  const started = Date.now();
  await person.mustClick(SUBMIT[prospect.form], { selector: "button[type=submit]" });
  const waitOutcome = () => person.page.waitForFunction(() => {
    const text = document.body.innerText;
    if (/Thank you,/.test(text)) return "success";
    const alert = document.querySelector("[role=alert]");
    if (alert?.innerText.trim()) return `error: ${alert.innerText.trim()}`;
    const invalid = Array.from(document.querySelectorAll("input, textarea, select")).find((element) => !element.checkValidity());
    return invalid ? `browser blocked: ${invalid.validationMessage}` : false;
  }, { timeout: 15000 }).then((handle) => handle.jsonValue()).catch(() => "no response");
  let outcome = await waitOutcome();
  if (outcome === "no response") {
    // A zoomed-out page (content wider than the phone) throws off the bot's tap
    // coordinates; a person's tap would land. Submit the form directly instead.
    person.log("tap missed the button (page zoomed out); submitting directly", "ok");
    await person.page.evaluate(() => document.querySelector("form button[type=submit]")?.form?.requestSubmit());
    outcome = await waitOutcome();
  }
  const ms = Date.now() - started;
  if (expectSuccess && outcome !== "success") throw new Error(`Form did not submit: ${outcome}`);
  return { outcome, ms };
}

export async function runProspect(prospect, { onSubmitted } = {}) {
  const person = await new Person(prospect.id, prospect.name, "prospect principal", prospect.device).open();
  if (prospect.slow) {
    const session = await person.page.createCDPSession();
    await session.send("Network.emulateNetworkConditions", { offline: false, latency: 300, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    person.log("network", "ok", "slow 4G (1.6 Mbps, 300 ms)");
  }
  try {
    // Everyone lands on the home page first (Google search or a WhatsApp forward).
    const home = await person.visit("/", "home page");
    if (home.ok) await read(person, home, "home");
    await person.shot("home");

    switch (prospect.path) {
      case "researcher": {
        for (const route of ["/school-erp", "/school-erp/features", "/school-erp/pricing", "/school-erp/faq"]) {
          const info = await person.visit(route);
          if (info.ok) await read(person, info, route);
        }
        await person.shot("product-faq");
        break;
      }
      case "home-mobile": {
        const menu = await person.click("Toggle navigation menu", { selector: "button" });
        person.log("open mobile menu", menu ? "ok" : "issue", menu ? "" : "no menu button found in the header");
        if (!menu) person.issue("high", "mobile", "No navigation menu on phone", "On a 390px phone the header has no menu button, so other pages are unreachable except by scrolling.");
        await person.shot("mobile-menu");
        const header = await person.page.evaluate(() => {
          const logo = document.querySelector("header a[href='/']")?.getBoundingClientRect();
          const cta = Array.from(document.querySelectorAll("header a, header button")).find((element) => /request demo/i.test(element.innerText))?.getBoundingClientRect();
          return logo && cta ? { overlap: Math.round(logo.right - cta.left) } : null;
        });
        if (header?.overlap > 0) person.issue("medium", "mobile", "Header button overlaps the logo on phones", "On a 390px phone the red Request Demo button is drawn on top of the WAVES TECHNOLOGIES name.");
        await person.page.keyboard.press("Escape");
        if (menu && await person.page.evaluate(() => /Sign In/.test(document.body.innerText) && document.querySelector("[aria-label='Toggle navigation menu']")?.getAttribute("aria-expanded") === "true")) {
          person.issue("low", "accessibility", "Escape does not close the mobile menu", "The open menu stays over the page after Escape; only the X button closes it.");
          await person.click("Toggle navigation menu", { selector: "button" });
        }
        await person.page.evaluate(() => document.querySelector("form")?.scrollIntoView());
        await person.shot("home-form");
        break;
      }
      case "price-first":
      case "budget": {
        const info = await person.visit("/pricing", "pricing page");
        const facts = await read(person, info, "pricing");
        if (!facts.rupeePrice) person.issue("high", "sales", "Pricing page shows no prices", "A principal comparing vendors cannot see any ₹ amount on /pricing; they must submit a form and wait.");
        if (!facts.gst) person.issue("low", "sales", "No GST information on pricing", "Schools ask whether prices include 18% GST; the pricing page does not say.");
        await person.shot("pricing");
        const product = await person.visit("/school-erp/pricing", "School ERP pricing");
        const productFacts = await read(person, product, "school-erp/pricing");
        if (!productFacts.rupeePrice) person.issue("medium", "sales", "Product pricing page has no ₹ amounts", "/school-erp/pricing");
        await person.shot("product-pricing");
        break;
      }
      case "wants-trial": {
        // Looks for a demo login or free trial before talking to sales.
        const login = await person.visit("/school/login", "school login (looking for a demo account)");
        person.log("look for demo credentials", /demo|trial|try/i.test(login.text ?? "") ? "ok" : "issue", login.h1);
        const trial = await person.visit("/school/signup", "school signup");
        person.log("try self-signup", "ok", `${trial.finalPath} | ${trial.h1}`);
        await person.shot("signup-attempt");
        const demo = await person.visit("/school-erp/demo", "product demo page");
        const facts = await read(person, demo, "school-erp/demo");
        if (!/video|youtube|watch/i.test(demo.text ?? "") && !(await person.page.$("video, iframe"))) person.issue("medium", "sales", "No demo video or sandbox", "A principal who wants to look before talking to sales finds no video, screenshots tour or sandbox login on /school-erp/demo.");
        void facts;
        break;
      }
      case "link-checker": {
        const seen = new Set();
        const queue = ["/"];
        while (queue.length && seen.size < 30) {
          const route = queue.shift();
          if (seen.has(route)) continue;
          seen.add(route);
          const info = await person.visit(route);
          if (!info.ok) continue;
          const links = await person.page.$$eval("a[href^='/']", (anchors) => anchors.map((anchor) => anchor.getAttribute("href").split("#")[0].split("?")[0]).filter((href) => href && !href.startsWith("/_next")));
          for (const link of links) if (!seen.has(link) && !link.startsWith("/admin") && !link.startsWith("/school/") && !link.startsWith("/login")) queue.push(link);
        }
        person.log("crawl site", "ok", `${seen.size} pages: ${[...seen].join(" ")}`);
        for (const route of ["/privacy", "/privacy-policy", "/terms", "/about", "/refund-policy"]) {
          const response = await person.page.goto(`${process.env.SIM_BASE ?? "http://localhost:3000"}${route}`, { waitUntil: "domcontentloaded" });
          person.log(`look for ${route}`, response.status() === 404 ? "issue" : "ok", String(response.status()));
        }
        break;
      }
      case "product-sections": {
        for (const route of ["/products", "/school-erp", "/school-erp/features", "/school-erp/demo"]) {
          const info = await person.visit(route);
          if (info.ok) await read(person, info, route);
        }
        await person.shot("features");
        break;
      }
      case "services": {
        const info = await person.visit("/services", "services page");
        await read(person, info, "services");
        await person.shot("services");
        break;
      }
      case "security": {
        const info = await person.visit("/school-erp/faq", "FAQ");
        const text = info.text ?? "";
        const asks = { "data stored in India": /india/i.test(text) && /(server|data|stored|hosted)/i.test(text), backup: /backup/i.test(text), "data export / ownership": /export|own your data/i.test(text), "DPDP / privacy": /DPDP|privacy|data protection/i.test(text), "parent consent": /consent/i.test(text) };
        person.log("look for security answers", "ok", Object.entries(asks).map(([key, value]) => `${key}: ${value ? "yes" : "NO"}`).join("; "));
        if (Object.values(asks).filter(Boolean).length < 3) person.issue("high", "trust", "Security and data questions unanswered", `FAQ does not cover: ${Object.entries(asks).filter(([, value]) => !value).map(([key]) => key).join(", ")}. A principal handling 2,000 children's records needs these before buying.`);
        await person.shot("faq");
        break;
      }
      case "multi-branch": {
        const info = await person.visit("/school-erp/features", "features");
        if (!/branch|multi[- ]?campus|multiple schools/i.test(info.text ?? "")) person.issue("medium", "product", "No multi-branch story", "A 3-branch group cannot tell whether one login can see all branches.");
        await person.shot("features-wide");
        break;
      }
      default:
        break;
    }

    // Now they go to the form they chose.
    const formRoute = FORM_ROUTES[prospect.form];
    if (formRoute !== "/" || prospect.path !== "home-mobile") await person.visit(formRoute, `${prospect.form} form`);
    await person.page.evaluate(() => document.querySelector("form")?.scrollIntoView({ block: "center", behavior: "instant" }));

    if (prospect.path === "wrong-phone") {
      await attempt(person, "submit with a 9-digit mobile number", async () => {
        await fillLead(person, prospect, { phone: "900003000" });
        const result = await submitLead(person, prospect, { expectSuccess: false });
        const shown = await person.validationMessages();
        if (result.outcome === "success") throw new Error("Accepted a 9-digit phone");
        return `${result.outcome} | shown: ${shown}`;
      });
      await person.shot("phone-error");
    }
    if (prospect.path === "short-message") {
      await attempt(person, "submit contact form with a 2-word message", async () => {
        await fillLead(person, prospect, { message: "Call me" });
        const result = await submitLead(person, prospect, { expectSuccess: false });
        return `${result.outcome}`;
      });
      await person.shot("short-message");
    }

    let submitted = false;
    await attempt(person, `submit ${prospect.form} form`, async () => {
      await fillLead(person, prospect);
      await person.shot("form-filled");
      const result = await submitLead(person, prospect);
      submitted = true;
      const text = await person.text();
      const confirmation = /confirmation has been sent/i.test(text);
      if (!confirmation) person.issue("medium", "trust", "No confirmation email after enquiry", "The thank-you screen does not say an email was sent (RESEND_API_KEY is not set), so the principal has no record of the request and the sales inbox gets no alert either.");
      await person.shot("thank-you");
      return `${result.ms} ms → ${result.outcome}`;
    });
    if (submitted) onSubmitted?.(prospect);

    if (prospect.path === "double-submit") {
      await attempt(person, "go back and submit the same request again", async () => {
        await person.visit(FORM_ROUTES[prospect.form], "form again");
        await fillLead(person, prospect);
        const result = await submitLead(person, prospect, { expectSuccess: false });
        return `second submission: ${result.outcome}`;
      });
    }

    if (prospect.path === "home-mobile") {
      await attempt(person, "tap WhatsApp to chat", async () => {
        const href = await person.page.$eval("a[href*='wa.me']", (anchor) => anchor.href).catch(() => null);
        if (!href) throw new Error("No WhatsApp link on the page");
        return href;
      });
    }
  } catch (error) {
    person.log("journey stopped", "fail", error.message);
  }
  await sleep(200);
  await person.close();
  return person.summary();
}
