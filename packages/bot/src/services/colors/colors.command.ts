import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import BuildCommand from '@core/build/BuildCommand'
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ActionRowBuilder, type GuildMemberRoleManager, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js'
import type { EditColorDefault } from './editColorsDefault.modal'
import createColorRole from './shared/createColorRole'
import fetchColorCommand from './shared/fetchColorCommand'
import removeRoles from './shared/removeRoles'

const regexColors = /^#([a-f0-9]{6})$/

export default new BuildCommand({
  name: CommandNames.colors,
  ephemeral: true,
  scope: 'public',
  permissions: [],
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDescription('Personaliza el color de tu nickname con un color personalizado.')
    .addStringOption(strOp =>
      strOp.setName('color').setDescription('cambia el color de tu nickname, el formato es #RRGGBB')
    ),
  execute: async i => {
    const { guildId } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return { content: 'No se encontró el guild' }
    const { buttons, menus } = globalThis

    const { colorPointerId, colors, colorsDefault } = await fetchColorCommand(guildId, roles)

    const colorDefaultFunc = () => {
      if (colorsDefault) {
        return new StringSelectMenuBuilder({
          customId: MenuNames.colorDefault,
          placeholder: 'Selecciona un color'
        }).addOptions(
          ...(colorsDefault as unknown as EditColorDefault).values.map(color => ({
            label: color.label,
            value: color.hexcolor
          }))
        )
      }
      return menus.get(MenuNames.colorDefault).data
    }

    const components = [
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.setting).data,
        buttons.get(ButtonNames.removeColor).data,
        buttons.get(ButtonNames.editColorDefault).data
      ),
      new ActionRowBuilder().addComponents(colorDefaultFunc())
    ]

    if (!colorPointerId) return { content: 'el comando no está configurado', components }

    const colorCustom = i.options.getString('color')?.toLowerCase()

    if (colorCustom) {
      if (!regexColors.test(colorCustom)) return { content: 'El color no es correcto' }
      await removeRoles(roles, colors, i)
      const colorRole = await createColorRole({
        hexColor: colorCustom as `#${string}`,
        guildId,
        colors,
        colorPointerId,
        i
      })
      if (!colorRole) return { content: 'No se pudo crear el rol', components }
      await (i.member?.roles as GuildMemberRoleManager).add(colorRole)
      const position = roles?.get(colorPointerId)?.rawPosition ?? 0
      await i.guild?.roles.setPosition(colorRole.id, position)
      return { content: `El color de tu nickname se ha cambiado a <@&${colorRole.id}>`, components }
    }

    return { content: 'menu de colores', components }
  }
})
