import {
  type InteractionReplyOptions,
  type Interaction,
  type InteractionEditReplyOptions,
  type Locale
} from 'discord.js'
import isCooldownEnable from '@core/shared/isCooldownEnable'
import createServerDb from '@core/shared/createServerDb'
import filterOwnerCommands from './filterOwnerCommands'
import isPermissionDeniedBot from './isPermissionDeniedBot'
import { type Types, type EventEmitted } from '@/types/main'

interface InteractionFunction {
  deferReply: (options: { ephemeral: boolean }) => Promise<void>
  editReply: (options: InteractionEditReplyOptions) => Promise<void>
  reply: (options: InteractionReplyOptions) => Promise<void>
}
interface Props {
  customNameEmitted: string
  type: Types
  locale: Locale
  interaction: Interaction
}
interface EventInteraction {
  eventInteraction: EventEmitted<string>
}
async function BuildMessage(props: Props & EventInteraction): Promise<InteractionEditReplyOptions | undefined> {
  const { customNameEmitted, interaction, type, eventInteraction } = props
  const { cooldown, name, permissions, scope, execute } = eventInteraction

  const messagePermissionDenied = await isPermissionDeniedBot({
    i: interaction,
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
    return await execute(interaction)
  } catch (error) {
    console.error(`Error executing ${type}/${customNameEmitted}`)
    console.error(error)
    return { content: `Error executing ${type}/${customNameEmitted}` }
  }
}
export default async function executeRun(props: Props & InteractionFunction): Promise<unknown> {
  const { customNameEmitted, deferReply, editReply, reply, interaction, locale, type } = props
  const eventInteraction: EventEmitted<string> = globalThis[type].get(customNameEmitted)
  const { defer, ephemeral } = eventInteraction

  if (defer) await deferReply({ ephemeral })

  const message = await BuildMessage({
    customNameEmitted,
    interaction,
    locale,
    type,
    eventInteraction
  })
  if (!message) return
  if (defer) {
    await editReply(message)
    return
  }
  await reply({ ...(message as InteractionReplyOptions), ephemeral })
}
