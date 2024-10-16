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
        cooldown: data.cooldown ?? config.cooldown,
        privatesServers: data.privatesServers ?? config.privatesServers,
        ownersServers: addItemsToArray(data.ownersServers ?? config.ownersServers, config.discordOwner),
        linkDiscord: data.linkDiscord ?? config.linkDiscord,
        linkGithub: data.linkGithub ?? config.linkGithub,
        linkDocumentation: data.linkDocumentation ?? config.linkDocumentation,
        linkWebsite: data.linkWebsite ?? config.linkWebsite,
        linkKofi: data.linkKofi ?? config.linkKofi,
        linkTopgg: data.linkTopgg ?? config.linkTopgg,
        linkBotList: data.linkBotList ?? config.linkBotList
      }
    })
  } else {
    setting = await db.setting.update({
      where: { id: setting.id },
      data: {
        cooldown: data.cooldown ?? setting.cooldown ?? config.cooldown,
        privatesServers: data.privatesServers ?? setting.privatesServers ?? config.privatesServers,
        ownersServers: addItemsToArray(
          data.ownersServers ?? setting.ownersServers ?? config.ownersServers,
          config.discordOwner
        ),
        linkDiscord: data.linkDiscord ?? setting.linkDiscord ?? config.linkDiscord,
        linkGithub: data.linkGithub ?? setting.linkGithub ?? config.linkGithub,
        linkDocumentation: data.linkDocumentation ?? setting.linkDocumentation ?? config.linkDocumentation,
        linkWebsite: data.linkWebsite ?? setting.linkWebsite ?? config.linkWebsite,
        linkKofi: data.linkKofi ?? setting.linkKofi ?? config.linkKofi,
        linkTopgg: data.linkTopgg ?? setting.linkTopgg ?? config.linkTopgg,
        linkBotList: data.linkBotList ?? setting.linkBotList ?? config.linkBotList
      }
    })
  }
  if (!setting) throw new Error('Setting not found')

  const { id, ...settingData } = setting

  globalThis.config = { ...config, ...settingData }
}

export default db
