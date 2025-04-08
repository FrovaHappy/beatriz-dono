import type { Canvas } from '@type/index'
import '../../config'
import cli from '../clientSQL'
import { readGuild } from './guild'
import { LAST_VERSION } from '@libs/PaintCanvas/schema.welcome.v1'
import { and, eq } from 'drizzle-orm'
import crypto from 'node:crypto'
import schemaCanvas from '../schemas/canvas'
import { readUser } from './users'
import { create } from 'node:domain'

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
  console.log(canvas.id)
  let id = canvas.id || crypto.randomUUID()

  const existCanvas = (
    await cli
      .select()
      .from(schemaCanvas)
      .where(and(eq(schemaCanvas.id, id), eq(schemaCanvas.guild_id, guildId)))
  )[0]
  console.log(existCanvas)
  if (!existCanvas) id = crypto.randomUUID()
  const guild = await readGuild(guildId)
  const user = await readUser({ id: userId })
  if (!user || !guild) return null

  const uniqueValues = {
    id: id.slice(0, 5),
    user_id: user.id,
    guild_id: guild.guild_id
  }
  const values = {
    forked: existCanvas?.forked || null,
    version: canvas.version || existCanvas?.version || LAST_VERSION,
    title: canvas.title || existCanvas?.title || id.slice(0, 5),
    visibility: canvas?.visibility || existCanvas?.visibility || 'private',
    w: canvas.w,
    h: canvas.h,
    bg_color: canvas?.bgColor || existCanvas?.bg_color || null,
    layer_cast_color: canvas?.layerCastColor || existCanvas?.layer_cast_color || null,
    layers: JSON.stringify(canvas?.layers || existCanvas?.layers || []),
    created_at: existCanvas?.created_at || Date.now().toString(),
    updated_at: !existCanvas ? Date.now().toString() : existCanvas.updated_at
  }
  if (!existCanvas) {
    await cli
      .insert(schemaCanvas)
      .values({ ...uniqueValues, ...values })
      .onConflictDoNothing()
    return { operation: 'insert', id }
  }
  await cli
    .update(schemaCanvas)
    .set(values)
    .where(and(eq(schemaCanvas.id, id), eq(schemaCanvas.guild_id, guildId)))
  return { operation: 'update', id }
}
