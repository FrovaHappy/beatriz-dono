import type { Canvas } from '@type/index'
import '../../config'
import crypto from 'node:crypto'
import { LAST_VERSION } from '@libs/PaintCanvas/schema.welcome.v1'
import { and, eq } from 'drizzle-orm'
import cli from '../clientSQL'
import schemaCanvas from '../schemas/canvas'
import { readGuild } from './guild'
import { readUser } from './users'

type InsertCanvas = {
  guildId: string
  canvas: Canvas
  userId: string
}

export async function readCanvas(guildId: string | null) {
  if (!guildId) return []
  const result = await cli.select().from(schemaCanvas).where(eq(schemaCanvas.guild_id, guildId))
  return result
}

export async function upsertCanvas(props: InsertCanvas) {
  const { guildId, canvas, userId } = props
  const guild = await readGuild(guildId)
  const user = await readUser({ id: userId })
  if (!user || !guild) return { operation: null }
  const id = canvas.id || crypto.randomUUID()
  const existCanvas = (
    await cli
      .select()
      .from(schemaCanvas)
      .where(and(eq(schemaCanvas.id, id), eq(schemaCanvas.guild_id, guildId)))
  )[0]
  const operation = existCanvas ? 'update' : 'insert'

  const values = {
    forked: existCanvas?.forked || canvas.forked || null,
    version: canvas.version || existCanvas?.version || LAST_VERSION,
    title: canvas.title,
    visibility: canvas.visibility || existCanvas?.visibility || 'public',
    w: canvas.w || existCanvas?.w || 0,
    h: canvas.h || existCanvas?.h || 0,
    bg_color: canvas.bg_color || existCanvas?.bg_color || null,
    layer_cast_color: canvas.layer_cast_color || existCanvas?.layer_cast_color || null,
    layers: canvas.layers || existCanvas?.layers || null,
    created_at: existCanvas?.created_at || Date.now().toString(),
    updated_at: Date.now().toString()
  }

  const inmutableValues = {
    id: existCanvas?.id || crypto.randomUUID(),
    user_id: user.id,
    guild_id: guild.guild_id
  }

  if (operation === 'insert') {
    await cli
      .insert(schemaCanvas)
      .values({ ...inmutableValues, ...values })
      .onConflictDoNothing({
        where: and(eq(schemaCanvas.id, inmutableValues.id), eq(schemaCanvas.guild_id, guildId))
      })
  } else {
    await cli
      .update(schemaCanvas)
      .set(values)
      .where(and(eq(schemaCanvas.id, inmutableValues.id), eq(schemaCanvas.guild_id, guildId)))
  }
  return { operation, canvas: inmutableValues }
}

export async function deleteCanvas({ guild_id, id }: { guild_id: string; id: string }) {
  await cli.delete(schemaCanvas).where(and(eq(schemaCanvas.id, id), eq(schemaCanvas.guild_id, guild_id)))
  return { operation: 'delete', id }
}
