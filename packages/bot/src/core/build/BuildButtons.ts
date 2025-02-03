import type { ButtonNames } from '@/const/interactionsNames'
import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type { ButtonBuilder, ButtonInteraction, PermissionResolvable } from 'discord.js'
import { PERMISSIONS_BASE_BOT, PERMISSIONS_BASE_USER } from '../../const/PermissionsBase'
import baseMessage from './shared/baseMessage'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'
import requiresUserPermissions from './shared/requiresUserPermissions'
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 * * `permissions`: The permissions that the bot needs to run the command.
 * * `resolve`: The resolve of the interaction, can be `reply`, `defer` or `update`.
 *   - `reply`: Sends a new message reply, use this mode when you create the modal and do not return anything.
 *   - `defer`: Sends a new async message reply. (incompatible with Modals)
 *   - `update`: The interaction will be updated. (incompatible with Modals)
 */
class BuildButton {
  type = 'buttons'
  name: ButtonNames | string
  scope: Scope
  ephemeral: boolean
  permissionsBot: PermissionResolvable[]
  permissionsUser: PermissionResolvable[]
  cooldown: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction) => Promise<MessageOptions | undefined>
  resolve: Resolve | 'showModal'
  isLink = false
  constructor(props: Partial<BuildButton> & Pick<BuildButton, 'name' | 'execute' | 'data' | 'scope'>) {
    this.isLink = props.isLink ?? false
    this.type = this.name = props.name
    this.scope = props.scope
    this.resolve = props.resolve ?? 'defer'
    this.cooldown = props.cooldown ?? config.env.discord.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.permissionsUser = [...new Set([...PERMISSIONS_BASE_USER, ...(props.permissionsUser ?? [])])]
    this.data = !this.isLink ? props.data.setCustomId(this.name) : props.data
    this.execute = props.execute
  }

  static async runInteraction(i: ButtonInteraction) {
    const { customId, locale } = i
    const button: BuildButton = buttons.get(customId)
    const bot = i.guild?.members.me
    const user = i.guild?.members.cache.get(i.user.id)
    if (!bot || !user)
      return await i.reply({
        ...messages.errorInService(locale, `button:${customId}-guildMemberNotFound`),
        ephemeral: true
      })
    if (!button) return await i.reply(messages.serviceNotFound(locale, `button:${customId}`))
    const messageRequirePermissions = requiresBotPermissions({
      permissions: button.permissionsBot,
      bot,
      type: 'button',
      locale
    })
    const messageRequirePermissionsUser = requiresUserPermissions({
      permissions: button.permissionsUser,
      user,
      type: 'button',
      locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: button.cooldown,
      name: button.name,
      type: 'button',
      locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, button.scope, i.guildId ?? '')
    const controlAccess = () => {
      if (messageRequirePermissionsUser) return messageRequirePermissionsUser
      if (messageRequirePermissions) return messageRequirePermissions
      if (messageCooldown) return messageCooldown
      if (messageAccessForScope) return messageAccessForScope
    }
    const getMessage = async () => {
      try {
        return await button.execute(i)
      } catch (error) {
        console.error(error)
        return messages.errorInService(i.locale, `button:${i.customId}-inExecute`)
      }
    }

    try {
      const controlDenied = controlAccess()
      if (controlDenied) return await i.reply({ ...controlDenied, ephemeral: true })
      if (button.resolve === 'defer') await i.deferReply({ ephemeral: button.ephemeral })
      if (button.resolve === 'update') await i.deferUpdate()
      const message = await getMessage()
      if (!message) return

      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return messages.errorInService(i.locale, `button:${i.customId}-inReply`)
    }
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
