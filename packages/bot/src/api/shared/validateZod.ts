import z, { type ZodAny } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export interface ValidateZodProps {
  body?: z.ZodTypeAny
  query?: z.ZodTypeAny
  params?: z.ZodTypeAny
}

export default function validateZod(props: ValidateZodProps) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      z.object({ ...props }).parse(req)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { errors } = error
        return res.json({ data: errors, message: 'Invalid data', ok: false })
      }
    }
    next()
  }
}
