import { PrismaClient } from '@prisma/client'
import './resolvePaths'
import './config'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy } from 'passport-discord'
import cors from 'cors'

const db = new PrismaClient()
const urlCallbackDiscord = '/auth0/discord/callback'
const discordStrategy = new Strategy(
  {
    clientID: config.discordClient,
    clientSecret: config.discordClientSecret,
    callbackURL: urlCallbackDiscord,
    scope: ['identify', 'guilds']
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('callback function', profile.id)

    done(null, { id: profile.id, username: profile.username, avatar: profile.avatar })
  }
)
const app = express()
app.use(cors({ origin: config.urlClientDomain, credentials: true }))
app.use(
  session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: false,
      maxAge: config.oneDay,
      secure: app.get('env') === 'production'
    }
  })
)

passport.use(discordStrategy)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  if (user) done(null, user)
  else done(null, undefined)
})
app.use(express.json())
app.get(
  urlCallbackDiscord,
  (req, res, next) => {
    console.log(urlCallbackDiscord)
    next()
  },
  passport.authenticate('discord', {
    failureRedirect: config.urlClientDomain,
    successRedirect: config.urlClientDomain
  })
)
app.get('/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({ data: null, message: 'No user logged in', ok: false })
    return
  }
  console.log(req.body.cookie, req.cookies, req.user)
  const user = req.user as any
  res.json({ data: { avatar: user.avatar, username: user.username, id: user.id }, message: 'User logged in', ok: true })
})
app.get('/logout', async (req, res) => {
  req.logOut(err => {
    if (err) return
    res.redirect(config.urlClientDomain)
  })
})
app.listen(8080, () => {
  console.log('Server is running on port 8080')
})
