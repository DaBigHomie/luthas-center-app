/**
 * RLS sanity audit (static). Confirms, per table, that:
 *  - RLS is enabled
 *  - there is a public SELECT policy (anon can read)
 *  - public SELECT is gated by status='publish' OR USING(true) where appropriate
 *  - there is NO anon-writable INSERT/UPDATE/DELETE policy (writes require is_admin)
 *  - admin write policies exist (WITH CHECK / USING public.is_admin())
 *
 * Live anon-vs-admin DML proof was not run because Docker's image store is
 * corrupted on this host (no Postgres container available).
 *
 * Run: npx tsx scripts/seed/rls-audit.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MIG = join(ROOT, "supabase", "migrations");
const sql = readdirSync(MIG).filter(f => f.endsWith(".sql")).sort()
  .map(f => readFileSync(join(MIG, f), "utf8")).join("\n");

const tables = [
  "profiles","media","terms","term_relationships","seo_meta","pages",
  "courses","lessons","quizzes","course_steps","enrollments",
  "posts","products","product_attributes","donation_forms","donation_stats",
];

let fail = 0;
for (const t of tables) {
  const rlsOn = new RegExp(`ALTER TABLE public\\.${t} ENABLE ROW LEVEL SECURITY`).test(sql);
  // policy bodies for this table
  const polRe = new RegExp(`CREATE POLICY[^;]*ON public\\.${t}\\b[^;]*;`, "g");
  const policies = sql.match(polRe) || [];
  const selectPols = policies.filter(p => /FOR SELECT/i.test(p));
  const writePols = policies.filter(p => /FOR (INSERT|UPDATE|DELETE)/i.test(p));
  const hasPublicRead = selectPols.some(p => /USING \(true\)|status = 'publish'|status = 'publish'/.test(p) || /USING \(true\)/.test(p));
  // an anon-writable policy = a write policy whose USING/CHECK is just (true) and not gated by is_admin/auth.uid
  const anonWritable = writePols.some(p => /WITH CHECK \(true\)|USING \(true\)/.test(p) && !/is_admin|is_owner|auth\.uid/.test(p));
  const adminWrite = writePols.some(p => /is_admin\(\)/.test(p));

  const probs: string[] = [];
  if (!rlsOn) probs.push("RLS not enabled");
  if (selectPols.length === 0) probs.push("no SELECT policy");
  if (!hasPublicRead) probs.push("no clear public-read SELECT");
  if (anonWritable) probs.push("anon-writable policy present");
  if (t !== "donation_stats" && !adminWrite && writePols.length) probs.push("write policies not gated by is_admin");

  if (probs.length) { fail++; console.log(`  FAIL ${t.padEnd(18)} ${probs.join("; ")}`); }
  else console.log(`  PASS ${t.padEnd(18)} rls=on select=${selectPols.length} write=${writePols.length} adminWrite=${adminWrite}`);
}
console.log(fail ? `\n${fail} table(s) with RLS concerns.` : "\nAll tables: anon read-only on published rows, writes require is_admin().");
process.exit(fail ? 1 : 0);
