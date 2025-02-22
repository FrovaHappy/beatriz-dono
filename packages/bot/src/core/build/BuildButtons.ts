import type { MessageOptions, Resolve, Scope } from '@/types/main'
import {
  ButtonBuilder,
  type ButtonInteraction,
  type ButtonStyle,
  type ComponentEmojiResolvable,
  type Locale,
  type PermissionResolvable
} from 'discord.js'
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

interface ButtonData {
  name: string
  emoji?: ComponentEmojiResolvable
}
class BuildButton {
  type = 'buttons'
  scope: Scope
  ephemeral: boolean
  permissionsBot: PermissionResolvable[]
  permissionsUser: PermissionResolvable[]
  style: ButtonStyle
  url: string | undefined
  cooldown: number
  customId: string
  translates: Partial<Record<Locale, ButtonData>> & { default: ButtonData }
  execute: (e: ButtonInteraction) => Promise<MessageOptions | undefined>
  resolve: Resolve | 'showModal'
  constructor(
    props: Partial<BuildButton> &
      Pick<
        BuildButton,
        'execute' | 'scope' | 'customId' | 'translates' | 'permissionsBot' | 'permissionsUser' | 'resolve' | 'style'
      >
  ) {
    this.url = props.url
    this.customId = props.customId
    this.scope = props.scope
    this.resolve = props.resolve ?? 'defer'
    this.style = props.style
    this.cooldown = props.cooldown ?? config.env.discord.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.permissionsUser = [...new Set([...PERMISSIONS_BASE_USER, ...(props.permissionsUser ?? [])])]
    this.translates = props.translates
    this.execute = props.execute
  }

  get = (locale: Locale) => {
    const { translates, customId, url } = this
    const buttonData = translates[locale] ?? translates.default
    const button = new ButtonBuilder().setCustomId(customId).setLabel(buttonData.name).setStyle(this.style)
    if (buttonData.emoji) button.setEmoji(buttonData.emoji)
    if (url) button.setURL(url)
    return button
  }

  static async runInteraction(i: ButtonInteraction) {
    const { customId, locale } = i
    const button: BuildButton = buttons(customId)
    const bot = i.guild?.members.me
    const user = i.guild?.members.cache.get(i.user.id)
    if (!bot || !user)
      return await i.reply({
        ...messages.errorInService(locale, `button:${customId}-guildMemberNotFound`),
        ephemeral: true
      })
    if (!button) return await i.reply(messages.serviceNotFound(locale, `button:${customId}`))
    if (button.url) return
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
      name: button.customId,
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
