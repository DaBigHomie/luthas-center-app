/**
 * Parity check (offline). Counts INSERT statements per table in supabase/seed.sql
 * and asserts they match the extracted record counts. This is the offline
 * equivalent of the post-`db reset` row-count parity check — Docker on this
 * host has a corrupted image store, so a live DB query was not possible.
 *
 * Run: npx tsx scripts/seed/verify-data.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const seed = readFileSync(join(ROOT, "supabase", "seed.sql"), "utf8");

function count(table: string): number {
  const re = new RegExp(`INSERT INTO public\\.${table} \\(`, "g");
  return (seed.match(re) || []).length;
}

const expected: Record<string, number> = {
  profiles: 8,
  media: 5669,
  terms: 360,
  courses: 47,
  lessons: 57,
  quizzes: 5,
  products: 15,
  posts: 668,
  pages: 14,
};

let fail = 0;
console.log("Parity check (seed INSERT counts vs extracted counts):");
for (const [t, exp] of Object.entries(expected)) {
  const got = count(t);
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`  ${ok ? "PASS" : "FAIL"} ${t.padEnd(12)} expected ${exp}, got ${got}`);
}

// Informational (no fixed extracted target).
for (const t of ["course_steps", "term_relationships", "donation_forms", "donation_stats", "product_attributes", "seo_meta"]) {
  console.log(`  INFO ${t.padEnd(18)} ${count(t)}`);
}

console.log(fail ? `\n${fail} table(s) mismatched.` : "\nAll tracked tables match extracted counts.");
process.exit(fail ? 1 : 0);
