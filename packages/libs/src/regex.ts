export const regexHexColor = /^#([a-f0-9]{6}|[a-f0-9]{3})$/
export const regexEmoji = /^<a?:([a-zA-Z0-9_]{2,32}):([0-9]{17,21})>$/
export const regexRole = /^[0-9]{5,30}$/
export const regexDispatch = /^([mxywhcvzsqtalMXYWHCVZSQTAL0-9 ,.-]+)$/
export const regexGuildId = /^[0-9]{10,20}$/

export const regexBuildUrlImage = (domains: string[]) => {
  return new RegExp(`^https?://${domains.join('|')}/\\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)$`)
}

export default {
  hexColor: regexHexColor,
  emoji: regexEmoji,
  role: regexRole,
  dispatch: regexDispatch,
  guildId: regexGuildId,
  buildUrlImage: regexBuildUrlImage
}
