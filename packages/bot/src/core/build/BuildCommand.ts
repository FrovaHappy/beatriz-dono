import PERMISSIONS_BASE from '../../const/PermissionsBase'
import { type MessageOptions, type Resolve, type Scope } from '@/types/main'
import {
  type SlashCommandBuilder,
  type PermissionResolvable,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

import { type CommandNames } from '@/const/interactionsNames'
import requiresBotPermissions from './shared/requiresBotPermissions'
import isCooldownEnable from './shared/isCooldownEnable'
/**
 * #### Constructor
 * * ` data `: The SlashCommandBuilder.setName(name) is Optional
 */
class BuildCommand {
  type: 'commands' = 'commands'
  name: CommandNames
  scope: Scope
  ephemeral: boolean
  permissions: PermissionResolvable[]
  cooldown: number
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder
  resolve: Resolve
  execute: (e: ChatInputCommandInteraction) => Promise<MessageOptions | undefined>
  constructor(props: Partial<BuildCommand> & Pick<BuildCommand, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.resolve = props.resolve ?? 'reply'
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.data = props.data.setName(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ChatInputCommandInteraction) {
    const command: Command = globalThis.commands.get(i.commandName)
    if (!command) return { content: 'No se encontró el command' }

    const messageRequirePermissions = requiresBotPermissions({
      permissions: command.permissions,
      bot: i.guild?.members.me,
      nameInteraction: i.commandName,
      type: 'command'
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: command.cooldown,
      name: command.name,
      type: 'command'
    })
    const getMessage = async () => {
      if (messageRequirePermissions) return messageRequirePermissions
      if (messageCooldown) return { content: messageCooldown }
      try {
        return await command.execute(i)
      } catch (error) {
        console.error(error)
        return { content: `Error executing ${command.name}` }
      }
    }
    try {
      if (command.resolve === 'defer') await i.deferReply({ ephemeral: command.ephemeral })
      const message = await getMessage()
      if (!message) return
      if (command.resolve === 'defer') return await i.editReply(message)
      return await i.reply({ ...message, ephemeral: command.ephemeral })
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${command.name}` }
    }
  }
}

export type Command = InstanceType<typeof BuildCommand>
export default BuildCommand
