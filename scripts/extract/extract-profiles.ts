/**
 * extract-profiles.ts — `wp_users` (8) + roles from `wp_capabilities` meta.
 *
 * Privacy: we emit identity/role fields needed to seed authors/admins. We do
 * NOT emit password hashes or activation/session secrets.
 *
 * Run: npx tsx scripts/extract/extract-profiles.ts
 */
import {
  WP_PREFIX,
  query,
  closePool,
  unserialize,
  fetchMetaForPosts,
  m,
} from './lib/wp-db.ts';
import { envelope, writeJson } from './lib/common.ts';
import type { RowDataPacket } from 'mysql2/promise';

interface UserRow extends RowDataPacket {
  ID: number;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_registered: string;
  display_name: string;
  user_url: string;
}

export async function extractProfiles() {
  const users = await query<UserRow>(
    `SELECT ID, user_login, user_nicename, user_email, user_registered,
            display_name, user_url
       FROM ${WP_PREFIX}users
      ORDER BY ID`,
  );
  const ids = users.map((u) => u.ID);
  const meta = await fetchMetaForPosts(ids, `${WP_PREFIX}usermeta`, 'user_id');

  const records = users.map((u) => {
    const bag = meta.get(u.ID);
    const capsBlob = unserialize<Record<string, boolean>>(m(bag, 'wp_capabilities')) ?? {};
    const roles = Object.entries(capsBlob)
      .filter(([, v]) => v === true)
      .map(([role]) => role);

    return {
      wp_id: u.ID,
      login: u.user_login,
      nicename: u.user_nicename,
      email: u.user_email,
      display_name: u.display_name,
      url: u.user_url || null,
      registered: u.user_registered,
      roles,
      primary_role: roles[0] ?? null,
      first_name: m(bag, 'first_name') || null,
      last_name: m(bag, 'last_name') || null,
      description: m(bag, 'description') || null,
      nickname: m(bag, 'nickname') || null,
    };
  });

  const file = await writeJson('profiles', envelope('profiles', records, {
    note: 'No password hashes or session/activation secrets extracted.',
  }));
  return { file, count: records.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  extractProfiles()
    .then((r) => {
      console.log(`profiles -> ${r.count} users`);
      console.log(r.file);
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(closePool);
}
