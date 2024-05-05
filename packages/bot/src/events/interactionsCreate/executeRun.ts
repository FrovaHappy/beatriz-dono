import { type Interaction, type InteractionEditReplyOptions, type Locale } from 'discord.js'
import isCooldownEnable from '@core/shared/isCooldownEnable'
import createServerDb from '@core/shared/createServerDb'
import filterOwnerCommands from './filterOwnerCommands'
import isPermissionDeniedBot from './isPermissionDeniedBot'
import getI18n from '../../i18n'
import { type Types, type EventEmitted } from '@/types/main'

interface InteractionFunction {
  deferReply: () => Promise<void>
  editReply: (options: InteractionEditReplyOptions) => Promise<void>
}
interface Props {
  customNameEmitted: string
  type: Types
  locale: Locale
  interaction: Interaction
}

async function BuildMessage(props: Props): Promise<InteractionEditReplyOptions> {
  const { customNameEmitted, locale, interaction, type } = props
  const i18n = getI18n(locale)
  const instanceEvent: EventEmitted<string> = globalThis[type].get(customNameEmitted)
  const { cooldown, name, permissions, scope, execute } = instanceEvent

  const messagePermissionDenied = await isPermissionDeniedBot({
    i: interaction,
    i18n,
    customNameEmitted,
    permissions
  })
  if (messagePermissionDenied) return messagePermissionDenied

  const passFilter = filterOwnerCommands(scope, interaction.user.id)
  if (!passFilter) return { content: 'only Owner has access to this.. >:(' }

  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable({ id: interaction.user.id, cooldown, name, type })
  if (messageCooldown) return { content: messageCooldown }

  try {
    return await execute(interaction, i18n)
  } catch (error) {
    console.error(`Error executing ${type}/${customNameEmitted}`)
    console.error(error)
    return { content: `Error executing ${type}/${customNameEmitted}` }
  }
}
export default async function executeRun(props: Props & InteractionFunction): Promise<void> {
  const { customNameEmitted, deferReply, editReply, interaction, locale, type } = props
  await deferReply()
  await editReply(
    await BuildMessage({
      customNameEmitted,
      interaction,
      locale,
      type
    })
  )
}
