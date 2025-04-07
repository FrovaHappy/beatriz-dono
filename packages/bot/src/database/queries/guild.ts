import { eq } from 'drizzle-orm'
import cli from '../clientSQL'
import schemaGuilds from '../schemas/guilds'
import re from '@libs/regex'

export type Guild = {
  guild_id: string
  scope_bot: string
  features: {
    welcome: string
    goodbye: string
    colors: string
  }
}

/**
 * Reads and retrieves guild information from the database.
 *
 * This function ensures that the guild exists in the database by inserting default
 * entries if the guild is not already present. It then fetches the guild's details,
 * including its scope and features, such as welcome, goodbye, and colors.
 *
 * @param guild_id - The unique identifier of the guild to retrieve.
 * @returns A promise that resolves to an object containing the guild's details:
 *          - `guild_id`: The ID of the guild.
 *          - `scope_bot`: The scope of the bot for the guild.
 *          - `features`: An object containing the guild's features:
 *              - `welcome`: The welcome message or configuration.
 *              - `goodbye`: The goodbye message or configuration.
 *              - `colors`: The color settings for the guild.
 *          If the guildId is incorrect or an error occurs, the function returns `null`.
 */
export async function readGuild(guild_id: string) {
  try {
    const match = guild_id.match(re.guildId)
    console.log({ match, guild_id })
    if (!match) null

    await cli.insert(schemaGuilds).values({ id: guild_id }).onConflictDoNothing()
    const data = await cli
      .select({
        id: schemaGuilds.id,
        scope_bot: schemaGuilds.scope_bot,
        welcome: schemaGuilds.feature_welcome,
        goodbye: schemaGuilds.feature_goodbye,
        colors: schemaGuilds.feature_colors
      })
      .from(schemaGuilds)
      .where(eq(schemaGuilds.id, guild_id))

    const guild = data[0]
    if (!guild) return null

    return {
      guild_id: guild.id,
      scope_bot: guild.scope_bot,
      features: {
        welcome: guild.welcome,
        goodbye: guild.goodbye,
        colors: guild.colors
      }
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

/**
 * Retrieves a list of guilds from the database, including their features.
 *
 * This function executes a SQL query to fetch guild data and their associated features
 * (welcome, goodbye, and colors) by performing a LEFT JOIN between the `Guilds` table
 * and the `Guild_Features` table. The result is then formatted and mapped into a structured
 * array of guild objects.
 *
 * @returns {Promise<Guild[]>} A promise that resolves to an array of guild objects, where each
 * guild includes its ID, scope, and features (welcome, goodbye, and colors).
 *
 * @throws {Error} If the database query or data formatting fails.
 */
export async function getGuilds(): Promise<Guild[]> {
  const guilds = await cli
    .select({
      id: schemaGuilds.id,
      scope_bot: schemaGuilds.scope_bot,
      welcome: schemaGuilds.feature_welcome,
      goodbye: schemaGuilds.feature_goodbye,
      colors: schemaGuilds.feature_colors
    })
    .from(schemaGuilds)

  return guilds.map((guild: any) => {
    return {
      guild_id: guild.id,
      scope_bot: guild.scope_bot,
      features: {
        welcome: guild.welcome,
        goodbye: guild.goodbye,
        colors: guild.colors
      }
    }
  })
}
