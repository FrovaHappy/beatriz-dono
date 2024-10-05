import type { ButtonNames } from '@/const/interactionsNames'
import type { MessageOptions, Resolve, Scope } from '@/types/main'
import { type ButtonBuilder, type ButtonInteraction, ButtonStyle, type PermissionResolvable } from 'discord.js'
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import hasAccessForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import messageErrorFoundService from '@/services/colors/shared/message.errorFoundService'
import baseMessage from './shared/baseMessage'
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
  name: ButtonNames
  scope: Scope
  ephemeral: boolean
  permissions: PermissionResolvable[]
  cooldown: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction) => Promise<MessageOptions | undefined>
  resolve: Resolve
  isLink = false
  constructor(props: Partial<BuildButton> & Pick<BuildButton, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.isLink = props.isLink ?? false
    this.type = this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.resolve = props.resolve ?? 'defer'
    this.cooldown = props.cooldown ?? config.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = !this.isLink ? props.data.setCustomId(this.name) : props.data
    this.execute = props.execute
  }

  static async runInteraction(i: ButtonInteraction) {
    const button: BuildButton = globalThis.buttons.get(i.customId)
    if (!button) return messageErrorFoundService(i.locale, `button:${i.customId}`)
    const messageRequirePermissions = requiresBotPermissions({
      permissions: button.permissions,
      bot: i.guild?.members.me,
      nameInteraction: i.customId,
      type: 'button',
      locale: i.locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: button.cooldown,
      name: button.name,
      type: 'button',
      locale: i.locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, button.scope, i.guildId ?? '')
    const getMessage = async () => {
      if (messageRequirePermissions) return messageRequirePermissions
      if (messageCooldown) return messageCooldown
      if (messageAccessForScope) return messageAccessForScope
      try {
        return await button.execute(i)
      } catch (error) {
        console.error(error)
        return { content: `Error executing ${button.name}` }
      }
    }

    try {
      if (button.resolve === 'defer') await i.deferReply({ ephemeral: button.ephemeral })
      if (button.resolve === 'update') await i.deferUpdate()
      const message = await getMessage()
      if (!message) return

      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${button.name}` }
    }
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
