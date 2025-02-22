import type { MessageOptions, Resolve, Scope } from '@/types/main'
import {
  type AnySelectMenuInteraction,
  type APISelectMenuDefaultValue,
  ChannelSelectMenuBuilder,
  type ChannelSelectMenuInteraction,
  type ComponentEmojiResolvable,
  type Locale,
  type MentionableSelectMenuInteraction,
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
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'
import requiresUserPermissions from './shared/requiresUserPermissions'

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
  constructor(
    props: Partial<BuildMenu<T>> &
      Pick<
        BuildMenu<T>,
        'execute' | 'customId' | 'translates' | 'resolve' | 'permissionsBot' | 'permissionsUser' | 'typeData'
      >
  ) {
    this.customId = props.customId
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? config.env.discord.cooldown
    this.resolve = props.resolve
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
    const { customId, locale } = i
    const menu = globalThis.menus(customId, true)
    const bot = i.guild?.members.me ?? undefined
    const user = i.guild?.members.cache.get(i.user.id)
    if (menu.customId === '')
      return await i.reply({ ...messages.serviceNotFound(locale, `menu:${customId}`), ephemeral: true })
    if (!bot || !user) {
      return await i.reply({
        ...messages.errorInService(locale, `menu:${customId}-guildMemberNotFound`),
        ephemeral: true
      })
    }
    const messageRequirePermissionsBot = requiresBotPermissions({
      permissions: menu.permissionsBot,
      bot,
      type: 'menu',
      locale
    })
    const messageRequirePermissionsUser = requiresUserPermissions({
      permissions: menu.permissionsUser,
      user,
      type: 'menu',
      locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: menu.cooldown,
      name: menu.customId,
      type: 'menu',
      locale: i.locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, menu.scope, i.guildId ?? '')

    const controlAccess = () => {
      if (messageRequirePermissionsBot) return messageRequirePermissionsBot
      if (messageRequirePermissionsUser) return messageRequirePermissionsUser
      if (messageAccessForScope) return messageAccessForScope
      if (messageCooldown) return messageCooldown
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
      const controlDenied = controlAccess()
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
