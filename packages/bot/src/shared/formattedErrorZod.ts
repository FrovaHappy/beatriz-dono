import type { ZodError } from 'zod'

export function formattedErrorZod(error: ZodError, rootPath = '') {
  const { errors } = error
  let errorMessage = ''
  for (const issue of errors) {
    const path = issue.path.map(p => (typeof p === 'number' ? `[${p}]` : p)).join('.')
    errorMessage += `- \`${rootPath}${path}\`: ${issue.message}\n`
  }
  return errorMessage
}
