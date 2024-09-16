import PERMISSIONS_BASE from '../../const/PermissionsBase'
import {
  type PermissionResolvable,
  type ModalSubmitInteraction,
  type ModalBuilder,
  type InteractionReplyOptions
} from 'discord.js'
import { type Scope } from '@/types/main'
import { type ModalNames } from '@/const/interactionsNames'
import requiresBotPermissions from './shared/requiresBotPermissions'
import isCooldownEnable from './shared/isCooldownEnable'

interface MessageOptions {
  content?: InteractionReplyOptions['content']
  embeds?: InteractionReplyOptions['embeds']
  components?: InteractionReplyOptions['components']
  files?: InteractionReplyOptions['files']
}

interface ModalsProps {
  name: ModalNames
  scope?: Scope
  ephemeral?: boolean
  defer?: boolean
  permissions: PermissionResolvable[]
  cooldown?: number
  data: ModalBuilder
  update?: boolean
  execute: (e: ModalSubmitInteraction) => Promise<MessageOptions>
}
/**
 * #### Constructor
 * * ` data `: The modalBuilder.customId(name) not is required.
 * * ` update `: If is true, the message where the event was triggered will be updated, otherwise it will send a new message.
 */
class BuildModal {
  name: string
  ephemeral
  permissions
  cooldown
  update
  data
  scope
  execute
  constructor(props: ModalsProps) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.update = props.update ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ModalSubmitInteraction) {
    const modal: Modal = globalThis.modals.get(i.customId)

    const getMessage = async () => {
      if (!modal) return { content: 'No se encontró el modal' }
      const messageRequirePermissions = requiresBotPermissions({
        permissions: modal.permissions,
        bot: i.guild?.members.me,
        nameInteraction: i.customId,
        type: 'modal'
      })
      if (messageRequirePermissions) return messageRequirePermissions
      // TODO: add require user permission
      // TODO: add scope validation

      const messageCooldown = isCooldownEnable({
        id: i.user.id,
        cooldown: modal.cooldown,
        name: modal.name,
        type: 'modal'
      })
      if (messageCooldown) return { content: messageCooldown }
      try {
        return await modal.execute(i)
      } catch (error) {
        console.error(error)
        return { content: `Error executing ${modal.name}` }
      }
    }

    try {
      const message = await getMessage()
      if (modal.update) {
        return await i.message?.edit(message)
      }
      return await i.reply(message)
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${modal.name}` }
    }
  }
}
export type Modal = InstanceType<typeof BuildModal>
export default BuildModal
