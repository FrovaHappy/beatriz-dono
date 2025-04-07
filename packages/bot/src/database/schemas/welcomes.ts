import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'
import schemaGuilds from './guilds'

export default sqliteTable('Welcomes', {
  guild_id: text()
    .primaryKey()
    .notNull()
    .references(() => schemaGuilds.id),
  message_options: text({ mode: 'json' }).notNull(),
  channel_id: text({ length: 30 })
})
