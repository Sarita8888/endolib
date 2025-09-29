import { Client } from 'pg';

export async function checkPostgres(url: string) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as ok');
    return res.rows?.[0]?.ok === 1;
  } finally {
    await client.end().catch(() => {});
  }
}
