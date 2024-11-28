import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get(
  config.urlOathCallback,
  passport.authenticate('discord', { failureRedirect: config.urlClientDomain, successRedirect: config.urlClientDomain })
)
router.get('/logout', async (req, res) => {
  req.logOut(err => {
    if (err) return
    res.redirect(config.urlClientDomain)
  })
})

export default router
