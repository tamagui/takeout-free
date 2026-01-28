import sql from './0001_thankful_jazinda.sql?raw'

import type { PoolClient } from 'pg'

export async function up(client: PoolClient) {
  await client.query(sql)
}
