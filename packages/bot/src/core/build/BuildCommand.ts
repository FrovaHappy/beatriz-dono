import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type {
  ChatInputCommandInteraction,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js'
import { PERMISSIONS_BASE_BOT } from '../../const/PermissionsBase'

import msgCaptureError from './msg.captureError'
import msgCooldownTimeout from './msg.cooldownTimeout'
import { hasAccessForScope } from './shared/hasAccessForScope'
import isCooldownEnable, { parseTimestamp } from './shared/isCooldownEnable'
import msgHasAccessToScope from './shared/msg.hasAccessToScope'
import msgPermissionsBotRequired from './shared/msg.permissionsBotRequired'
import parsePermissions from './shared/parsePermissions'
/**
 * #### Constructor
 * * ` data `: The SlashCommandBuilder.setName(name) is Optional
 */
class BuildCommand {
  type = 'commands' as const
  name: string
  scope: Scope
  ephemeral: boolean
  permissionsBot: PermissionResolvable[]
  cooldown: number
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder
  resolve: Omit<Resolve, 'update'>
  execute: (e: ChatInputCommandInteraction) => Promise<MessageOptions | undefined>
  constructor(props: Partial<BuildCommand> & Pick<BuildCommand, 'name' | 'execute' | 'data'>) {
    this.name = props.name
    this.scope = props.scope ?? 'dev'
    this.cooldown = props.cooldown ?? config.env.discord.cooldown
    this.resolve = props.resolve ?? 'defer'
    this.ephemeral = props.ephemeral ?? false
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.data = props.data.setName(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ChatInputCommandInteraction) {
    const { commandName, locale, guildId } = i
    const command: Command = globalThis.commands.get(commandName)
    const bot = i.guild?.members.me
    const user = i.guild?.members.cache.get(i.user.id)
    if (!bot || !user || !guildId || !command) {
      return await i.reply({
        ...msgCaptureError.getMessage(locale, { '{{slot0}}': `BuildCommand ${commandName} -> essential data missing` }),
        ephemeral: true
      })
    }
    const keyId = `command:${command.name}`
    const controlAccess = {
      accessForScope: hasAccessForScope(command.scope, guildId),
      accessForPermissionsBot: bot.permissions.has(command.permissionsBot),
      withoutCooldown: !isCooldownEnable({ id: user.id, cooldown: command.cooldown, keyId })
    }
    const messageControl = () => {
      if (!controlAccess.accessForPermissionsBot) {
        return msgPermissionsBotRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(bot.permissions.toArray(), command.permissionsBot)
        })
      }
      if (!controlAccess.withoutCooldown) {
        return msgCooldownTimeout.getMessage(locale, {
          '{{slot0}}': command.cooldown.toString(),
          '{{slot1}}': parseTimestamp(keyId, user.id, command.cooldown).toString()
        })
      }
      if (!controlAccess.accessForScope) return msgHasAccessToScope.getMessage(locale, { '{{slot0}}': command.scope })
    }
    try {
      const controlDenied = messageControl()
      if (controlDenied) return await i.reply({ ...controlDenied, ephemeral: true })
      await i.deferReply({ ephemeral: command.ephemeral })
      const message = await command.execute(i)
      if (!message) return
      return await i.editReply(message)
    } catch (error) {
      console.error(error)
      return msgCaptureError.getMessage(i.locale, { '{{slot0}}': `BuildCommand ${i.commandName} -> inReply` })
    }
  }
}

export type Command = InstanceType<typeof BuildCommand>
export default BuildCommand
