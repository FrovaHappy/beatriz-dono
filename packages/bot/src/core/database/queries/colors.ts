import client from '../clientSQL'
interface Color {
  hex_color: string
  role_id: string
}
interface Colors {
  guild_id: string
  is_active: boolean
  pointer_id: number
  templete: Record<string, any>
  colors: [Color]
}
const ColorRegex = {
  hex_color: /^#[0-9A-F]{6}$/i,
  role_id: /^[0-9]{5,30}$/i
}

export const getColors = async (guild_id: string) => {
  const colorsQuery = (
    await client.execute({
      sql: 'SELECT hex_color, role_id FROM ColorsWHERE guild_id = $guild_id;',
      args: { guild_id }
    })
  ).toJSON()
  const colorsSettingsQuery = (
    await client.execute({
      sql: `
        SELECT * FROM ColorSetting
        WHERE guild_id = $guild_id
        IF guild_id IS NULL THEN
          INSERT INTO ColorSetting (guild_id)
          VALUES ($guild_id)
        END IF;
      `,
      args: { guild_id }
    })
  ).toJSON()
  if (colorsSettingsQuery.length === 0) return null
  return {
    guild_id,
    is_active: colorsSettingsQuery[0].is_active,
    pointer_id: colorsSettingsQuery[0].pointer_id,
    templete: colorsSettingsQuery[0].templete,
    colors: colorsQuery.rows.map((color: any) => ({
      hex_color: color.hex_color,
      role_id: color.role_id
    }))
  } as Colors
}

export const createColors = async (guild_id: string, colors: [Color]) => {
  const colorsQuery = (
    await client.execute({
      sql: `
        SELECT hex_color, role_id FROM Colors 
        INSERT INTO Colors (guild_id, hex_color, role_id)
        ${colors
          .map((color: Color) => {
            if (!ColorRegex.hex_color.test(color.hex_color)) return
            if (!ColorRegex.role_id.test(color.role_id)) return
            return `VALUES ($guild_id, ${color.hex_color}, ${color.role_id})`
          })
          .filter(c => c)
          .join(', ')}
        }
      `,
      args: { guild_id }
    })
  ).toJSON()
  const colorsSettingsQuery = (
    await client.execute({
      sql: `
        SELECT {guild_id, is_active, pointer_id, templete} FROM ColorSetting
        WHERE guild_id = $guild_id
        IF guild_id IS NULL THEN
          INSERT INTO ColorSetting (guild_id)
          VALUES ($guild_id)
        END IF;
      `,
      args: { guild_id }
    })
  ).toJSON()
  return {
    guild_id,
    is_active: colorsSettingsQuery[0].is_active,
    pointer_id: colorsSettingsQuery[0].pointer_id,
    templete: colorsSettingsQuery[0].templete,
    colors: colorsQuery.rows.map((color: any) => ({
      hex_color: color.hex_color,
      role_id: color.role_id
    }))
  } as Colors
}

export const deleteColors = async (guild_id: string, colors: [Color]) => {
  const colorsQuery = (
    await client.execute({
      sql: `
        SELECT hex_color, role_id FROM Colors
        DELETE FROM Colors
        WHERE guild_id = $guild_id AND hex_color IN (${colors
          .map((color: Color) => {
            if (!ColorRegex.hex_color.test(color.hex_color)) return
            if (!ColorRegex.role_id.test(color.role_id)) return
            return `${color.hex_color}, ${color.role_id}`
          })
          .filter(c => c)
          .join(', ')})
      `,
      args: { guild_id }
    })
  ).toJSON()

  return colors.filter(color => !colorsQuery.includes((c: any) => c.role_id === color.role_id))
}
