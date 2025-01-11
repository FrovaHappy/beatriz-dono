import type { Client } from '@libsql/client'
const { createClient } = require('@libsql/client')

const client = createClient({
  url: 'file:local.db',
  authToken: '...',
  syncUrl: '...',
  syncInterval: 60
}) as Client

export default client