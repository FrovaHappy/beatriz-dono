import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'
import schemaGuilds from './guilds'

export default sqliteTable('Colors', {
  guild_id: text()
    .notNull()
    .references(() => schemaGuilds.id),
  hex_color: text().notNull(),
  role_id: text().notNull()
})
