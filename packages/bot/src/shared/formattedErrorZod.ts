import type { z } from 'zod'

export function formattedErrorZod(error: z.ZodError['errors'] | undefined, rootPath = '') {
  if (!error) return 'an exception occurred'
  let errorMessage = ''
  for (const issue of error) {
    const path = issue.path.map(p => (typeof p === 'number' ? `[${p}]` : p)).join('.')
    errorMessage += `- \`${rootPath}${path}\`: ${issue.message}\n`
  }
  return errorMessage
}
