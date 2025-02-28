export const regexHexColor = /^#([a-f0-9]{6})$/
export const regexEmoji = /^<a?:([a-zA-Z0-9_]{2,32}):([0-9]{17,21})>$/
export const regexRole = /^[0-9]{5,30}$/

export default {
  hexColor: regexHexColor,
  emoji: regexEmoji,
  role: regexRole
}
