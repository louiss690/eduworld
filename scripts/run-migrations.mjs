// Runs database/migrations/*.sql against a PostgreSQL database.
// Usage: PG_HOST=... PG_PASSWORD=... PG_PORT=5432 node scripts/run-migrations.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const host = process.env.PG_HOST;
const password = process.env.PG_PASSWORD;
const port = Number(process.env.PG_PORT ?? 5432);

if (!host || !password) {
  console.error("Missing PG_HOST / PG_PASSWORD");
  process.exit(1);
}

const client = new pg.Client({
  host,
  port,
  user: "postgres",
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

await client.connect();
console.log("connected to", host);

const dir = join(process.cwd(), "database", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
  const sql = readFileSync(join(dir, file), "utf8");
  process.stdout.write(`Running ${file} … `);
  try {
    await client.query(sql);
    console.log("ok");
  } catch (err) {
    console.log("FAILED");
    console.log(String(err.message).slice(0, 600));
    await client.end();
    process.exit(1);
  }
}

const { rows } = await client.query(
  "select count(*) as n from countries;"
);
console.log("countries rows:", rows[0].n);
await client.end();
console.log("done");
