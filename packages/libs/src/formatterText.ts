import type { Guild, User } from './types'

type UserRules = '{{user_name}}' | '{{user_global}}' | '{{user_id}}' | '{{user_avatar}}' | '{{user_discriminator}}'
type ServerRules = '{{server_name}}' | '{{server_id}}' | '{{server_icon}}' | '{{server_banner}}' | '{{server_count}}'
type Slot = `{{slot${number}}}`

export type Rules = Record<UserRules, string> & Record<Slot, string> & Record<ServerRules, string>

export function formatterTextUser(strToFormat: string, param: User & Guild): string {
  return formatterText(strToFormat, {
    '{{user_name}}': param.userName,
    '{{user_global}}': param.userDisplayName,
    '{{user_id}}': param.userId,
    '{{user_avatar}}': param.userAvatar,
    '{{user_discriminator}}': param.userDiscriminator,
    '{{server_banner}}': param.guildBanner ?? '',
    '{{server_icon}}': param.guildAvatar,
    '{{server_name}}': param.guildName,
    '{{server_count}}': param.membersCount,
    '{{server_id}}': param.guildId
  })
}

export default function formatterText(strToFormat: string, formats: Partial<Rules>): string {
  let str = strToFormat
  const formatsKeys = Object.keys(formats) as Array<keyof Rules>
  for (const fk of formatsKeys) {
    str = str.replaceAll(fk, formats[fk] ?? '')
  }
  // Formatting strings with Rules requires
  const rulesRequired = {
    '\\n': '\n',
    '\\t': '\t',
    '\\r': '\r'
  }
  const rulesReqKeys = Object.keys(rulesRequired) as Array<keyof typeof rulesRequired>
  for (const rrk of rulesReqKeys) {
    str = str.replaceAll(rrk, rulesRequired[rrk])
  }
  return str
}
