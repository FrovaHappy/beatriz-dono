import type { ModalNames } from '@/const/interactionsNames'
import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type { ModalBuilder, ModalSubmitInteraction, PermissionResolvable } from 'discord.js'
import { PERMISSIONS_BASE_BOT, PERMISSIONS_BASE_USER } from '../../const/PermissionsBase'
import baseMessage from './shared/baseMessage'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'
import requiresUserPermissions from './shared/requiresUserPermissions'

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
  permissionsBot: PermissionResolvable[]
  permissionsUser: PermissionResolvable[]
  cooldown: number
  data: ModalBuilder
  execute: (e: ModalSubmitInteraction) => Promise<MessageOptions>

  constructor(props: Partial<BuildModal> & Pick<BuildModal, 'name' | 'execute' | 'data'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? config.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.resolve = props.resolve ?? 'defer'
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.permissionsUser = [...new Set([...PERMISSIONS_BASE_USER, ...(props.permissionsUser ?? [])])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ModalSubmitInteraction) {
    const { customId, locale } = i
    const modal: Modal = globalThis.modals.get(customId)
    const bot = i.guild?.members.me ?? undefined
    const user = i.guild?.members.cache.get(i.user.id)
    if (!bot || !user) {
      return await i.reply({
        ...messages.errorInService(locale, `modal:${customId}-guildMemberNotFound`),
        ephemeral: true
      })
    }
    if (!modal) return await i.reply(messages.serviceNotFound(locale, `modal:${customId}`))

    const messageRequirePermissions = requiresBotPermissions({
      permissions: modal.permissionsBot,
      bot,
      type: 'modal',
      locale
    })
    const messageRequirePermissionsUser = requiresUserPermissions({
      permissions: modal.permissionsUser,
      user,
      type: 'modal',
      locale
    })
    const messageCooldown = isCooldownEnable({
      id: i.user.id,
      cooldown: modal.cooldown,
      name: modal.name,
      type: 'modal',
      locale: i.locale
    })
    const messageAccessForScope = buildMessageErrorForScope(i.locale, modal.scope, i.guildId ?? '')
    const controlAccess = () => {
      if (messageRequirePermissions) return messageRequirePermissions
      if (messageRequirePermissionsUser) return messageRequirePermissionsUser
      if (messageAccessForScope) return messageAccessForScope
      if (messageCooldown) return messageCooldown
    }
    const getMessage = async () => {
      try {
        return await modal.execute(i)
      } catch (error) {
        console.error(error)
        return messages.errorInService(i.locale, `modal:${i.customId}-inExecute`)
      }
    }

    try {
      const controlDenied = controlAccess()
      if (controlDenied) return await i.reply({ ...controlDenied, ephemeral: true })
      if (modal.resolve === 'defer') await i.deferReply({ ephemeral: modal.ephemeral })
      if (modal.resolve === 'update') await i.deferUpdate()
      const message = await getMessage()
      if (!message) return
      return await i.editReply({ ...baseMessage, ...message })
    } catch (error) {
      console.error(error)
      return messages.errorInService(locale, `modal:${customId}-inReply`)
    }
  }
}
export type Modal = InstanceType<typeof BuildModal>
export default BuildModal
