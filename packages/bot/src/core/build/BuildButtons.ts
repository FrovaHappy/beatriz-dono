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
import isCooldownEnable, { parseTimestamp } from './shared/isCooldownEnable'
import messages from '@/messages'
import { hasAccessForScope } from './shared/hasAccessForScope'
import msgCaptureError from './msg.captureError'
import msgPermissionsBotRequired from './shared/msg.permissionsBotRequired'
import parsePermissions from './shared/parsePermissions'
import msgPermissionsUserRequired from './shared/msg.permissionsUserRequired'
import msgHasAccessToScope from './shared/msg.hasAccessToScope'
import msgCooldownTimeout from './msg.cooldownTimeout'

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
    const button: BuildButton = buttons(customId, true)
    const bot = i.guild?.members.me
    const user = i.guild?.members.cache.get(i.user.id)
    const guildId = i.guildId
    if (!bot || !user || button.customId === '' || !guildId) {
      return await i.reply({
        ...msgCaptureError.getMessage(locale, { '{{slot0}}': `BuildButton ${customId}` }),
        ephemeral: true
      })
    }
    if (button.url) return
    const keyId = `button:${customId}`
    const hasCooldown = isCooldownEnable({
      id: user.id,
      cooldown: button.cooldown,
      keyId
    })
    const controlAccess = {
      accessForScope: hasAccessForScope(button.scope, guildId),
      accessForPermissionsBot: bot.permissions.has(button.permissionsBot),
      accessForPermissionsUser: user.permissions.has(button.permissionsUser),
      withoutCooldown: !hasCooldown
    }
    const messageControl = () => {
      if (!controlAccess.accessForPermissionsUser) {
        return msgPermissionsUserRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(user.permissions.toArray(), button.permissionsUser)
        })
      }
      if (!controlAccess.accessForPermissionsBot) {
        return msgPermissionsBotRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(bot.permissions.toArray(), button.permissionsBot)
        })
      }
      if (!controlAccess.withoutCooldown) {
        return msgCooldownTimeout.getMessage(locale, {
          '{{slot0}}': button.cooldown.toString(),
          '{{slot1}}': parseTimestamp(keyId, user.id, button.cooldown).toString()
        })
      }
      if (!controlAccess.accessForScope) return msgHasAccessToScope.getMessage(locale, { '{{slot0}}': button.scope })
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
      const controlDenied = messageControl()
      if (controlDenied) return await i.reply({ ...controlDenied, ephemeral: true })
      if (button.resolve === 'showModal') return getMessage()
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
