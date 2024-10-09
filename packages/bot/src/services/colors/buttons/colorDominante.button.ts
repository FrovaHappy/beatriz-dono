import { getEmoji } from '@/const/emojis'
import { ButtonNames, CommandNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { getI18n } from '@/i18n'
import guildErrorMessage from '@/services/shared/guildError.message'
import { getDominanteColor, rgbToHex } from '@libs/colors'
import formatterText from '@libs/formatterText'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  type GuildMemberRoleManager
} from 'discord.js'
import createColorRole from '../shared/createColorRole'
import fetchColorCommand from '../shared/fetchColorCommand'
import messageErrorColorPointer from '../shared/message.errorColorPointer'
import { removeRolesOfUser } from '../shared/removeRoles'

export default new BuildButton({
  name: ButtonNames.colorDominante,
  permissions: ['ManageRoles'],
  scope: 'public',
  resolve: 'defer',
  data: new ButtonBuilder().setLabel('Color dominante').setStyle(ButtonStyle.Secondary).setEmoji(getEmoji('colorWand')),
  async execute(i) {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache
    const i18n = getI18n(locale, CommandNames.colors)
    if (!guildId) return guildErrorMessage(locale)

    const components = {
      linkDiscord: buttons.get(ButtonNames.linkDiscord).data,
      linkGithubIssues: buttons.get(ButtonNames.linkGithubIssues).data,
      linkKofi: buttons.get(ButtonNames.linkKofi).data,
      setting: buttons.get(ButtonNames.setting).data
    }

    const color = await getDominanteColor(i.user.displayAvatarURL({ extension: 'png', size: 512 }), 5)
    if (!color) return { content: 'No se pudo obtener el color dominante' }

    const hex = rgbToHex(color)

    const { colors, colorPointerId } = await fetchColorCommand(guildId, i.guild?.roles.cache)
    if (!colorPointerId) return messageErrorColorPointer(locale)

    const colorRole = await createColorRole({
      hexColor: hex as `#${string}`,
      guildId,
      colors,
      colorPointerId,
      i
    })
    if (!colorRole)
      return {
        embeds: [
          new EmbedBuilder({
            title: i18n.roleError.title,
            description: i18n.roleError.description,
            color: Colors.Red,
            footer: { text: i18n.roleError.footer }
          })
        ],
        components: [
          new ActionRowBuilder().addComponents(components.linkDiscord, components.linkGithubIssues, components.linkKofi)
        ]
      }
    await removeRolesOfUser(roles, colors, i)
    await (i.member?.roles as GuildMemberRoleManager).add(colorRole)
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.colorCreate.title,
          description: formatterText(i18n.colorCreate.description, { slot0: `<@&${colorRole.id}>` }),
          color: Colors.Green,
          footer: { text: i18n.colorCreate.footer }
        })
      ],
      components: [
        new ActionRowBuilder().addComponents(components.linkDiscord, components.linkGithubIssues, components.linkKofi)
      ]
    }
  }
})
