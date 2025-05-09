import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get(config.env.discord.oAuthCallback, (req, res, next) => {
  try {
    return passport.authenticate('discord', {
      failureRedirect: config.env.api.urlClientDomain,
      successRedirect: config.env.api.urlClientDomain
    })
  } catch (err: any) {
    console.log({
      err,
      message: 'Error in passport.authenticate',
      url: config.env.discord.oAuthCallback
    })
    return res.status(500).json({ data: null, message: err.message, ok: false })
  }
})
router.get('/logout', async (req, res) => {
  req.logOut(err => {
    if (err) return
    res.redirect(config.env.api.urlClientDomain)
  })
})

export default router
