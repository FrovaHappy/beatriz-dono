import type { z } from 'zod'
/**
 *
 * @param error
 * @param rootPath
 * @returns returns a string with the error message formatted
 * example:
 * ```
 * `
 *  - \`[0].name\`: "name" is required
 *  - \`[0].name\`: "name" must be a string
 *  - \`[0].name\`: "name" must be at least 1 character long
 * `
 * ```
 */
export function formattedErrorZod(error: z.ZodError['errors'] | undefined, rootPath = '') {
  if (!error) return 'an exception occurred'
  let errorMessage = ''
  for (const issue of error) {
    const path = issue.path.map(p => (typeof p === 'number' ? `[${p}]` : p)).join('.')
    errorMessage += `- \`${rootPath}${path}\`: ${issue.message}\n`
  }
  return errorMessage
}
