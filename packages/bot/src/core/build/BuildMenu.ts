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
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import messageErrorFoundService from '@/services/colors/shared/message.errorFoundService'
import baseMessage from './shared/baseMessage'
import messageHasOcurredAnError from '@/shared/message.hasOcurredAnError'
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
  permissions: PermissionResolvable[]
  cooldown: number
  data: Types[T]['builder']
  scope: Scope
  resolve: Resolve
  execute: (e: Types[T]['interaction']) => Promise<MessageOptions | undefined>
  constructor(props: Partial<BuildMenu<T>> & Pick<BuildMenu<T>, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.resolve = props.resolve ?? 'defer'
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: AnySelectMenuInteraction) {
    const menu: Menu = globalThis.menus.get(i.customId)
    if (!menu) return messageErrorFoundService(i.locale, `menu:${i.customId}`)

    const messageRequirePermissionsBot = requiresBotPermissions({
      permissions: menu.permissions,
      bot: i.guild?.members.me,
      nameInteraction: i.customId,
      type: 'menu',
      locale: i.locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: menu.cooldown,
      name: menu.name,
      type: 'menu',
      locale: i.locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, menu.scope, i.guildId ?? '')

    const getMessage = async () => {
      if (messageAccessForScope) return messageAccessForScope
      if (messageRequirePermissionsBot) return messageRequirePermissionsBot
      if (messageCooldown) return messageCooldown
      try {
        return await menu.execute(i)
      } catch (error) {
        console.error(error)
        return messageHasOcurredAnError(i.locale, `menu:${i.customId}-inExecute`)
      }
    }

    try {
      if (menu.resolve === 'update') await i.deferUpdate()
      if (menu.resolve === 'defer') await i.deferReply({ ephemeral: menu.ephemeral })
      const message = await getMessage()
      if (!message) return
      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return messageHasOcurredAnError(i.locale, `menu:${i.customId}-inReply`)
    }
  }
}

export type Menu = InstanceType<typeof BuildMenu>
export default BuildMenu
