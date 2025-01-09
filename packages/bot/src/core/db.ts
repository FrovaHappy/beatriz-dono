import { PrismaClient, type Setting } from '@prisma/client'
const db = new PrismaClient()

export async function setSetting(data: Partial<Setting>) {
  const { config } = globalThis
  let setting = await db.setting.findFirst()
  const addItemsToArray = (arr: string[], item: string) => {
    return [...new Set([...arr, item])]
  }
  if (!setting) {
    await db.setting.create({
      data: {
        cooldown: data.cooldown ?? config.env.discord.cooldown,
        privatesServers: data.privatesServers ?? config.setting.ownersServers,
        ownersServers: [config.env.discord.guildOwner],
        linkDiscord: data.linkDiscord ?? config.setting.linkDiscord,
        linkGithub: data.linkGithub ?? config.setting.linkGithub,
        linkDocumentation: data.linkDocumentation ?? config.setting.linkDocumentation,
        linkWebsite: data.linkWebsite ?? config.setting.linkWebsite,
        linkKofi: data.linkKofi ?? config.setting.linkKofi,
        linkTopgg: data.linkTopgg ?? config.setting.linkTopgg,
        linkBotList: data.linkBotList ?? config.setting.linkBotList
      }
    })
  } else {
    setting = await db.setting.update({
      where: { id: setting.id },
      data: {
        cooldown: data.cooldown ?? setting.cooldown ?? config.setting.cooldown,
        privatesServers: data.privatesServers ?? setting.privatesServers ?? config.setting.privatesServers,
        ownersServers: [...new Set([config.env.discord.guildOwner, ...(data.ownersServers ?? setting.ownersServers)])],
        linkDiscord: data.linkDiscord ?? setting.linkDiscord ?? config.setting.linkDiscord,
        linkGithub: data.linkGithub ?? setting.linkGithub ?? config.setting.linkGithub,
        linkDocumentation: data.linkDocumentation ?? setting.linkDocumentation ?? config.setting.linkDocumentation,
        linkWebsite: data.linkWebsite ?? setting.linkWebsite ?? config.setting.linkWebsite,
        linkKofi: data.linkKofi ?? setting.linkKofi ?? config.setting.linkKofi,
        linkTopgg: data.linkTopgg ?? setting.linkTopgg ?? config.setting.linkTopgg,
        linkBotList: data.linkBotList ?? setting.linkBotList ?? config.setting.linkBotList
      }
    })
  }
  if (!setting) throw new Error('Setting not found')

  const { id, ...settingData } = setting

  globalThis.config = { ...config, setting: settingData }
}

export default db
