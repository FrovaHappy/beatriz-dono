import errorInService from './_errorInService'
import guildIdNoFound from './_guildIdNoFound'
import accessDeniedForScope from './_accessDeniedForScope'
import serviceNotFound from './_serviceNotFound'

import colors from './colors'
import { errorPermissions } from './_errorPermissions'
import cooldownEnable from './_cooldownEnable'
import aboutMe from './aboutMe'

export const messagesColors = colors
export const messagesAboutMe = aboutMe

export default {
  errorInService,
  guildIdNoFound,
  accessDeniedForScope,
  serviceNotFound,
  errorPermissions,
  cooldownEnable
}