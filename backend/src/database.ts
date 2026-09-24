import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const sql = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8');

// In-memory Postgres (PGlite). Swap for a `pg` Pool to use a real server; the SQL is unchanged.
export async function createDatabase(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(sql('./schema.sql'));
  await db.exec(sql('./seed.sql'));
  return db;
}
