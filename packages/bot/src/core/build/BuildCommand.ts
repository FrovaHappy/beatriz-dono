import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type {
  ChatInputCommandInteraction,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js'
import PERMISSIONS_BASE from '../../const/PermissionsBase'

import type { CommandNames } from '@/const/interactionsNames'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'
/**
 * #### Constructor
 * * ` data `: The SlashCommandBuilder.setName(name) is Optional
 */
class BuildCommand {
  type = 'commands' as const
  name: CommandNames
  scope: Scope
  ephemeral: boolean
  permissions: PermissionResolvable[]
  cooldown: number
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder
  resolve: Omit<Resolve, 'update'>
  execute: (e: ChatInputCommandInteraction) => Promise<MessageOptions | undefined>
  constructor(props: Partial<BuildCommand> & Pick<BuildCommand, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.resolve = props.resolve ?? 'defer'
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setName(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ChatInputCommandInteraction) {
    const command: Command = globalThis.commands.get(i.commandName)
    if (!command) return messages.serviceNotFound(i.locale, `command:${i.commandName}`)

    // create message Access basic
    const messageRequirePermissions = requiresBotPermissions({
      permissions: command.permissions,
      bot: i.guild?.members.me,
      type: 'command',
      locale: i.locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: command.cooldown,
      name: command.name,
      type: 'command',
      locale: i.locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, command.scope, i.guildId ?? '')
    const getMessage = async () => {
      if (messageRequirePermissions) return messageRequirePermissions
      if (messageCooldown) return messageCooldown
      if (messageAccessForScope) return messageAccessForScope
      try {
        return await command.execute(i)
      } catch (error) {
        console.error(error)
        return messages.errorInService(i.locale, `command:${i.commandName}-inExecute`)
      }
    }
    try {
      await i.deferReply({ ephemeral: command.ephemeral })
      const message = await getMessage()
      if (!message) return
      return await i.editReply(message)
    } catch (error) {
      console.error(error)
      return messages.errorInService(i.locale, `command:${i.commandName}-inReply`)
    }
  }
}

export type Command = InstanceType<typeof BuildCommand>
export default BuildCommand
