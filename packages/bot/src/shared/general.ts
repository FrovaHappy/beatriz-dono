export function toJson<T = any>(str: any, limitOfRecursion = 1000): T | null {
  if (!str) return null
  let limit = limitOfRecursion
  return JSON.parse(str, (k, v) => {
    try {
      if (limit === 0) return v
      limit--
      return JSON.parse(v)
    } catch (error) {
      return v
    }
  })
}
