import { regexHexColor, regexRole } from '@libs/regex'
import client from '../clientSQL'
import schemaColorsSettings from '../schemas/colorsSettings'
import schemaColors from '../schemas/colors'
import schemaGuilds from '../schemas/guilds'
import { readGuild } from './guild'
import { and, eq, inArray } from 'drizzle-orm'
import { toJson } from '@/shared/general'
import type { ColorsTempleteLatest } from '@libs/schemas/colorsTemplete'

export interface Color {
  hex_color: string
  role_id: string
}
export interface ColorSetting {
  guild_id: string
  is_active: boolean
  pointer_id: string | null
  templete: string | null
}

export async function readColorsSettings(guild_id: string) {
  console.log(guild_id)
  const guild = await readGuild(guild_id)
  if (!guild) return null
  await client
    .insert(schemaColorsSettings)
    .values({
      guild_id
    })
    .onConflictDoNothing()
  const data = (
    await client
      .select({
        pointer_id: schemaColorsSettings.pointer_id,
        templete: schemaColorsSettings.templete
      })
      .from(schemaColorsSettings)
      .where(eq(schemaColorsSettings.guild_id, guild_id))
  )[0]
  if (!data) return null
  return {
    guild_id: guild.guild_id,
    is_active: guild.features.colors,
    pointer_id: data.pointer_id,
    templete: toJson<ColorsTempleteLatest | null>(data.templete)
  }
}

const queryColors = async (guild_id: string) => {
  const data = await client
    .select({ hex_color: schemaColors.hex_color, role_id: schemaColors.role_id })
    .from(schemaColors)
    .where(eq(schemaColors.guild_id, guild_id))
  return data.map(color => ({
    hex_color: color.hex_color,
    role_id: color.role_id
  }))
}

export const readColors = async (guild_id: string) => {
  try {
    const colors = await queryColors(guild_id)
    if (!colors) return null
    const colorSetting = await readColorsSettings(guild_id)
    if (!colorSetting) return null
    return {
      guild_id,
      is_active: colorSetting.is_active,
      pointer_id: colorSetting.pointer_id,
      templete: colorSetting.templete,
      colors: colors.map(color => ({
        hex_color: color.hex_color,
        role_id: color.role_id
      }))
    } as ColorSetting & { colors: Color[] }
  } catch (error) {
    console.log(error)
    return null
  }
}
export const insertColors = async (props: { guild_id: string; colors: Color[] }) => {
  const { guild_id, colors } = props
  if (colors.length === 0) return { inserted: 0 }
  const colorsFiltered = colors.filter(color => regexHexColor.test(color.hex_color) && regexRole.test(color.role_id))

  await client
    .insert(schemaColors)
    .values(
      colorsFiltered.map(color => ({
        guild_id,
        hex_color: color.hex_color,
        role_id: color.role_id
      }))
    )
    .onConflictDoNothing()
  return { inserted: colorsFiltered.length }
}

export const deleteColors = async (guild_id: string, colors: Color[]) => {
  const colorsFiltered = colors.filter(color => regexRole.test(color.role_id))
  const colorsQuery = await client.delete(schemaColors).where(
    and(
      eq(schemaColors.guild_id, guild_id),
      inArray(
        schemaColors.role_id,
        colorsFiltered.map(color => color.role_id)
      )
    )
  )
  return { deleted: colorsQuery.rowsAffected }
}

export const updateColorSetting = async (props: Partial<ColorSetting> & { guild_id: string }) => {
  const { guild_id, pointer_id, templete } = props
  const colorSetting = await readColorsSettings(guild_id)
  if (!colorSetting) return null
  const updateColorSetting = {
    guild_id,
    pointer_id: pointer_id ?? colorSetting.pointer_id,
    templete: templete ?? colorSetting.templete,
    is_active: colorSetting.is_active
  }
  if (
    updateColorSetting.pointer_id !== colorSetting.pointer_id ||
    updateColorSetting.templete !== colorSetting.templete
  ) {
    await client
      .update(schemaColorsSettings)
      .set({
        pointer_id: updateColorSetting.pointer_id,
        templete: updateColorSetting.templete
      })
      .where(eq(schemaColorsSettings.guild_id, updateColorSetting.guild_id))
  }
  if (updateColorSetting.is_active !== colorSetting.is_active) {
    await client
      .update(schemaGuilds)
      .set({ feature_welcome: updateColorSetting.is_active })
      .where(eq(schemaGuilds.id, updateColorSetting.guild_id))
  }
  return {
    guild_id,
    is_active: colorSetting.is_active,
    pointer_id: colorSetting.pointer_id,
    templete: colorSetting.templete,
    colors: await queryColors(guild_id)
  } as ColorSetting & { colors: Color[] }
}
