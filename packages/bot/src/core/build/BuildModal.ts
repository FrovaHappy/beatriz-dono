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
import isCooldownEnable, { parseTimestamp } from './shared/isCooldownEnable'
import messages from '@/messages'
import BuildButton, { type Button } from './BuildButtons'
import msgCaptureError from './msg.captureError'
import msgPermissionsUserRequired from './shared/msg.permissionsUserRequired'
import msgPermissionsBotRequired from './shared/msg.permissionsBotRequired'
import parsePermissions from './shared/parsePermissions'
import msgCooldownTimeout from './msg.cooldownTimeout'
import msgHasAccessToScope from './shared/msg.hasAccessToScope'
import { hasAccessForScope } from './shared/hasAccessForScope'
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
    const { customId, locale, guildId } = i
    const modal = globalThis.modals(customId)
    const bot = i.guild?.members.me ?? undefined
    const user = i.guild?.members.cache.get(i.user.id)
    if (!bot || !user || modal.customId === '' || !guildId) {
      return await i.reply({
        ...msgCaptureError.getMessage(locale, { '{{slot0}}': `BuildModal ${customId}` }),
        ephemeral: true
      })
    }
    const keyId = `modal:${customId}`
    const controlAccess = {
      accessForScope: hasAccessForScope(modal.scope, guildId),
      accessForPermissionsBot: bot.permissions.has(modal.permissionsBot),
      accessForPermissionsUser: user.permissions.has(modal.permissionsUser),
      withoutCooldown: !isCooldownEnable({
        id: i.user.id,
        cooldown: modal.cooldown,
        keyId
      })
    }

    const messageControl = () => {
      if (!controlAccess.accessForPermissionsUser) {
        return msgPermissionsUserRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(user.permissions.toArray(), modal.permissionsUser)
        })
      }
      if (!controlAccess.accessForPermissionsBot) {
        return msgPermissionsBotRequired.getMessage(locale, {
          '{{slot0}}': parsePermissions(bot.permissions.toArray(), modal.permissionsBot)
        })
      }
      if (!controlAccess.withoutCooldown) {
        return msgCooldownTimeout.getMessage(locale, {
          '{{slot0}}': modal.cooldown.toString(),
          '{{slot1}}': parseTimestamp(keyId, user.id, modal.cooldown).toString()
        })
      }
      if (!controlAccess.accessForScope) return msgHasAccessToScope.getMessage(locale, { '{{slot0}}': modal.scope })
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
      const controlDenied = messageControl()
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
