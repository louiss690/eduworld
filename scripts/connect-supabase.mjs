// Applies database migrations to a Supabase project via the SQL endpoint.
// Usage: SUPA_URL=... SUPA_SECRET=... node scripts/connect-supabase.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const url = process.env.SUPA_URL;
const secret = process.env.SUPA_SECRET;
const anon = process.env.SUPA_ANON;

if (!url || !secret) {
  console.error("Missing SUPA_URL / SUPA_SECRET env vars.");
  process.exit(1);
}

const migrationsDir = join(process.cwd(), "database", "migrations");
const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  process.stdout.write(`Running ${file} … `);
  const res = await fetch(`${url}/pg`, {
    method: "POST",
    headers: {
      apikey: secret,
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const body = await res.text();
  if (res.ok) {
    console.log("ok");
  } else {
    console.log(`FAILED (${res.status})`);
    console.log(body.slice(0, 500));
    process.exit(1);
  }
}

// Verify tables exist and public read works via anon key.
const check = await fetch(`${url}/rest/v1/countries?select=code,name&limit=3`, {
  headers: { apikey: anon ?? secret, Authorization: `Bearer ${anon ?? secret}` },
});
console.log(`countries table read status: ${check.status}`);
if (check.ok) console.log("sample:", await check.text());
