import COLORS from '@/const/colors'
import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { getI18n } from '@/i18n'
import formatterText from '@libs/formatterText'
import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  type GuildMemberRoleManager,
  Locale,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js'
import guildErrorMessage from '../shared/guildError.message'
import createColorRole from './shared/createColorRole'
import fetchColorCommand from './shared/fetchColorCommand'
import messageErrorColorPointer from './shared/message.errorColorPointer'
import { removeRolesOfUser } from './shared/removeRoles'

const en = getI18n(Locale.EnglishUS, CommandNames.colors)

export default new BuildMenu({
  name: MenuNames.colorDefault,
  resolve: 'update',
  permissions: [],
  data: new StringSelectMenuBuilder({
    placeholder: en.colorsDefault.placeholder
  }).addOptions(
    ...COLORS.map(color => {
      return new StringSelectMenuOptionBuilder().setValue(color.hexColor).setLabel(color.label).setEmoji(color.emoji)
    })
  ),
  execute: async i => {
    const i18n = getI18n(i.locale, CommandNames.colors)

    const components = {
      linkDiscord: buttons.get(ButtonNames.linkDiscord).data,
      linkGithubIssues: buttons.get(ButtonNames.linkGithubIssues).data,
      linkKofi: buttons.get(ButtonNames.linkKofi).data
    }
    const { values, guildId } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return guildErrorMessage(i.locale)

    const colorSelected = values[0] as `#${string}`
    const { colors, colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messageErrorColorPointer(i.locale)

    const colorRole = await createColorRole({
      hexColor: colorSelected,
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
