import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import db from '@/core/db'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, resolveColor } from 'discord.js'
import fetchColorCommand from '../shared/fetchColorCommand'
import guildErrorMessage from '@/services/shared/guildError.message'
import { getI18n } from '@/i18n'
import formatterText from '@lib/formatterText'

export default new BuildButton({
  name: ButtonNames.setting,
  scope: 'public',
  permissions: ['ManageRoles'],
  cooldown: 15,
  data: new ButtonBuilder().setCustomId('setting').setLabel('Configuración').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId } = i
    if (!guildId) return guildErrorMessage(i.locale)
    const i18n = getI18n(i.locale, CommandNames.colors)
    const components = {
      linkDiscord: buttons.get(ButtonNames.linkDiscord).data,
      linkGithubIssues: buttons.get(ButtonNames.linkGithubIssues).data,
      linkKofi: buttons.get(ButtonNames.linkKofi).data,
      editColorsDefault: buttons.get(ButtonNames.editColorDefault).data,
      menuColorRemove: menus.get(MenuNames.settingColorRemove).data
    }

    let { colorPointerId } = await fetchColorCommand(guildId, i.guild?.roles.cache)

    if (!colorPointerId) {
      const role = await i.guild?.roles.create({
        name: '⚠️ Color Controller (Beatriz-Dono)',
        hoist: false,
        color: resolveColor('#f75b00'),
        permissions: '0'
      })
      if (!role)
        return {
          embeds: [
            new EmbedBuilder({
              title: i18n.errorCreatedColorPointer.title,
              description: i18n.errorCreatedColorPointer.description,
              color: Colors.Red
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
      await db.colorCommand.update({
        where: { serverId: guildId },
        data: {
          colorPointerId: role.id
        }
      })
      colorPointerId = role.id
      return {
        embeds: [
          new EmbedBuilder({
            title: i18n.firstExecution.title,
            description: formatterText(i18n.firstExecution.description, { slot0: `<@&${role.id}>` }),
            color: Colors.Green
          })
        ],
        components: [
          new ActionRowBuilder().addComponents(components.linkDiscord, components.linkGithubIssues, components.linkKofi)
        ]
      }
    }

    return {
      embeds: [new EmbedBuilder({ title: i18n.settingMenu.title, description: i18n.settingMenu.description })],
      components: [
        new ActionRowBuilder().addComponents(components.menuColorRemove),
        new ActionRowBuilder().addComponents(components.editColorsDefault)
      ]
    }
  }
})
