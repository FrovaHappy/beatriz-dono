import { exit } from 'node:process'
import { z } from 'zod'

const schema = z.object({
  urlApi: z.string(),
  urlDiscord: z.string(),
  urlOathCallback: z.string(),
  urlGithub: z.string(),
  urlJoinBot: z.string(),
  urlDonate: z.object({
    kofi: z.string()
  })
})

export type EnvPublic = z.infer<typeof schema>
export default function getPublic(string: string) {
  try {
    const data = JSON.parse(string)
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues)
      exit(1)
    }
    throw error
  }
}
