export function jsonParse<T = any>(str: string | null) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return JSON.parse(str!) as T
  } catch (error) {
    return null
  }
}
export function jsonClone<T = any>(str: any) {
  try {
    return JSON.parse(JSON.stringify(str)) as T
  } catch (error) {
    return null
  }
}
