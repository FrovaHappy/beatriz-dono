export function stringToJson<T = any, G = null>(str: string, df: any = null): T | G {
  try {
    return JSON.parse(str)
  } catch (e) {
    if (df) return df
    return null as G
  }
}
