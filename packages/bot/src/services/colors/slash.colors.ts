import { CommandNames } from '@/const/interactionsNames'
import BuildCommand from '@core/build/BuildCommand'
import { ActionRowBuilder, type Locale, SlashCommandBuilder, type StringSelectMenuBuilder } from 'discord.js'
import db from '@db'
import messages, { messagesColors } from '@/messages'
import msgCreatePointerColor from './msg.createPointerColor'
import { changeColor } from './shared/changeColor'
import msgShowMenu from './msg.showMenu'
import { parseToLatest, type ColorsTemplete } from '@libs/schemas/colorsTemplete'

const customColorsOptions = (locale: Locale, templete: ColorsTemplete | null) => {
  const menu = globalThis.menus<'string'>('selectColors').get(locale)
  if (!templete) {
    return menu
  }
  const latest = parseToLatest(templete)
  menu.setOptions(latest.colors.map(c => ({ label: c.label, value: c.hex_color, emoji: c.emoji })))
  return menu
}

export default new BuildCommand({
  name: CommandNames.colors,
  ephemeral: true,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  resolve: 'defer',
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDescription('Change the color of your nickname')
    .setDescriptionLocalizations({
      'es-ES': 'Cambia el color de tu nombre',
      'es-419': 'Cambia el color de tu nombre'
    })
    .addStringOption(strOp =>
      strOp
        .setName('custom')
        .setDescription('add a color custom')
        .setDescriptionLocalizations({
          'es-ES': 'añade un color personalizado',
          'es-419': 'añade un color personalizado'
        })
        .setRequired(false)
    ),
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)

    const { pointer_id, colors, templete } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const colorCustom = i.options.getString('custom')?.toLowerCase()
    if (colorCustom) return changeColor({ colorCustom, colorPointerId, colors, guildId, i, locale })

    const colorCurrent = colors.find(c => roles?.get(c.role_id))
    const menu = msgShowMenu.getMessage(locale, { '{{slot0}}': colorCurrent?.hex_color ?? 'none' })
    menu.components = [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(customColorsOptions(locale, templete)),
      ...(menu.components ?? [])
    ]
    return menu
  }
})
