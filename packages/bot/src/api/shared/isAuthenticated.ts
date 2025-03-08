import type { NextFunction, Request, Response } from 'express'

export default function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.json({ data: null, message: 'No user logged in', ok: false })
    return
  }
  next()
}
