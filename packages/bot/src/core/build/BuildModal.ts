import type { ModalNames } from '@/const/interactionsNames'
import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type { ModalBuilder, ModalSubmitInteraction, PermissionResolvable } from 'discord.js'
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import baseMessage from './shared/baseMessage'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'

/**
 * #### Constructor
 * * ` data `: The modalBuilder.customId(name) not is required.
 * * ` update `: If is true, the message where the event was triggered will be updated, otherwise it will send a new message.
 */
class BuildModal {
  name: ModalNames
  scope: Scope
  ephemeral: boolean
  resolve: Resolve
  permissions: PermissionResolvable[]
  cooldown: number
  data: ModalBuilder
  execute: (e: ModalSubmitInteraction) => Promise<MessageOptions>

  constructor(props: Partial<BuildModal> & Pick<BuildModal, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? config.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.resolve = props.resolve ?? 'defer'
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ModalSubmitInteraction) {
    const modal: Modal = globalThis.modals.get(i.customId)
    if (!modal) return messages.serviceNotFound(i.locale, `modal:${i.customId}`)
    const messageRequirePermissions = requiresBotPermissions({
      permissions: modal.permissions,
      bot: i.guild?.members.me,
      type: 'modal',
      locale: i.locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: modal.cooldown,
      name: modal.name,
      type: 'modal',
      locale: i.locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, modal.scope, i.guildId ?? '')
    const getMessage = async () => {
      if (messageAccessForScope) return messageAccessForScope
      if (messageRequirePermissions) return messageRequirePermissions
      if (messageCooldown) return messageCooldown

      try {
        return await modal.execute(i)
      } catch (error) {
        console.error(error)
        return messages.errorInService(i.locale, `modal:${i.customId}-inExecute`)
      }
    }

    try {
      if (modal.resolve === 'defer') await i.deferReply({ ephemeral: modal.ephemeral })
      if (modal.resolve === 'update') await i.deferUpdate()
      const message = await getMessage()
      if (!message) return
      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return messages.errorInService(i.locale, `modal:${i.customId}-inReply`)
    }
  }
}
export type Modal = InstanceType<typeof BuildModal>
export default BuildModal
