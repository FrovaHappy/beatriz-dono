import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export default sqliteTable('Guilds', {
  id: text().primaryKey(),
  scope_bot: text({ enum: ['free', 'premium', 'dev'] })
    .notNull()
    .default('free'),
  feature_welcome: int({ mode: 'boolean' }).notNull().default(false),
  feature_goodbye: int({ mode: 'boolean' }).notNull().default(false),
  feature_colors: int({ mode: 'boolean' }).notNull().default(false)
})
