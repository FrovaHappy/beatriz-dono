import { PrismaClient, type Setting } from '@prisma/client'
const db = new PrismaClient()

export async function setSetting(data: Partial<Setting>) {
  const { config } = globalThis
  let setting = await db.setting.findFirst()

  if (!setting) {
    await db.setting.create({
      data: {
        cooldown: data.cooldown ?? config.cooldown,
        privatesServers: data.privatesServers ?? config.privatesServers,
        ownersServers: data.ownersServers ?? config.ownersServers,
        discordInviteUrl: data.discordInviteUrl ?? config.discordInviteUrl
      }
    })
  } else {
    setting = await db.setting.update({
      where: { id: setting.id },
      data: {
        cooldown: data.cooldown ?? setting.cooldown ?? config.cooldown,
        privatesServers: data.privatesServers ?? setting.privatesServers ?? config.privatesServers,
        ownersServers: data.ownersServers ?? setting.ownersServers ?? config.ownersServers,
        discordInviteUrl: data.discordInviteUrl ?? setting.discordInviteUrl ?? config.discordInviteUrl
      }
    })
  }
  globalThis.config = { ...config, ...setting }
}

export default db
