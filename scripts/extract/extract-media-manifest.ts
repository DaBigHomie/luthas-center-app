/**
 * extract-media-manifest.ts — `attachment` manifest (NO file fetching).
 *
 * Per attachment: id, guid, _wp_attached_file, post_mime_type, alt text,
 * post_parent, plus width/height/sizes parsed from `_wp_attachment_metadata`.
 *
 * Run: npx tsx scripts/extract/extract-media-manifest.ts
 */
import {
  WP_PREFIX,
  query,
  closePool,
  unserialize,
  fetchMetaForPosts,
  m,
  toInt,
} from './lib/wp-db.ts';
import { envelope, writeJson } from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

interface AttRow extends RowDataPacket {
  ID: number;
  post_title: string;
  guid: string;
  post_mime_type: string;
  post_parent: number;
  post_status: string;
  post_date: string;
}

interface SizeEntry {
  name: string;
  file: string | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
}

export async function extractMediaManifest() {
  // Include inherit (normal), private, and skip trash.
  const posts = await query<AttRow>(
    `SELECT ID, post_title, guid, post_mime_type, post_parent, post_status, post_date
       FROM ${WP_PREFIX}posts
      WHERE post_type='attachment' AND post_status <> 'trash'
      ORDER BY ID`,
  );
  const ids = posts.map((p) => p.ID);
  const meta = await fetchMetaForPosts(ids);

  const records = posts.map((p) => {
    const bag = meta.get(p.ID);
    const metaBlob = unserialize<Record<string, unknown>>(m(bag, '_wp_attachment_metadata'));
    let width: number | null = null;
    let height: number | null = null;
    let sizes: SizeEntry[] = [];
    if (metaBlob && typeof metaBlob === 'object') {
      width = toInt(metaBlob.width);
      height = toInt(metaBlob.height);
      const s = metaBlob.sizes as Record<string, Record<string, unknown>> | undefined;
      if (s && typeof s === 'object') {
        sizes = Object.entries(s).map(([name, v]) => ({
          name,
          file: (v?.file as string) ?? null,
          width: toInt(v?.width),
          height: toInt(v?.height),
          mime_type: (v?.['mime-type'] as string) ?? null,
        }));
      }
    }
    return {
      wp_id: p.ID,
      title: p.post_title,
      status: p.post_status,
      guid: p.guid,
      attached_file: m(bag, '_wp_attached_file') || null,
      mime_type: p.post_mime_type,
      alt: m(bag, '_wp_attachment_image_alt') || null,
      post_parent: p.post_parent || null,
      date: p.post_date,
      width,
      height,
      sizes,
    };
  });

  const file = await writeJson(
    'media',
    envelope('media', records, {
      note: 'Manifest only — no binary files were fetched.',
    }),
  );
  return { file, count: records.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractMediaManifest()
    .then((r) => {
      console.log(`media -> ${r.count} attachments`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
