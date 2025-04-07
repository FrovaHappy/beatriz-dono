import { toJson } from '@/shared/general'
import client from '../clientSQL'
import { readGuild } from './guild'
import type { MessageOptions } from '@/types/main'
import schemaWelcomes from '../schemas/welcomes'
import { eq } from 'drizzle-orm'

interface Welcome {
  guild_id: string
  is_active: boolean
  channel_id: string | null
  messageOptions: MessageOptions | null
}

export const readWelcome = async (guild_id: string) => {
  const guild = await readGuild(guild_id)
  if (!guild) return null

  const query = (await client.select().from(schemaWelcomes).where(eq(schemaWelcomes.guild_id, guild_id)))[0]
  const welcome = {
    guild_id: guild.guild_id,
    is_active: guild.features.welcome,
    channel_id: query?.channel_id,
    messageOptions: toJson(query?.message_options) || null
  } as Welcome

  return welcome
}
