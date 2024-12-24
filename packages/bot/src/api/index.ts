import express from 'express'
import session from 'express-session'
import cors from 'cors'
import passport from 'passport'
import routers from './routes'
import discordStrategy from './discordStrategy'
import { rateLimit } from 'express-rate-limit'
const app = express()

export default async function startApi() {
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
        secure: config.isProduction
      }
    })
  )
  app.use(rateLimit({ windowMs: config.middleMinutes, max: 100, legacyHeaders: false }))
  app.use(express.json())

  // Passport config
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

  // Routes
  app.use(routers)

  app.use((req, res) => {
    res.status(404).json({ data: null, message: 'Route not found', ok: false })
  })

  app.listen(config.portApi, () => {
    console.log(`Server is running on port ${config.portApi}`)
  })
}
