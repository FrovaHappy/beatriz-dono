import { Router } from 'express'
import { getUser } from '../controllers/user'
import session from '../controllers/session'
import getGuild from '../controllers/user/guild/getGuild'

const router = Router()
router.use(session)

// User endpoints
router.get('/user', getUser)
router.get('/user/guild/:guildId', getGuild)

export default router