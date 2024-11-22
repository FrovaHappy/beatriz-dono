import getI18n, { type I18ns } from '@/shared/getI18n'
import formatterText from '@libs/formatterText'
import { Colors, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
}
const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Access Denied',
    description:
      'It seems you do not have access to this {{slot0}}. Please contact the owner bot for access to this feature.'
  },
  'es-ES': {
    title: 'Acceso denegado',
    description:
      'Parece que no tienes acceso a este {{slot0}}. Por favor, contacta al bot de propietario para tener acceso a esta funcionalidad.'
  }
}
interface AccessDeniedForScopeProps {
  locale: Locale
  scope: string
}
export default function accessDeniedForScope(props: AccessDeniedForScopeProps) {
  const { locale, scope } = props
  const i18n = getI18n(locale, i18ns)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, { '{{slot0}}': scope }),
        color: Colors.Red
      }
    ]
  }
}
