import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import session from 'express-session'
import passport from 'passport'
import discordStrategy from './discordStrategy'
import routers from './routes'
const app = express()

export default async function startApi() {
  app.use(cors({ origin: config.env.api.urlClientDomain, credentials: true }))
  app.use(
    session({
      secret: config.env.api.secretKey,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        httpOnly: false,
        maxAge: config.utils.oneDay,
        secure: config.utils.isProduction
      }
    })
  )
  app.use(rateLimit({ windowMs: config.utils.middleMinutes, max: 100, legacyHeaders: false }))
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

  app.listen(config.env.port, () => {
    console.log(`Server is running on port ${config.env.port}`)
  })
}
