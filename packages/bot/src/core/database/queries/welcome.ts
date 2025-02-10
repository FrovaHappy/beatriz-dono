import client, { formatResponse } from '../clientSQL'

interface Welcome {
  guild_id: string
  is_active: boolean
  channel_id: string | null
  content: string | null
  embed: string | null
}

export const readWelcome = async (guild_id: string) => {
  let data = await client.execute({
    queries: `
      SELECT is_active, channel_id,content, embed FROM Welcomes
      JOIN Guilds ON Guilds.id = Welcomes.guild_id
      WHERE guild_id = $guild_id;
    `,
    args: { guild_id }
  })
  if (data.rows.length === 0) {
    await client
      .execute({
        queries: 'INSERT INTO Guilds (id) VALUES ($guild_id);',
        args: { guild_id }
      })
      .catch(e => {})
    data = await client.execute({
      queries: `
          INSERT INTO Welcomes (guild_id, is_active, channel_id, content, embed) VALUES ($guild_id, false, null, null, null);
          SELECT * FROM Welcomes
          JOIN Guilds ON Guilds.id = Welcomes.guild_id
          WHERE guild_id = $guild_id
        `,
      args: { guild_id }
    })
  }
  return formatResponse(data)[0]
}
