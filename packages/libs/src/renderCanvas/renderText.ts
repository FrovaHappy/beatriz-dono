import type { Base, Text, TextBase, User } from '@type/Canvas'
import formatterText from '../formatterText'

export function renderText(text: Text, ctx: CanvasRenderingContext2D, user: User, base: Base & TextBase) {
  const { x, y, size, family, weight, limitLetters, content, align, baseline, color } = text
  let textContent = formatterText(content, {
    userCount: user.count,
    userGlobal: user.globalName,
    userName: user.username,
    userId: user.id
  })
  ctx.save()
  ctx.font = `${weight} ${size}px ${family}`
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.fillStyle = color ?? 'transparent'

  let lengthLetters = ctx.measureText(textContent)
  if (limitLetters > 0) {
    while (limitLetters < lengthLetters.width) {
      textContent = textContent.slice(0, -1)
      lengthLetters = ctx.measureText(textContent)
    }
  }

  ctx.fillText(textContent, x, y)
  ctx.restore()
}
