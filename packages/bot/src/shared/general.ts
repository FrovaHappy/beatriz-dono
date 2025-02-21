export function stringToJson<T = any>(str: string | undefined | null): T | null {
  try {
    if (!str) return null
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}
