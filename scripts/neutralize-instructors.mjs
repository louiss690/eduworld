// One-off dev script: replace fictional instructor personas with neutral
// team attribution across demo content (data + SQL seed).
import { readFileSync, writeFileSync } from "node:fs";

const team = { name: "EduWorld Curriculum Team", title: "In-house content" };

const demoPath = "data/demo.ts";
let demo = readFileSync(demoPath, "utf8");
const demoCount = (demo.match(/instructor: \{/g) || []).length;
demo = demo.replace(
  /instructor: \{ name: "[^"]+", title: "[^"]+" \},/g,
  `instructor: { name: "${team.name}", title: "${team.title}" },`
);
writeFileSync(demoPath, demo);

const seedPath = "database/migrations/002_seed.sql";
let seed = readFileSync(seedPath, "utf8");
const seedCount = (seed.match(/\{"name":"[^"]+","title":"[^"]+"\}/g) || []).length;
seed = seed.replace(
  /\{"name":"[^"]+","title":"[^"]+"\}/g,
  `{"name":"${team.name}","title":"${team.title}"}`
);
writeFileSync(seedPath, seed);

console.log(`demo.ts: ${demoCount} instructors → team attribution`);
console.log(`002_seed.sql: ${seedCount} instructors → team attribution`);
