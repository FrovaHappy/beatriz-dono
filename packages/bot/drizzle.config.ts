import './src/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schemas',
  dialect: 'turso',
  dbCredentials: {
    url: config.env.sql.syncUrl,
    authToken: config.env.sql.token
  }
})
