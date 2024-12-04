import { Router } from 'express'
import { getUser } from '../controllers/user'
import session from '../controllers/session'
import getSetting, { validateGetSetting } from '../controllers/guild/getSetting'
import postSetting, { validatePostSetting } from '../controllers/guild/postSetting'
import isAuthenticated from '../shared/isAuthenticated'
import validateZod from '../shared/validateZod'

const router = Router()
router.use(session)

// User endpoints
router.get('/user', isAuthenticated, getUser)
router.get('/guild/setting/:guildId', isAuthenticated, validateZod(validateGetSetting), getSetting)
router.post('/guild/setting', isAuthenticated, validateZod(validatePostSetting), postSetting)

export default router