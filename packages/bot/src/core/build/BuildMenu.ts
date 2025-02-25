import type { MessageOptions, Resolve, Scope } from '@/types/main'
import {
  type AnySelectMenuInteraction,
  type APISelectMenuDefaultValue,
  ChannelSelectMenuBuilder,
  type ChannelSelectMenuInteraction,
  type ComponentEmojiResolvable,
  type Locale,
  type PermissionResolvable,
  RoleSelectMenuBuilder,
  type RoleSelectMenuInteraction,
  type SelectMenuDefaultValueType,
  StringSelectMenuBuilder,
  type StringSelectMenuInteraction,
  UserSelectMenuBuilder,
  type UserSelectMenuInteraction
} from 'discord.js'
import { PERMISSIONS_BASE_BOT, PERMISSIONS_BASE_USER } from '../../const/PermissionsBase'
import baseMessage from './shared/baseMessage'
import { hasAccessForScope } from './shared/hasAccessForScope'
import isCooldownEnable, { parseTimestamp } from './shared/isCooldownEnable'
import messages from '@/messages'
import msgCaptureError from './msg.captureError'
import msgPermissionsUserRequired from './shared/msg.permissionsUserRequired'
import parsePermissions from './shared/parsePermissions'
import msgPermissionsBotRequired from './shared/msg.permissionsBotRequired'
import msgCooldownTimeout from './msg.cooldownTimeout'
import msgHasAccessToScope from './shared/msg.hasAccessToScope'

type StringSelectTranslate = {
  placeholder: string
  options: {
    value: string
    label: string
    description?: string
    emoji?: ComponentEmojiResolvable
  }[]
}
type UserSelectTranslate = {
  placeholder: string
  defaultValues?: APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>[]
}
type RoleSelectTranslate = {
  placeholder: string
  defaultValues?: APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>[]
}
type ChannelSelectTranslate = {
  placeholder: string
  defaultValues?: APISelectMenuDefaultValue<SelectMenuDefaultValueType.Channel>[]
}
export type SelectMenu = {
  string: {
    translate: StringSelectTranslate
    interaction: StringSelectMenuInteraction
    builder: StringSelectMenuBuilder
  }
  user: {
    translate: UserSelectTranslate
    interaction: UserSelectMenuInteraction
    builder: UserSelectMenuBuilder
  }
  role: {
    translate: RoleSelectTranslate
    interaction: RoleSelectMenuInteraction
    builder: RoleSelectMenuBuilder
  }
  channel: {
    translate: ChannelSelectTranslate
    interaction: ChannelSelectMenuInteraction
    builder: ChannelSelectMenuBuilder
  }
}
interface MenuConstructor<T extends keyof SelectMenu = 'string'> {
  cooldown?: BuildMenu<T>['cooldown']
  customId: BuildMenu<T>['customId']
  ephemeral?: BuildMenu<T>['ephemeral']
  maxValues?: BuildMenu<T>['maxValues']
  minValues?: BuildMenu<T>['minValues']
  permissionsBot: BuildMenu<T>['permissionsBot']
  permissionsUser: BuildMenu<T>['permissionsUser']
  scope: BuildMenu<T>['scope']
  translates: BuildMenu<T>['translates']
  typeData: BuildMenu<T>['typeData']
  resolve?: BuildMenu<T>['resolve']
  execute: BuildMenu<T>['execute']
}
class BuildMenu<T extends keyof SelectMenu = 'string'> {
  type = 'menus' as const
  customId: string
  ephemeral: boolean
  maxValues?: number
  minValues?: number
  permissionsBot: PermissionResolvable[]
  permissionsUser: PermissionResolvable[]
  typeData: 'string' | 'user' | 'role' | 'channel'
  cooldown: number
  translates: Partial<Record<Locale, SelectMenu[T]['translate']>> & { default: SelectMenu[T]['translate'] }
  scope: Scope
  resolve: Resolve
  execute: (e: SelectMenu[T]['interaction']) => Promise<MessageOptions | undefined>
  constructor(props: MenuConstructor<T>) {
    this.customId = props.customId
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? config.env.discord.cooldown
    this.resolve = props.resolve ?? 'defer'
    this.typeData = props.typeData
    this.ephemeral = props.ephemeral ?? false
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.permissionsUser = [...new Set([...PERMISSIONS_BASE_USER, ...(props.permissionsUser ?? [])])]
    this.translates = props.translates
    this.execute = props.execute
  }

  get(locale: Locale): SelectMenu[T]['builder'] {
    const { translates, customId, minValues, maxValues, typeData } = this
    const menuData = translates[locale] || translates.default

    if (typeData === 'string') {
      return new StringSelectMenuBuilder({ customId, minValues, maxValues, ...menuData })
    }
    if (typeData === 'user') {
      return new UserSelectMenuBuilder({ customId, minValues, maxValues, ...(menuData as UserSelectTranslate) })
    }
    if (typeData === 'role') {
      return new RoleSelectMenuBuilder({ customId, minValues, maxValues, ...(menuData as RoleSelectTranslate) })
    }
    if (typeData === 'channel') {
      return new ChannelSelectMenuBuilder({ customId, minValues, maxValues, ...(menuData as ChannelSelectTranslate) })
    }
    throw new Error(`typeData ${typeData} not found`)
  }
  static async runInteraction(i: AnySelectMenuInteraction) {
    const { customId, locale, guildId } = i
    const menu = globalThis.menus(customId)
    const bot = i.guild?.members.me ?? undefined
    const user = i.guild?.members.cache.get(i.user.id)

    if (!bot || !user || menu.customId === '' || !guildId) {
      return await i.reply({
        ...msgCaptureError.getMessage(locale, { '{{slot0}}': `BuildMenu ${customId}` }),
        ephemeral: true
      })
    }
    const keyId = `menu:${customId}`
    const hasCooldown = isCooldownEnable({
      id: user.id,
      cooldown: menu.cooldown,
      keyId
    })
    const controlAccess = {
      accessForScope: hasAccessForScope(menu.scope, guildId),
      accessForPermissionsBot: bot.permissions.has(menu.permissionsBot),
      accessForPermissionsUser: user.permissions.has(menu.permissionsUser),
      withoutCooldown: !hasCooldown
    }
    const messageControl = () => {
      if (!controlAccess.accessForPermissionsUser) {
        return msgPermissionsUserRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(user.permissions.toArray(), menu.permissionsUser)
        })
      }
      if (!controlAccess.accessForPermissionsBot) {
        return msgPermissionsBotRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(bot.permissions.toArray(), menu.permissionsBot)
        })
      }
      if (!controlAccess.withoutCooldown) {
        return msgCooldownTimeout.getMessage(locale, {
          '{{slot0}}': menu.cooldown.toString(),
          '{{slot1}}': parseTimestamp(keyId, user.id, menu.cooldown).toString()
        })
      }
      if (!controlAccess.accessForScope) return msgHasAccessToScope.getMessage(locale, { '{{slot0}}': menu.scope })
    }
    const getMessage = async () => {
      try {
        return await menu.execute(i as any)
      } catch (error) {
        console.error(error)
        return messages.errorInService(i.locale, `menu:${i.customId}-inExecute`)
      }
    }

    try {
      const controlDenied = messageControl()
      if (controlDenied) return await i.reply({ ...controlDenied, ephemeral: true })
      if (menu.resolve === 'update') await i.deferUpdate()
      if (menu.resolve === 'defer') await i.deferReply({ ephemeral: menu.ephemeral })
      const message = await getMessage()
      if (!message) return
      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return messages.errorInService(i.locale, `menu:${i.customId}-inReply`)
    }
  }
}

export type Menu = InstanceType<typeof BuildMenu>
export default BuildMenu
