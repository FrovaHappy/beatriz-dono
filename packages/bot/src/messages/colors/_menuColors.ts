import { ButtonNames, MenuNames } from '@/const/interactionsNames'
import type { MessageOptions } from '@/types/main'
import type { Colors as SchemaColors } from '../../services/colors/schema.color'
import formatterText from '@libs/formatterText'
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
  colorsDefault: SchemaColors | undefined
  placeholder: string
}

interface MenuColorsProps {
  locale: Locale
  colorsDefault: SchemaColors | undefined
  colorCurrent: { hexcolor: string; roleId: string } | undefined
}

export default function menuColors(props: MenuColorsProps): MessageOptions {
  const { locale, colorsDefault, colorCurrent } = props
  const i18n = getI18n(locale, i18ns)
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
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, {
          '{{slot0}}': `<@&${colorCurrent?.roleId ?? 'none'}>`,
          '{{slot1}}': colorCurrent?.hexcolor ?? 'none'
        }),
        color: Colors.Green
      }
    ],
    components: [
      new ActionRowBuilder().addComponents(rebuildColorsDefault({ colorsDefault, placeholder: i18n.placeholder })),
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.colorCast).data,
        buttons.get(ButtonNames.removeColor).data,
        buttons.get(ButtonNames.setting).data
      )
    ]
  }
}
