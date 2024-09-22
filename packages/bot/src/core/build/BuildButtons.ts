import PERMISSIONS_BASE from '../../const/PermissionsBase'
import { type PermissionResolvable, type ButtonInteraction, type ButtonBuilder } from 'discord.js'
import { type MessageOptions, type Scope } from '@/types/main'
import { type ButtonNames } from '@/const/interactionsNames'
import requiresBotPermissions from './shared/requiresBotPermissions'
import isCooldownEnable from './shared/isCooldownEnable'
import hasAccessForScope from './shared/hasAccessForScope'
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 * * `permissions`: The permissions that the bot needs to run the command.
 */
class BuildButton {
  type = 'buttons'
  name: ButtonNames
  scope: Scope
  ephemeral: boolean
  defer: boolean
  permissions: PermissionResolvable[]
  cooldown: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction) => Promise<MessageOptions | undefined>
  update: boolean

  constructor(props: Partial<BuildButton> & Pick<BuildButton, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.defer = props.defer ?? true
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.update = props.update ?? false
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
      if (button.defer && !button.update) await i.deferReply({ ephemeral: button.ephemeral })
      const message = await getMessage()

      if (!message) return
      if (button.update) return await i.message?.edit(message)
      if (button.defer) await i.editReply(message)

      return await i.reply(message)
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${button.name}` }
    }
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
