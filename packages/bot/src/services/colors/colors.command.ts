import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import BuildCommand from '@core/build/BuildCommand'
import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  type GuildMemberRoleManager,
  Locale,
  SlashCommandBuilder,
  StringSelectMenuBuilder
} from 'discord.js'
import type { EditColorDefault } from './editColorsDefault.modal'
import createColorRole from './shared/createColorRole'
import fetchColorCommand from './shared/fetchColorCommand'
import { removeRolesOfUser } from './shared/removeRoles'
import { getI18n, getI18nCollection } from '@/i18n'
import formatterText from '@lib/formatterText'
import guildErrorMessage from '../shared/guildError.message'
import messageErrorColorPointer from './shared/message.errorColorPointer'

const regexColors = /^#([a-f0-9]{6})$/

const en = getI18n(Locale.EnglishUS, CommandNames.colors)
const languages = getI18nCollection(CommandNames.colors)

export default new BuildCommand({
  name: CommandNames.colors,
  ephemeral: true,
  scope: 'public',
  permissions: [],
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDescription(en.description)
    .setDescriptionLocalizations({
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...languages.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.description }), {})
    })
    .addStringOption(strOp =>
      strOp
        .setName('custom')
        .setDescription(en.options.custom)
        .setDescriptionLocalizations({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...languages.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.options.custom }), {})
        })
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
      removeColor: buttons.get(ButtonNames.removeColor).data,
      editColorDefault: buttons.get(ButtonNames.editColorDefault).data
    }
    if (!guildId) return guildErrorMessage(i.locale)

    const { colorPointerId, colors, colorsDefault } = await fetchColorCommand(guildId, roles)

    const rebuildColorsDefault = () => {
      if (colorsDefault) {
        return new StringSelectMenuBuilder({
          customId: MenuNames.colorDefault,
          placeholder: i18n.colorsDefault.placeholder
        }).addOptions(
          ...(colorsDefault as unknown as EditColorDefault).values.map(color => ({
            label: color.label,
            value: color.hexcolor
          }))
        )
      }
      return menus.get(MenuNames.colorDefault).data
    }
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
        new ActionRowBuilder().addComponents(rebuildColorsDefault()),
        new ActionRowBuilder().addComponents(
          components.linkDiscord,
          components.linkGithubIssues,
          components.linkKofi,
          components.setting
        )
      ]
    }
  }
})
