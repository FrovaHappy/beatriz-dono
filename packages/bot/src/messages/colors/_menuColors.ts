import { ButtonNames, MenuNames } from '@/const/interactionsNames'
import type { MessageOptions } from '@/types/main'
import formatterText from '@libs/formatterText'
import { type ColorsTemplete, parseToLatest } from '@libs/schemas/colorsTemplete'
import { ActionRowBuilder, Colors, StringSelectMenuBuilder, type Locale } from 'discord.js'
import getI18n, { type I18ns } from '@/shared/getI18n'

interface I18n {
  title: string
  description: string
  placeholder: string
}

const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Color Module',
    description: 'Select a color to change the color of the role',
    placeholder: 'Select a color'
  },
  'es-ES': {
    title: 'Módulo de Colores',
    description: 'Selecciona un color para cambiar el color del rol',
    placeholder: 'Selecciona un color'
  }
}

interface RebuildColorsProps {
  templete: ColorsTemplete
  placeholder: string
}

interface MenuColorsProps {
  locale: Locale
  templete: ColorsTemplete
  colorCurrent?: {
    role_id: string
    hex_color: string
  }
}

export default function menuColors(props: MenuColorsProps): MessageOptions {
  const { locale, templete, colorCurrent } = props
  const i18n = getI18n(locale, i18ns)
  const rebuildColorsDefault = ({ templete, placeholder }: RebuildColorsProps) => {
    if (!templete) return menus.get(MenuNames.colorDefault).data
    const templeteLatest = parseToLatest(templete)
    if (!templeteLatest) return menus.get(MenuNames.colorDefault).data
    return new StringSelectMenuBuilder({
      customId: MenuNames.colorDefault,
      placeholder
    }).addOptions(
      ...templeteLatest.colors.map(color => ({
        label: color.label,
        value: color.hex_color
      }))
    )
  }
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, {
          '{{slot0}}': `<@&${colorCurrent?.role_id ?? 'none'}>`,
          '{{slot1}}': colorCurrent?.hex_color ?? 'none'
        }),
        color: Colors.Green
      }
    ],
    components: [
      new ActionRowBuilder().addComponents(rebuildColorsDefault({ templete, placeholder: i18n.placeholder })),
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.colorCast).data,
        buttons.get(ButtonNames.removeColor).data,
        buttons.get(ButtonNames.setting).data
      )
    ]
  }
}
