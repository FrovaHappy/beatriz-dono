import errorInService from './_errorInService'
import guildIdNoFound from './_guildIdNoFound'
import serviceNotFound from './_serviceNotFound'

import cooldownEnable from './_cooldownEnable'
import { errorPermissions } from './_errorPermissions'
import aboutMe from './aboutMe'
import colors from './colors'

export const messagesColors = colors
export const messagesAboutMe = aboutMe

export default {
  errorInService,
  guildIdNoFound,
  serviceNotFound,
  errorPermissions,
  cooldownEnable
}
