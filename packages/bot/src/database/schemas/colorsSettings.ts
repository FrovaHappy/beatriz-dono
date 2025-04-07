import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import schemaGuilds from './guilds'

export default sqliteTable('ColorsSettings', {
  guild_id: text().references(() => schemaGuilds.id),
  pointer_id: text({ length: 30 }),
  templete: text({ mode: 'json' })
})
