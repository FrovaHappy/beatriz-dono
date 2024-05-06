import { array, number, object, string } from 'zod'
import db from './db'
import { stringToJson } from '../shared/general'
import config from './config'

const settingSchema = object({
  privatesServers: array(string()),
  ownersServers: array(string()),
  discordInviteUrl: string().url(),
  cooldown: number().min(0).int()
})

type Setting = Zod.infer<typeof settingSchema>
let setting: Setting | null = null
let forDelete: string[] = []

export function clearForDelete(): void {
  forDelete = []
}

export function getForDelete(): typeof forDelete {
  return forDelete
}

/** IMPORTANT: run upsertSetting beforehand */
export function getSetting(): Setting {
  if (!setting) throw new Error('run upsertSetting beforehand')
  return setting
}

export async function upsertSetting(data: Partial<Setting>): Promise<void> {
  const sDb = await db.setting.findFirst()
  const sEnv = stringToJson<Setting, Partial<Setting>>(config.setting ?? '{}')

  const sDbUnion = [...(sDb?.ownersServers ?? []), ...(sDb?.privatesServers ?? [])]
  const sEnvUnion = [...(sEnv?.ownersServers ?? []), ...(sEnv?.privatesServers ?? [])]
  forDelete = [...new Set([...sDbUnion, ...sEnvUnion])]

  if (!sDb) {
    settingSchema.parse(sEnv)
    setting = sEnv as Setting
    await db.setting.create({ data: setting })
    return
  }
  setting = sDb
  await db.setting.update({ where: { id: sDb.id }, data })
}
