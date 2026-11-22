// Runs database/migrations/*.sql via the Supabase Management API.
// Usage: SUPA_PAT=sbp_... node scripts/run-migrations-mgmt.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const REF = "olkcjopjamnbhxjcryxt";
const pat = process.env.SUPA_PAT;
if (!pat) {
  console.error("Missing SUPA_PAT");
  process.exit(1);
}

const api = "https://api.supabase.com/v1";

async function query(sql) {
  const res = await fetch(`${api}/projects/${REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text };
}

// 1. sanity: does the token see this project?
const proj = await fetch(`${api}/projects/${REF}`, {
  headers: { Authorization: `Bearer ${pat}` },
});
console.log("project lookup:", proj.status);

// 2. run migrations
const dir = join(process.cwd(), "database", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
for (const file of files) {
  const sql = readFileSync(join(dir, file), "utf8");
  process.stdout.write(`Running ${file} … `);
  const r = await query(sql);
  if (r.ok) {
    console.log("ok");
  } else {
    console.log(`FAILED (${r.status})`);
    console.log(r.body.slice(0, 600));
    process.exit(1);
  }
}

// 3. verify seed rows readable via Management-SQL
const check = await query("select count(*) as n from countries;");
console.log("countries count result:", check.body.slice(0, 120));
