import crypto from 'node:crypto'
import { toJson } from '@/shared/general'
import { regexHexColor, regexRole } from '@libs/regex'
import type { ColorsTemplete } from '@libs/schemas/colorsTemplete'
import client, { formatResponse } from '../clientSQL'
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

const queryColorsSettings = async (guild_id: string) => {
  const queries = `
    SELECT Guilds.id as guild_id, pointer_id, templete, Guild_Features.colors as is_active FROM Guilds
    Left JOIN ColorSetting ON ColorSetting.guild_id = Guilds.id
    Left JOIN Guild_Features ON Guilds.id = Guild_Features.guild_id
    WHERE Guilds.id = $guild_id;
  `
  const data = await client.execute({
    queries,
    args: { guild_id }
  })
  let formateData = formatResponse<ColorSetting>(data)[0]

  if (!formateData) {
    const queryGuild = 'INSERT INTO Guilds (id) VALUES ($guild_id);'
    const queryColorSetting = `
      INSERT INTO ColorSetting (guild_id, pointer_id, templete) VALUES ($guild_id, null, null);
      ${queries}
    `
    await client.execute({ queries: queryGuild, args: { guild_id } }).catch(e => {})
    const newData = await client.execute({
      queries: queryColorSetting,
      args: { guild_id }
    })
    formateData = formatResponse<ColorSetting>(newData)[0]
  }
  return {
    guild_id: formateData.guild_id,
    is_active: !!formateData.is_active,
    pointer_id: formateData.pointer_id,
    templete: formateData.templete
  }
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
      .join(', ')}
    ;`
  await client.execute({
    queries,
    args: { guild_id, id: id.toString() }
  })
  return { inserted, failed }
}

export const deleteColors = async (guild_id: string, colors: Color[]) => {
  const queries = `
    DELETE FROM Colors
    WHERE guild_id = $guild_id AND role_id IN (${colors
      .map((color: Color) => {
        if (!regexRole.test(color.role_id)) return
        return `'${color.role_id}'`
      })
      .filter(c => c)
      .join(', ')})
    ;`
  const colorsQuery = await client.execute({
    queries,
    args: { guild_id }
  })

  return colorsQuery.rows.map(color => ({
    hex_color: color.hex_color,
    role_id: color.role_id
  }))
}

export const updateColorSetting = async (props: Partial<ColorSetting> & { guild_id: string }) => {
  const { guild_id, pointer_id, templete } = props
  const toUpdate = [
    {
      key: 'pointer_id',
      forUpdate: !!pointer_id,
      value: pointer_id
    },
    {
      key: 'templete',
      forUpdate: !!templete,
      value: templete
    }
  ].filter(v => v.forUpdate)
  await client.execute({
    queries: `
      ${toUpdate.length > 0 ? `UPDATE ColorSetting SET ${toUpdate.map(v => `${v.key} = $${v.key}`).join(', ')} WHERE guild_id = $guild_id` : ''};
    `,
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    args: { guild_id, ...toUpdate.reduce((acc, v) => ({ ...acc, [v.key]: v.value }), {}) }
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
