import client, { formatResponse } from '../clientSQL'

export const readGuild = async (guild_id: string) => {
  let data = await client.execute({
    queries: `
      SELECT scope_bot, id, welcome, goodbye, colors FROM Guilds
      JOIN Guild_Features ON Guilds.id = Guild_Features.guild_id
      WHERE id = $guild_id;
    `,
    args: { guild_id }
  })
  if (data.rows.length === 0) {
    await client
      .execute({
        queries: `
          INSERT INTO Guilds (id) VALUES ($guild_id); 
          INSERT INTO Guild_Features (guild_id) VALUES ($guild_id);
        `,
        args: { guild_id }
      })
      .catch(e => {})
    data = await client.execute({
      queries: `
          INSERT INTO Guilds (id, scope_bot) VALUES ($guild_id, 'public');
          SELECT scope_bot, id, welcome, goodbye, colors FROM Guilds
          JOIN Guild_Features ON Guilds.id = Guild_Features.guild_id
          WHERE id = $guild_id
        `,
      args: { guild_id }
    })
  }
  const guild = formatResponse(data)[0]
  return {
    guild_id: guild.id,
    scope_bot: guild.scope_bot,
    features: {
      welcome: guild.welcome,
      goodbye: guild.goodbye,
      colors: guild.colors
    }
  }
}
