import crypto from 'node:crypto'
import client, { formatResponse } from '../clientSQL'
import type { ColorsTemplete } from '@libs/schemas/colorsTemplete'
import { regexHexColor, regexRole } from '@libs/regex'
export interface Color {
  hex_color: string
  role_id: string
}
export interface ColorSetting {
  guild_id: string
  is_active: boolean
  pointer_id: string | null
  templete: ColorsTemplete | null
}

const queryColorsSettings = async (guild_id: string) => {
  let data = await client.execute({
    queries: `
      SELECT id as guild_id, is_active, pointer_id, templete FROM Guilds
      JOIN ColorSetting ON ColorSetting.guild_id = Guilds.id
      WHERE guild_id = $guild_id;
    `,
    args: { guild_id }
  })
  if (data.rows.length === 0) {
    await client
      .execute({
        queries: `
              INSERT INTO Guilds (id) VALUES ($guild_id);
            `,
        args: { guild_id }
      })
      .catch(e => {})

    data = await client.execute({
      queries: `
            INSERT INTO ColorSetting (guild_id, pointer_id, templete) VALUES ($guild_id, null, null);
            SELECT * FROM Guilds
            JOIN ColorSetting ON ColorSetting.guild_id = Guilds.id
            WHERE guild_id = $guild_id
          `,
      args: { guild_id }
    })
  }
  return formatResponse<ColorSetting>(data)[0]
}

const queryColors = async (guild_id: string) => {
  const data = await client.execute({
    queries: 'SELECT hex_color, role_id FROM Colors WHERE guild_id = $guild_id;',
    args: { guild_id }
  })
  return formatResponse<Color>(data)
}

export const readColors = async (guild_id: string) => {
  const colors = await queryColors(guild_id)
  const colorSetting = await queryColorsSettings(guild_id)

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
}
export const insertColors = async (props: { guild_id: string; colors: Color[] }) => {
  const { guild_id, colors } = props
  let inserted = 0
  let failed = 0
  if (colors.length === 0) return { inserted, failed }
  const id = crypto.randomUUID()
  const queries = `
  INSERT INTO Colors (id, guild_id, hex_color, role_id) VALUES ${colors
    .map((color: Color) => {
      if (!regexHexColor.test(color.hex_color) || !regexRole.test(color.role_id)) {
        failed++
        return
      }
      inserted++
      return `($id, $guild_id, '${color.hex_color}', '${color.role_id}')`
    })
    .filter(c => c)
    .join(', ')};
  `
  await client.execute({
    queries,
    args: { guild_id, id: id.toString() }
  })
  return { inserted, failed }
}

export const deleteColors = async (guild_id: string, colors: Color[]) => {
  const colorsQuery = await client.execute({
    queries: `
        DELETE FROM Colors
        WHERE guild_id = $guild_id AND role_id IN (${colors
          .map((color: Color) => {
            if (!regexRole.test(color.role_id)) return
            return `'${color.role_id}'`
          })
          .filter(c => c)
          .join(', ')});
      `,
    args: { guild_id }
  })

  return colorsQuery.rows.map(color => ({
    hex_color: color.hex_color,
    role_id: color.role_id
  }))
}

export const updateColorSetting = async (props: Partial<ColorSetting> & { guild_id: string }) => {
  const { guild_id, pointer_id, is_active, templete } = props
  const toUpdate = [
    ['pointer_id', pointer_id],
    ['is_active', is_active],
    ['templete', templete]
  ].filter(([, value]) => value)
  await client.execute({
    queries: `
      ${toUpdate.length > 0 ? `UPDATE ColorSetting SET ${toUpdate.map(([key, value]) => `${key} = ${value}`).join(', ')} WHERE guild_id = $guild_id` : ''};
    `,
    args: { guild_id }
  })
  const colorSetting = await queryColorsSettings(guild_id)
  return {
    guild_id,
    is_active: colorSetting.is_active,
    pointer_id: colorSetting.pointer_id,
    templete: colorSetting.templete,
    colors: await queryColors(guild_id)
  } as ColorSetting & { colors: Color[] }
}
