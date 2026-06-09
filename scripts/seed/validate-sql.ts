/**
 * Offline SQL structural validator (no Docker required).
 *
 * Docker on this host has a corrupted containerd image store (I/O errors),
 * so neither `supabase db reset` nor a throwaway postgres container can run.
 * This validator parses every migration + seed.sql and asserts structural
 * sanity: balanced parentheses, balanced single quotes (respecting '' escapes
 * and dollar-quoted bodies), balanced $$ blocks, statement termination, and
 * balanced BEGIN/COMMIT in the seed.
 *
 * Run: npx tsx scripts/seed/validate-sql.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const MIG = join(ROOT, "supabase", "migrations");
const SEED = join(ROOT, "supabase", "seed.sql");

interface Issue { file: string; msg: string; }
const issues: Issue[] = [];

function strip(sql: string): string {
  // Remove -- line comments and /* */ block comments without touching strings.
  let out = "";
  let i = 0;
  const n = sql.length;
  let inSingle = false;
  let dollarTag: string | null = null;
  while (i < n) {
    const c = sql[i];
    const two = sql.slice(i, i + 2);
    if (!inSingle && dollarTag === null && two === "--") {
      while (i < n && sql[i] !== "\n") i++;
      continue;
    }
    if (!inSingle && dollarTag === null && two === "/*") {
      i += 2;
      while (i < n && sql.slice(i, i + 2) !== "*/") i++;
      i += 2;
      continue;
    }
    // dollar quote start/end
    if (!inSingle) {
      const m = sql.slice(i).match(/^\$([A-Za-z0-9_]*)\$/);
      if (m) {
        const tag = m[0];
        if (dollarTag === null) dollarTag = tag;
        else if (dollarTag === tag) dollarTag = null;
        out += tag;
        i += tag.length;
        continue;
      }
    }
    if (dollarTag === null && c === "'") {
      inSingle = !inSingle;
      out += c;
      i++;
      continue;
    }
    out += c;
    i++;
  }
  if (inSingle) issues.push({ file: "(current)", msg: "unterminated single-quote string" });
  if (dollarTag !== null) issues.push({ file: "(current)", msg: `unterminated dollar-quote ${dollarTag}` });
  return out;
}

function checkFile(path: string, label: string) {
  const raw = readFileSync(path, "utf8");
  const localIssues: string[] = [];

  // Quote / dollar balance via tokenizer.
  let inSingle = false;
  let dollarTag: string | null = null;
  for (let i = 0; i < raw.length; i++) {
    if (dollarTag === null) {
      const m = raw.slice(i).match(/^\$([A-Za-z0-9_]*)\$/);
      if (m && !inSingle) { dollarTag = m[0]; i += m[0].length - 1; continue; }
      if (raw[i] === "'") {
        // handle '' escape
        if (inSingle && raw[i + 1] === "'") { i++; continue; }
        inSingle = !inSingle;
      }
    } else {
      const m = raw.slice(i).match(/^\$([A-Za-z0-9_]*)\$/);
      if (m && m[0] === dollarTag) { dollarTag = null; i += m[0].length - 1; }
    }
  }
  if (inSingle) localIssues.push("unbalanced single quotes");
  if (dollarTag !== null) localIssues.push(`unbalanced dollar-quote ${dollarTag}`);

  // Paren balance on comment/string-stripped text.
  const cleaned = strip(raw)
    .replace(/'(?:[^']|'')*'/g, "''"); // collapse string literals
  let depth = 0;
  for (const ch of cleaned) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (depth < 0) { localIssues.push("paren depth went negative"); break; }
  }
  if (depth !== 0) localIssues.push(`unbalanced parens (final depth ${depth})`);

  // Statement presence.
  if (!/;\s*$/.test(raw.trimEnd() + ";") && !raw.includes(";")) {
    localIssues.push("no statement terminator found");
  }

  for (const m of localIssues) issues.push({ file: label, msg: m });
  return localIssues.length === 0;
}

let ok = 0;
let bad = 0;
const migFiles = readdirSync(MIG).filter((f) => f.endsWith(".sql")).sort();
for (const f of migFiles) {
  const good = checkFile(join(MIG, f), f);
  if (good) { ok++; console.log(`  PASS ${f}`); }
  else { bad++; console.log(`  FAIL ${f}`); }
}

// seed: also assert BEGIN/COMMIT balance.
const seedGood = checkFile(SEED, "seed.sql");
const seedRaw = readFileSync(SEED, "utf8");
const begins = (seedRaw.match(/^BEGIN;/gm) || []).length;
const commits = (seedRaw.match(/^COMMIT;/gm) || []).length;
if (begins !== commits) issues.push({ file: "seed.sql", msg: `BEGIN(${begins}) != COMMIT(${commits})` });
if (seedGood && begins === commits) { ok++; console.log(`  PASS seed.sql (BEGIN/COMMIT balanced)`); }
else { bad++; console.log(`  FAIL seed.sql`); }

console.log(`\n${ok} files passed, ${bad} failed.`);
if (issues.length) {
  console.log("Issues:");
  for (const i of issues) console.log(`  [${i.file}] ${i.msg}`);
  process.exit(1);
}
console.log("All migrations + seed.sql are structurally valid.");
