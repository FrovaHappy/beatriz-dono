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

  let id = canvas.id || crypto.randomUUID()

  const existCanvas = (
    await cli
      .select()
      .from(schemaCanvas)
      .where(and(eq(schemaCanvas.id, id), eq(schemaCanvas.guild_id, guildId)))
  )[0]
  if (!existCanvas) id = crypto.randomUUID()
  const guild = await readGuild(guildId)
  const user = await readUser({ id: userId })
  if (!user || !guild) return null
  const values = {
    id, // value not editable by user
    guild_id: guild?.guild_id, // value not editable by user
    user_id: existCanvas?.user_id || user.id, // value not editable by user
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
  const { id: idUn, ...valuesWithoutId } = values
  const result = await cli.insert(schemaCanvas).values(values).onConflictDoUpdate({
    target: schemaCanvas.id,
    set: valuesWithoutId
  })
  console.log({ result })
  return result
}
