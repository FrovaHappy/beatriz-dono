import { Timer } from '@/shared/general'
import logger from '@/shared/logger'
import type { Client, ResultSet as Res } from '@libsql/client'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const cli = createClient({
  url: 'file:local.db',
  authToken: config.env.sql.token,
  syncUrl: config.env.sql.syncUrl,
  syncInterval: 60
}) as Client

export const syncCli = async () => {
  const timer = new Timer()
  cli.sync()
  return timer.final()
}

export default drizzle(cli)
