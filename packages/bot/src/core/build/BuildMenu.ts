import type { MenuNames } from '@/const/interactionsNames'
import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type {
  AnySelectMenuInteraction,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuInteraction,
  PermissionResolvable,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction
} from 'discord.js'
import { PERMISSIONS_BASE_BOT, PERMISSIONS_BASE_USER } from '../../const/PermissionsBase'
import baseMessage from './shared/baseMessage'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'
import requiresUserPermissions from './shared/requiresUserPermissions'
interface Types {
  string: {
    builder: StringSelectMenuBuilder
    interaction: StringSelectMenuInteraction
  }
  user: {
    builder: UserSelectMenuBuilder
    interaction: UserSelectMenuInteraction
  }
  role: {
    builder: RoleSelectMenuBuilder
    interaction: RoleSelectMenuInteraction
  }
  mentionable: {
    builder: MentionableSelectMenuBuilder
    interaction: MentionableSelectMenuInteraction
  }
  channels: {
    builder: ChannelSelectMenuBuilder
    interaction: ChannelSelectMenuInteraction
  }
}

type MenuType = keyof Types

/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 */
class BuildMenu<T extends MenuType = 'string'> {
  type = 'menus' as const
  name: MenuNames
  ephemeral: boolean
  permissionsBot: PermissionResolvable[]
  permissionsUser: PermissionResolvable[]
  cooldown: number
  data: Types[T]['builder']
  scope: Scope
  resolve: Resolve
  execute: (e: Types[T]['interaction']) => Promise<MessageOptions | undefined>
  constructor(props: Partial<BuildMenu<T>> & Pick<BuildMenu<T>, 'name' | 'execute' | 'data'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.resolve = props.resolve ?? 'defer'
    this.ephemeral = props.ephemeral ?? false
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.permissionsUser = [...new Set([...PERMISSIONS_BASE_USER, ...(props.permissionsUser ?? [])])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: AnySelectMenuInteraction) {
    const { customId, locale } = i
    const menu: Menu = globalThis.menus.get(customId)
    const bot = i.guild?.members.me ?? undefined
    const user = i.guild?.members.cache.get(i.user.id)
    if (!menu) return await i.reply({ ...messages.serviceNotFound(locale, `menu:${customId}`), ephemeral: true })
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
      name: menu.name,
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
        return await menu.execute(i)
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
