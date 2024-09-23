import PERMISSIONS_BASE from '../../const/PermissionsBase'
import {
  type PermissionResolvable,
  type StringSelectMenuBuilder,
  type UserSelectMenuBuilder,
  type RoleSelectMenuBuilder,
  type MentionableSelectMenuBuilder,
  type ChannelSelectMenuBuilder,
  type StringSelectMenuInteraction,
  type UserSelectMenuInteraction,
  type RoleSelectMenuInteraction,
  type MentionableSelectMenuInteraction,
  type ChannelSelectMenuInteraction,
  type AnySelectMenuInteraction
} from 'discord.js'
import { type MessageOptions, type Scope, type Resolve } from '@/types/main'
import { type MenuNames } from '@/const/interactionsNames'
import requiresBotPermissions from './shared/requiresBotPermissions'
import isCooldownEnable from './shared/isCooldownEnable'
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
class BuildMenu<T extends MenuType> {
  type: 'menus' = 'menus'
  name: MenuNames
  ephemeral: boolean
  permissions: PermissionResolvable[]
  cooldown: number
  data: Types[T]['builder']
  scope: Scope
  resolve: Resolve
  menuType: MenuType
  execute: (e: Types[T]['interaction']) => Promise<MessageOptions | undefined>
  constructor(props: Partial<BuildMenu<T>> & Pick<BuildMenu<T>, 'name' | 'execute' | 'data' | 'permissions' | 'menuType'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.menuType = props.menuType
    this.cooldown = props.cooldown ?? 0
    this.resolve = props.resolve ?? 'reply'
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: AnySelectMenuInteraction) {
    const menu: Menu = globalThis.menus.get(i.customId)
    if (!menu) return { content: 'No se encontró el menu' }

    const messageRequirePermissionsBot = requiresBotPermissions({
      permissions: menu.permissions,
      bot: i.guild?.members.me,
      nameInteraction: i.customId,
      type: 'menu'
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: menu.cooldown,
      name: menu.name,
      type: 'menu'
    })

    const getMessage = async () => {
      if (messageRequirePermissionsBot) return messageRequirePermissionsBot
      if (messageCooldown) return { content: messageCooldown }

      try {
        return await menu.execute(i)
      } catch (error) {
        console.error(error)
        return { content: `Error executing ${menu.name}` }
      }
    }

    try {
      if (menu.resolve === 'defer') await i.deferReply({ ephemeral: menu.ephemeral })
      const message = await getMessage()
      if (!message) return
      if (menu.resolve === 'defer') return await i.editReply(message)
      return await i.reply(message)
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${menu.name}` }
    }
  }
}

export type Menu = InstanceType<typeof BuildMenu>
export default BuildMenu
