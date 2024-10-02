import COLORS from '@/const/colors'
import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  type GuildMemberRoleManager,
  Locale,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js'
import createColorRole from './shared/createColorRole'
import fetchColorCommand from './shared/fetchColorCommand'
import removeRoles from './shared/removeRoles'
import { getI18n } from '@/i18n'
import guildErrorMessage from '../shared/guildError.message'
import formatterText from '@lib/formatterText'

const en = getI18n(Locale.EnglishUS, CommandNames.colors)

export default new BuildMenu({
  name: MenuNames.colorDefault,
  menuType: 'string',
  resolve: 'defer',
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
    if (!colorPointerId)
      return {
        embeds: [
          new EmbedBuilder({
            title: i18n.errorColorPointer.title,
            description: i18n.errorColorPointer.description,
            color: Colors.Red,
            footer: { text: i18n.errorColorPointer.footer }
          })
        ],
        components: [
          new ActionRowBuilder().addComponents(components.linkDiscord, components.linkGithubIssues, components.linkKofi)
        ]
      }

    await removeRoles(roles, colors, i)
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
    await removeRoles(roles, colors, i)
    await (i.member?.roles as GuildMemberRoleManager).add(colorRole)
    const position = roles?.get(colorPointerId)?.rawPosition ?? 0
    await i.guild?.roles.setPosition(colorRole.id, position)
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.colorCreate.title,
          description: formatterText(i18n.colorCreate.description, { slot0: `<@${colorRole.id}>` }),
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
