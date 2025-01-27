import { exit } from 'node:process'
import { z } from 'zod'

export default function getPublic(string: string) {
  try {
    console.log(string)
    const data = JSON.parse(string)
    return z
      .object({
        urlApi: z.string(),
        urlDiscord: z.string(),
        urlOathCallback: z.string(),
        urlGithub: z.string(),
        urlDonate: z.object({
          kofi: z.string()
        })
      })
      .parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues)
      exit(1)
    }
    throw error
  }
}
