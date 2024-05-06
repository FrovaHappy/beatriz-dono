export function stringToJson<T = any, G = null>(str: string, df: any = null): T | G {
  try {
    return JSON.parse(str)
  } catch (e) {
    if (df) return df
    return null as G
  }
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function objWithKeyValueEqual<T extends string | number | symbol>(OBJ: Record<string, unknown>) {
  const buttonKeys = Object.keys(OBJ) as T[]
  const obj: Partial<Record<T, T>> = {}
  for (const key of buttonKeys) {
    obj[key] = key
  }
  return obj as Record<T, T>
}
