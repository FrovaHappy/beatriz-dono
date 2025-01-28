import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get(
  config.env.discord.oAuthCallback,
  passport.authenticate('discord', {
    failureRedirect: config.env.api.urlClientDomain,
    successRedirect: config.env.api.urlClientDomain
  })
)
router.get('/logout', async (req, res) => {
  req.logOut(err => {
    if (err) return
    res.redirect(config.env.api.urlClientDomain)
  })
})

export default router
