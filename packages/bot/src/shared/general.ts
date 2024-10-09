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

/**
 * Separate a string by a separator
 * @param tuple is a tuple of key and object were the key is the key of the object
 * @param selectValue this select the value of the object. Ej: title select [tuple.object].title
 * @returns return a new object with the tuple.key as key and the selectValue as value.
 */
export function reduceTupleToObj(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  tuple: [key: string, object: Record<string, any>][],
  selectValue: string
): Record<string, string> {
  const separe = selectValue.split('.')

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const recoveryKey = (ob: any, i = 0) => {
    const value = ob[separe[i]]
    const nextKey = separe[i + 1]
    if (nextKey) return recoveryKey(value, i + 1)
    return value
  }

  return tuple.reduce<Record<string, string>>((acc, elem) => {
    const [k, obj] = elem
    acc[k] = recoveryKey(obj)
    console.log(acc)
    return acc
  }, {})
}
