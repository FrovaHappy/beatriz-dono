import { formattedErrorZod } from '@/shared/formattedErrorZod'
import { z, ZodError } from 'zod'
type Version = 'v1'
export const CURRENT_VERSION: Version = 'v1'
const v1 = z.array(z.object({ hexcolor: z.string().regex(/^#([a-f0-9]{6})$/), label: z.string() }).strict())
const schemaEditColorDefault = {
  v1: z
    .object({
      version: z.literal('v1').optional(),
      values: v1
    })
    .strict()
}

export type Colors<T extends Version = 'v1'> = z.infer<(typeof schemaEditColorDefault)[T]>
/**
 *
 * @param colors - an string with the json
 * @returns - if the json is valid return null, else return the error message with the reason
 */
export function validate(colors: string) {
  try {
    const json = JSON.parse(colors)

    schemaEditColorDefault[(json.version as Version) ?? CURRENT_VERSION].parse(json)
  } catch (error) {
    if (error instanceof ZodError) {
      return `Error en el json:\n${formattedErrorZod(error, 'JSON.')}`
    }
    return 'El json no es valido'
  }
}
