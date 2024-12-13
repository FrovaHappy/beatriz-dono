import type { Filter } from 'src/schemas/schema.welcome.v1'

export function buildFilter(filter: Filter | undefined) {
  if (!filter) return ''
  const { dropShadow, blur, brightness, contrast, grayscale, hueRotate, invert, opacity, saturate, sepia } = filter
  let filterString = ''
  if (dropShadow) {
    filterString += `drop-shadow(${dropShadow.offsetX}px ${dropShadow.offsetY}px ${dropShadow.blurRadius}px ${dropShadow.color})`
  }
  if (blur) filterString += `blur(${blur}px)`
  if (brightness) filterString += `brightness(${brightness}%)`
  if (contrast) filterString += `contrast(${contrast}%)`
  if (grayscale) filterString += `grayscale(${grayscale}%)`
  if (hueRotate) filterString += `hue-rotate(${hueRotate}deg)`
  if (invert) filterString += `invert(${invert}%)`
  if (opacity) filterString += `opacity(${opacity}%)`
  if (saturate) filterString += `saturate(${saturate}%)`
  if (sepia) filterString += `sepia(${sepia}%)`
  return filterString
}
