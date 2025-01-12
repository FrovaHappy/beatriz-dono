import type { Client } from '@libsql/client'
const { createClient } = require('@libsql/client')

const client = createClient({
  url: config.env.sql.url,
  authToken: config.env.sql.token,
  syncUrl: config.env.sql.syncUrl,
  syncInterval: 60
}) as Client

export default client