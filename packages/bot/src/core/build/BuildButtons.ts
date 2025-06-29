import type { MessageOptions, Resolve, Scope } from '@/types/main'
import {
  ButtonBuilder,
  type ButtonInteraction,
  type ButtonStyle,
  type ComponentEmojiResolvable,
  type Locale,
  type PermissionResolvable,
  MessageFlags
} from 'discord.js'
import { PERMISSIONS_BASE_BOT, PERMISSIONS_BASE_USER } from '../../const/PermissionsBase'
import msgCaptureError from './msg.captureError'
import msgCooldownTimeout from './msg.cooldownTimeout'
import msgLoading from './msg.loading'
import baseMessage from './shared/baseMessage'
import { hasAccessForScope } from './shared/hasAccessForScope'
import isCooldownEnable, { parseTimestamp } from './shared/isCooldownEnable'
import msgHasAccessToScope from './shared/msg.hasAccessToScope'
import msgPermissionsBotRequired from './shared/msg.permissionsBotRequired'
import msgPermissionsUserRequired from './shared/msg.permissionsUserRequired'
import parsePermissions from './shared/parsePermissions'

interface ButtonData {
  name: string
  emoji?: ComponentEmojiResolvable
}
interface ButtonConstructor {
  customId: ButtonData['name']
  execute: BuildButton['execute']
  permissionsBot: BuildButton['permissionsBot']
  permissionsUser: BuildButton['permissionsUser']
  scope: BuildButton['scope']
  style: BuildButton['style']
  translates: BuildButton['translates']
  resolve?: BuildButton['resolve']
  ephemeral?: BuildButton['ephemeral']
  url?: BuildButton['url']
  cooldown?: BuildButton['cooldown']
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
  constructor(props: ButtonConstructor) {
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
    const button = new ButtonBuilder().setLabel(buttonData.name).setStyle(this.style)
    if (buttonData.emoji) button.setEmoji(buttonData.emoji)
    url ? button.setURL(url) : button.setCustomId(customId)
    return button
  }

  static async runInteraction(i: ButtonInteraction) {
    const { customId, locale } = i
    const button: BuildButton = buttons(customId)
    const bot = i.guild?.members.me
    const user = i.guild?.members.cache.get(i.user.id)
    const guildId = i.guildId
    if (!bot || !user || button.customId === '' || button.customId === 'modal-' || !guildId) {
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

    try {
      const controlDenied = messageControl()
      if (controlDenied) return await i.reply({ ...controlDenied, flags: [MessageFlags.Ephemeral] })
      if (button.resolve === 'showModal') return button.execute(i)
      if (button.resolve === 'defer') await i.deferReply({ flags: [MessageFlags.Ephemeral] })
      if (button.resolve === 'update') {
        const iUpdate = await i.update({
          ...baseMessage,
          ...msgLoading.getMessage(locale, {})
        })
        const message = await button.execute(i)
        if (!message) return
        return await iUpdate.edit({ ...baseMessage, ...message })
      }
      const message = await button.execute(i)
      if (!message) return

      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return msgCaptureError.getMessage(i.locale, { '{{slot0}}': `BuildButton ${i.customId} -> inReply` })
    }
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
