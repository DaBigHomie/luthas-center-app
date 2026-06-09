/**
 * extract-taxonomy.ts — unified `terms` + `term_relationships`.
 *
 * Covers all taxonomies present on blog 1 (24+). Emits:
 *   terms: { term_id, name, slug, taxonomy, parent, count }
 *   term_relationships: { object_id, term_id, taxonomy }
 *
 * Run: npx tsx scripts/extract/extract-taxonomy.ts
 */
import { WP_PREFIX, query, closePool } from './lib/wp-db.ts';
import { writeJson } from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

export async function extractTaxonomy() {
  const terms = await query<RowDataPacket & {
    term_id: number;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    count: number;
  }>(
    `SELECT t.term_id, t.name, t.slug, tt.taxonomy, tt.parent, tt.count
       FROM ${WP_PREFIX}term_taxonomy tt
       JOIN ${WP_PREFIX}terms t ON t.term_id = tt.term_id
      ORDER BY tt.taxonomy, t.name`,
  );

  const relationships = await query<RowDataPacket & {
    object_id: number;
    term_id: number;
    taxonomy: string;
  }>(
    `SELECT tr.object_id, tt.term_id, tt.taxonomy
       FROM ${WP_PREFIX}term_relationships tr
       JOIN ${WP_PREFIX}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
      ORDER BY tr.object_id`,
  );

  const taxonomyBreakdown: Record<string, number> = {};
  for (const t of terms) {
    taxonomyBreakdown[t.taxonomy] = (taxonomyBreakdown[t.taxonomy] ?? 0) + 1;
  }

  const payload = {
    domain: 'taxonomy',
    source: 'luthascenter.com (wp_ / blog_id=1)',
    blog_id: 1 as const,
    extracted_at: new Date().toISOString(),
    term_count: terms.length,
    relationship_count: relationships.length,
    taxonomy_count: Object.keys(taxonomyBreakdown).length,
    taxonomy_breakdown: taxonomyBreakdown,
    terms,
    term_relationships: relationships,
  };

  const file = await writeJson('taxonomy', payload);
  return {
    file,
    termCount: terms.length,
    relationshipCount: relationships.length,
    taxonomyCount: Object.keys(taxonomyBreakdown).length,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractTaxonomy()
    .then((r) => {
      console.log(`taxonomy -> ${r.termCount} terms, ${r.relationshipCount} relationships across ${r.taxonomyCount} taxonomies`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
