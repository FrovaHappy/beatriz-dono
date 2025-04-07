import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'

export default sqliteTable('Users', {
  id: text().primaryKey(),
  hashEmail: text({ length: 100 })
})
