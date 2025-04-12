import type { Client, ResultSet as Res } from '@libsql/client'
const { createClient } = require('@libsql/client')
import { drizzle } from 'drizzle-orm/libsql'

const cli = createClient({
  url: 'file:local.db',
  authToken: config.env.sql.token,
  syncUrl: config.env.sql.syncUrl,
  syncInterval: 60
}) as Client

export const syncCli = async () => {
  console.time('cli sync')
  cli.sync()
  console.timeEnd('cli sync')
}

export default drizzle(cli)
