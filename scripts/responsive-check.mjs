// Responsive audit: opens key pages at several viewport widths and reports
// horizontal overflow and elements that break out of the viewport.
// Usage: node scripts/responsive-check.mjs [baseUrl]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3100";
const VIEWPORTS = [
  { name: "phone-xs", width: 320, height: 720 },
  { name: "phone", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
];
const PAGES = [
  "/",
  "/library",
  "/subjects",
  "/subjects/mathematics",
  "/courses/algebra-foundations",
  "/login",
  "/signup",
  "/forgot-password",
  "/about",
  "/help",
  "/contact",
  "/privacy",
  "/terms",
  "/offline",
];

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// Authenticated session for student pages
const page = await context.newPage();
await page.request.post(`${base}/api/auth/register`, {
  data: { name: "Resp Bot", email: `resp${Date.now()}@test.dev`, password: "password123" },
});
const cookies = await context.cookies();
const authedPages = ["/dashboard", "/tutor", "/results", "/settings", "/teacher", "/admin"];

for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const path of [...PAGES, ...authedPages]) {
    try {
      await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(600);
      const finalUrl = page.url().replace(base, "");
      const report = await page.evaluate(() => {
        const doc = document.documentElement;
        const vw = doc.clientWidth;
        const overflowers = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          const style = getComputedStyle(el);
          // Skip elements inside a scrollable or clipping container (tables,
          // overflow-hidden decorative bands, etc.)
          let parent = el.parentElement;
          let protectedEl = false;
          while (parent) {
            const ps = getComputedStyle(parent);
            if (/(auto|scroll|hidden|clip)/.test(ps.overflowX)) { protectedEl = true; break; }
            parent = parent.parentElement;
          }
          if (protectedEl) continue;
          if (r.right > vw + 1) {
            overflowers.push({
              tag: el.tagName.toLowerCase(),
              cls: String(el.className).slice(0, 70),
              right: Math.round(r.right),
              text: (el.textContent || "").trim().slice(0, 40),
            });
            if (overflowers.length >= 5) break;
          }
        }
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasOverflow: doc.scrollWidth > doc.clientWidth + 1,
          overflowers,
        };
      });
      if (report.hasOverflow || report.overflowers.length > 0) {
        results.push({ vp: vp.name, path, finalUrl, ...report });
      }
    } catch (e) {
      results.push({ vp: vp.name, path, error: String(e).slice(0, 120) });
    }
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 1));
if (results.length === 0) console.log("✓ No overflow or errors across all viewports/pages.");
