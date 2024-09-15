import { REST, Routes } from 'discord.js'

const { config } = globalThis
const rest = new REST().setToken(config.discordToken)

export default async function updatePublic(commands: any[]): Promise<void> {
  console.log('\nDeploy Public Commands started ...')
  try {
    const data = (await rest.put(Routes.applicationCommands(config.discordClient), {
      body: commands
    })) as any[]

    console.log(`· Done with ${data.length} commands.`)
  } catch (error: any) {
    console.log(`· Fails public commands: ${error.message}`)
  }
}
