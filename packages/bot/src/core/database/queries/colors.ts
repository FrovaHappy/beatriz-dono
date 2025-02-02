import { createHash } from 'node:crypto'
import client, { formatResponse, type ResultSet } from '../clientSQL'
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
  templete: ColorsTemplete
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
            INSERT INTO ColorSetting (guild_id, pointer_id, templete) VALUES ($guild_id, 0, null);
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
interface CreateColors {
  guild_id: string
  pointer_id?: string
  colors: Color[]
}
export const createColors = async ({ guild_id, pointer_id, colors }: CreateColors) => {
  const colorsSettingsQuery = (
    await client.execute({
      queries: `
        SELECT {guild_id, is_active, pointer_id, templete} FROM Guilds
        JOIN ColorSetting ON ColorSetting.guild_id = Guilds.id
        WHERE guild_id = $guild_id
        IF guild.id IS NULL THEN
          INSERT INTO Guilds (id)
          VALUES ($guild_id)
        END IF
        IF guild_id IS NULL THEN
          INSERT INTO ColorSetting (guild_id, pointer_id)
          VALUES ($guild_id, $pointer_id)
        END IF;
      `,
      args: { guild_id, pointer_id: pointer_id ?? null }
    })
  ).toJSON()
  let colorsQuery: ResultSet
  if (colors.length === 0) {
    colorsQuery = await client.execute({
      queries: `
          SELECT hex_color, role_id FROM Colors
          WHERE guild_id = $guild_id
        `,
      args: { guild_id }
    })
  } else {
    colorsQuery = (
      await client.execute({
        queries: `
          SELECT hex_color, role_id FROM Colors 
          INSERT INTO Colors (guild_id, hex_color, role_id)
          ${colors
            .map((color: Color) => {
              if (!regexHexColor.test(color.hex_color)) return
              if (!regexRole.test(color.role_id)) return
              return `VALUES ($guild_id, ${color.hex_color}, ${color.role_id})`
            })
            .filter(c => c)
            .join(', ')};
        `,
        args: { guild_id }
      })
    ).toJSON()
  }
  return {
    guild_id,
    is_active: colorsSettingsQuery[0].is_active,
    pointer_id: colorsSettingsQuery[0].pointer_id,
    templete: colorsSettingsQuery[0].templete,
    colors: colorsQuery.rows.map(color => ({
      hex_color: color.hex_color,
      role_id: color.role_id
    }))
  } as ColorSetting & { colors: Color[] }
}

export const deleteColors = async (guild_id: string, colors: Color[]) => {
  const colorsQuery = await client.execute({
    queries: `
        SELECT hex_color, role_id FROM Colors
        DELETE FROM Colors
        WHERE guild_id = $guild_id AND hex_color IN (${colors
          .map((color: Color) => {
            if (!regexHexColor.test(color.hex_color)) return
            if (!regexRole.test(color.role_id)) return
            return `${color.hex_color}, ${color.role_id}`
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

interface UpdateColors {
  guild_id: string
  pointer_id?: string
  colorTemplate?: ColorsTemplete
  is_active?: boolean
  colors: Color[]
}
export const updateColors = async ({ guild_id, pointer_id, colorTemplate, is_active, colors }: UpdateColors) => {
  const colorsSettingsQuery = await client.execute({
    queries: `
        SELECT {guild_id, is_active, pointer_id, templete} FROM Guilds
        JOIN ColorSetting ON ColorSetting.guild_id = Guilds.id
        WHERE guild_id = $guild_id
        IF $pointer_id IS NOT NULL THEN
          UPDATE ColorSetting SET pointer_id = $pointer_id WHERE guild_id = $guild_id
        END IF
        IF $colorTemplate IS NOT NULL THEN
          UPDATE ColorSetting SET templete = $colorTemplate WHERE guild_id = $guild_id
        END IF
        IF $is_active IS NOT NULL THEN
          UPDATE ColorSetting SET is_active = $is_active WHERE guild_id = $guild_id
        END IF;
      `,
    args: {
      guild_id,
      pointer_id: pointer_id ?? null,
      colorTemplate: colorTemplate ? JSON.stringify(colorTemplate) : null,
      is_active: is_active ?? null
    }
  })

  const colorsQuery = await client.execute({
    queries: `
        SELECT hex_color, role_id FROM Colors
        WHERE guild_id = $guild_id
        UPDATE Colors WHERE guild_id = $guild_id AND hex_color IN (${colors
          .map((color: Color) => {
            if (!regexHexColor.test(color.hex_color)) return
            if (!regexRole.test(color.role_id)) return
            return `${color.hex_color}, ${color.role_id}`
          })
          .filter(c => c)
          .join(', ')}
        );

      `,
    args: { guild_id }
  })
  if (colorsSettingsQuery.rows.length === 0) return null
  return {
    guild_id,
    is_active: colorsSettingsQuery.rows[0].is_active,
    pointer_id: colorsSettingsQuery.rows[0].pointer_id,
    templete: colorsSettingsQuery.rows[0].templete,
    colors: colorsQuery.rows.map(color => ({
      hex_color: color.hex_color,
      role_id: color.role_id
    }))
  }
}
