import type { Filter } from './schema.welcome.v1'

export function buildFilter(filter: Filter | undefined) {
  if (!filter) return undefined
  const { dropShadow, blur, brightness, contrast, grayscale, hueRotate, invert, opacity, saturate, sepia } = filter
  const filterString = []
  if (dropShadow) {
    filterString.push(
      `drop-shadow(${dropShadow.offsetX}px ${dropShadow.offsetY}px ${dropShadow.blurRadius}px ${dropShadow.color})`
    )
  }
  if (blur) filterString.push(`blur(${blur}px)`)
  if (brightness) filterString.push(`brightness(${brightness}%)`)
  if (contrast) filterString.push(`contrast(${contrast}%)`)
  if (grayscale) filterString.push(`grayscale(${grayscale}%)`)
  if (hueRotate) filterString.push(`hue-rotate(${hueRotate}deg)`)
  if (invert) filterString.push(`invert(${invert}%)`)
  if (opacity) filterString.push(`opacity(${opacity}%)`)
  if (saturate) filterString.push(`saturate(${saturate}%)`)
  if (sepia) filterString.push(`sepia(${sepia}%)`)
  return filterString.join(' ') || undefined
}
