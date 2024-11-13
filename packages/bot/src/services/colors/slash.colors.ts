import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import BuildCommand from '@core/build/BuildCommand'
import formatterText from '@libs/formatterText'
import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  type GuildMemberRoleManager,
  Locale,
  SlashCommandBuilder,
  StringSelectMenuBuilder
} from 'discord.js'
import guildErrorMessage from '../shared/guildError.message'
import type { Colors as SchemaColors } from './schema.color'
import createColorRole from './shared/createColorRole'
import fetchColorCommand from './shared/fetchColorCommand'
import messageErrorColorPointer from './shared/message.errorColorPointer'
import { removeRolesOfUser } from './shared/removeRoles'
import { reduceTupleToObj } from '@/shared/general'

const regexColors = /^#([a-f0-9]{6})$/

const en = getI18n(Locale.EnglishUS, CommandNames.colors)
const languages = getI18nCollection(CommandNames.colors)

interface RebuildColorsProps {
  colorsDefault: SchemaColors | undefined
  placeholder: string
}
const rebuildColorsDefault = ({ colorsDefault, placeholder }: RebuildColorsProps) => {
  if (colorsDefault) {
    return new StringSelectMenuBuilder({
      customId: MenuNames.colorDefault,
      placeholder
    }).addOptions(
      ...colorsDefault.values.map(color => ({
        label: color.label,
        value: color.hexcolor
      }))
    )
  }
  return menus.get(MenuNames.colorDefault).data
}

export default new BuildCommand({
  name: CommandNames.colors,
  ephemeral: true,
  scope: 'public',
  permissions: ['ManageRoles'],
  resolve: 'defer',
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDescription(en.description)
    .setDescriptionLocalizations(reduceTupleToObj(languages, 'description'))
    .addStringOption(strOp =>
      strOp
        .setName('custom')
        .setDescription(en.options.custom)
        .setDescriptionLocalizations(reduceTupleToObj(languages, 'options.custom'))
        .setRequired(false)
    ),
  execute: async i => {
    const { buttons, menus } = globalThis
    const { guildId } = i
    const i18n = getI18n(i.locale, CommandNames.colors)
    const roles = i.guild?.roles.cache

    const components = {
      linkDiscord: buttons.get(ButtonNames.linkDiscord).data,
      linkGithubIssues: buttons.get(ButtonNames.linkGithubIssues).data,
      linkKofi: buttons.get(ButtonNames.linkKofi).data,
      setting: buttons.get(ButtonNames.setting).data,
      removeColorUser: buttons.get(ButtonNames.removeColor).data,
      colorDominante: buttons.get(ButtonNames.colorDominante).data
    }
    if (!guildId) return guildErrorMessage(i.locale)

    const { colorPointerId, colors, colorsDefault } = await fetchColorCommand(guildId, roles)

    if (!colorPointerId) return messageErrorColorPointer(i.locale)

    const colorCustom = i.options.getString('custom')?.toLowerCase()

    if (colorCustom) {
      if (!regexColors.test(colorCustom)) {
        return {
          embeds: [
            new EmbedBuilder({
              title: i18n.colorIncorrect.title,
              description: i18n.colorIncorrect.description,
              color: Colors.Red,
              footer: { text: i18n.colorIncorrect.footer }
            })
          ],
          components: [
            new ActionRowBuilder().addComponents(
              components.linkDiscord,
              components.linkGithubIssues,
              components.linkKofi
            )
          ]
        }
      }
      const colorRole = await createColorRole({
        hexColor: colorCustom as `#${string}`,
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
            new ActionRowBuilder().addComponents(
              components.linkDiscord,
              components.linkGithubIssues,
              components.linkKofi
            )
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

    // Menu Colors

    const colorCurrent = colors.find(c => (i.member?.roles as GuildMemberRoleManager)?.cache.get(c.roleId))
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.menu.title,
          description: formatterText(i18n.menu.description, {
            slot0: `<@&${colorCurrent?.roleId ?? 'none'}>`,
            slot1: colorCurrent?.hexcolor ?? 'none'
          })
        })
      ],
      components: [
        new ActionRowBuilder().addComponents(
          rebuildColorsDefault({ colorsDefault, placeholder: i18n.colorsDefault.placeholder })
        ),
        new ActionRowBuilder().addComponents(components.colorDominante, components.removeColorUser, components.setting),
        new ActionRowBuilder().addComponents(components.linkDiscord, components.linkGithubIssues, components.linkKofi)
      ]
    }
  }
})
