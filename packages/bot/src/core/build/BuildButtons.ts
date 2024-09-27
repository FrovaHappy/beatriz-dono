import type { ButtonNames } from '@/const/interactionsNames'
import type { MessageOptions, ResolveWithUpdate, Scope } from '@/types/main'
import type { ButtonBuilder, ButtonInteraction, PermissionResolvable } from 'discord.js'
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import hasAccessForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 * * `permissions`: The permissions that the bot needs to run the command.
 * * `resolve`: The resolve of the interaction, can be `reply`, `defer` or `update`.
 *   - `reply`: Sends a new message reply, use this mode when you create the modal and do not return anything.
 *   - `defer`: Sends a new async message reply. (incompatible with Modals)
 *   - `update`: The interaction will be updated. (incompatible with Modals)
 */
class BuildButton {
  type = 'buttons'
  name: ButtonNames
  scope: Scope
  ephemeral: boolean
  permissions: PermissionResolvable[]
  cooldown: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction) => Promise<MessageOptions | undefined>
  resolve: ResolveWithUpdate

  constructor(props: Partial<BuildButton> & Pick<BuildButton, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.resolve = props.resolve ?? 'reply'
    this.cooldown = props.cooldown ?? config.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ButtonInteraction) {
    const guildId = i.guildId
    if (!guildId) return { content: 'No se encontró el button' }
    const button: BuildButton = globalThis.buttons.get(i.customId)

    if (!button) return { content: 'No se encontró el button' }

    const getMessage = async () => {
      if (!hasAccessForScope(button.scope, guildId)) return { content: 'El bot no tiene acceso para este scope' }

      const messageRequirePermissions = requiresBotPermissions({
        permissions: button.permissions,
        bot: i.guild?.members.me,
        nameInteraction: i.customId,
        type: 'button'
      })
      if (messageRequirePermissions) return messageRequirePermissions

      // TODO: add require user permission

      const messageCooldown = isCooldownEnable({
        id: i.user.id,
        cooldown: button.cooldown,
        name: button.name,
        type: 'button'
      })
      if (messageCooldown) return { content: messageCooldown }
      try {
        return await button.execute(i)
      } catch (error) {
        console.error(error)
        return { content: `Error executing ${button.name}` }
      }
    }

    try {
      if (button.resolve === 'defer') await i.deferReply({ ephemeral: button.ephemeral })

      const message = await getMessage()
      if (!message) return

      if (button.resolve === 'update') return await i.update(message)
      if (button.resolve === 'defer') return await i.editReply(message)
      return await i.reply(message)
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${button.name}` }
    }
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
