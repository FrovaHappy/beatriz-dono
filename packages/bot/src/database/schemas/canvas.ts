import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import schemaGuilds from './guilds'
import schemaUsers from './users'

export default sqliteTable('Canvas', {
  id: text().primaryKey().notNull(),
  user_id: text()
    .notNull()
    .references(() => schemaUsers.id),
  guild_id: text()
    .notNull()
    .references(() => schemaGuilds.id),
  title: text({ length: 30 }).notNull(),
  forked: text({ length: 50 }),
  version: text({ length: 10 }).notNull(),
  visibility: text({ length: 10, enum: ['public', 'private'] })
    .notNull()
    .default('private'),
  w: int().notNull(),
  h: int().notNull(),
  bg_color: text({ length: 7 }),
  layer_cast_color: text({ length: 7 }),
  layers: text({ mode: 'json' }).notNull(),
  created_at: text().notNull().default(Date.now().toString()),
  updated_at: text().notNull().default(Date.now().toString())
})
