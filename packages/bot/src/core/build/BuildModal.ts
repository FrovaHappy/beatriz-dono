import type { MessageOptions, Resolve, Scope } from '@/types/main'
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  type ButtonStyle,
  type Locale,
  type ModalSubmitInteraction,
  type PermissionResolvable,
  type TextInputStyle
} from 'discord.js'
import { PERMISSIONS_BASE_BOT, PERMISSIONS_BASE_USER } from '../../const/PermissionsBase'
import baseMessage from './shared/baseMessage'
import buildMessageErrorForScope from './shared/hasAccessForScope'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'
import messages from '@/messages'
import requiresUserPermissions from './shared/requiresUserPermissions'
import BuildButton, { type Button } from './BuildButtons'
interface TextInputTranslate {
  label: string
  placeholder: string
}
interface TextInputComponent {
  customId: string
  required?: boolean
  value?: string
  style: TextInputStyle
  translates: Partial<Record<Locale, TextInputTranslate>> & { default: TextInputTranslate }
}

type ModalData = {
  title: Partial<Record<Locale, string>> & { default: string }
  components?: TextInputComponent[]
}

interface ModalConstructor {
  cooldown?: BuildModal['cooldown']
  customId: BuildModal['customId']
  scope?: BuildModal['scope']
  ephemeral: BuildModal['ephemeral']
  resolve: BuildModal['resolve']
  permissionsBot: BuildModal['permissionsBot']
  permissionsUser: BuildModal['permissionsUser']
  execute: BuildModal['execute']
  translates: ModalData
  dataButton: { style: ButtonStyle; translates: Button['translates'] }
}
class BuildModal {
  customId: string
  #translates: ModalData
  scope: Scope
  button: Button
  ephemeral: boolean
  resolve: Resolve
  permissionsBot: PermissionResolvable[]
  permissionsUser: PermissionResolvable[]
  cooldown: number

  execute: (e: ModalSubmitInteraction) => Promise<MessageOptions>

  constructor(props: ModalConstructor) {
    this.customId = props.customId
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? config.env.discord.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.#translates = props.translates
    this.resolve = props.resolve ?? 'defer'
    this.permissionsBot = [...new Set([...PERMISSIONS_BASE_BOT, ...(props.permissionsBot ?? [])])]
    this.permissionsUser = [...new Set([...PERMISSIONS_BASE_USER, ...(props.permissionsUser ?? [])])]
    this.execute = props.execute
    this.button = new BuildButton({
      customId: `modal-${this.customId}`,
      scope: this.scope,
      permissionsBot: this.permissionsBot,
      permissionsUser: this.permissionsUser,
      resolve: 'showModal',
      style: props.dataButton.style,
      translates: props.dataButton.translates,
      execute: async i => {
        const { guildId, locale } = i
        if (!guildId) throw new Error('Guild ID not found')
        const customId = i.customId.replace('modal-', '')
        const modal = globalThis.modals(customId)
        if (!modal) throw new Error('Modal not found')
        await i.showModal(modal.get(locale))
        return undefined
      }
    })
  }
  get(locale: Locale) {
    const titleModal = this.#translates.title[locale] ?? this.#translates.title.default
    const componentsModal = this.#translates.components?.map(component => {
      const { label, placeholder } = component.translates[locale] ?? component.translates.default
      return new TextInputBuilder({
        label,
        placeholder,
        customId: component.customId,
        required: component.required,
        value: component.value,
        style: component.style
      })
    })
    return new ModalBuilder({ title: titleModal, customId: this.customId }).addComponents(
      new ActionRowBuilder<TextInputBuilder>().setComponents(componentsModal ?? [])
    )
  }
  static async runInteraction(i: ModalSubmitInteraction) {
    const { customId, locale } = i
    const modal = globalThis.modals(customId)
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
      name: modal.customId,
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
