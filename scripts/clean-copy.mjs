// One-off copy cleanup: em dashes → commas/hyphens (no em dashes in copy).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const roots = ["app", "components", "data", "services", "lib"];
const exts = new Set([".ts", ".tsx", ".md"]);
let files = 0;
let replaced = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".local-data"].includes(entry.name)) continue;
      walk(p);
    } else if (exts.has(entry.name.slice(-3))) {
      const before = readFileSync(p, "utf8");
      // Spaced em dash → comma+space; other em dashes → hyphen.
      const after = before
        .replace(/ — /g, ", ")
        .replace(/—/g, "-");
      if (after !== before) {
        writeFileSync(p, after);
        files += 1;
        replaced += (before.match(/—/g) || []).length;
        console.log("fix:", relative(process.cwd(), p));
      }
    }
  }
}

for (const root of roots) walk(root);
console.log(`\nFiles touched: ${files}, em dashes replaced: ${replaced}`);
