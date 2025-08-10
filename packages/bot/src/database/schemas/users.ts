import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export default sqliteTable('Users', {
  id: text().primaryKey(),
  hashEmail: text({ length: 100 })
})
