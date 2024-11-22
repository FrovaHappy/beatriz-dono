import { ButtonNames, MenuNames, ModalNames } from '@/const/interactionsNames'
import getI18n, { type I18ns } from '@/shared/getI18n'
import formatterText from '@libs/formatterText'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

interface I18nDeleteAll {
  title: string
  description: string
}
interface I18nDeleteAsome {
  title: string
  description: string
}
interface I18nDeleteNotUsed {
  title: string
  description: string
}
interface I18nDeleteAllConfirmed {
  title: string
  description: string
}
interface I18nDeleteNotUsedConfirmed {
  title: string
  description: string
}
interface I18nDeleteAsomeConfirmed {
  title: string
  description: string
}

const i18nsDeleteAll: I18ns<I18nDeleteAll> = {
  'en-US': {
    title: 'Delete all colors',
    description: 'Are you sure you want to delete all the colors?'
  },
  'es-ES': {
    title: 'Eliminar todos los colores',
    description: '¿Estás seguro de que quieres eliminar todos los colores?'
  }
}

const i18nsDeleteAsome: I18ns<I18nDeleteAsome> = {
  'en-US': {
    title: 'Delete asome colors',
    description: 'Please, select the colors you want to delete.'
  },
  'es-ES': {
    title: 'Eliminar algunos colores',
    description: 'Por favor, selecciona los colores que quieres eliminar.'
  }
}
const i18nsDeleteNotUsed: I18ns<I18nDeleteNotUsed> = {
  'en-US': {
    title: 'Delete colors not used',
    description: 'Are you sure you want to delete colors not used?'
  },
  'es-ES': {
    title: 'Eliminar colores no utilizados',
    description: '¿Estás seguro de que quieres eliminar colores no utilizados?'
  }
}
const i18nsDeleteAllConfirmed: I18ns<I18nDeleteAllConfirmed> = {
  'en-US': {
    title: 'Finished',
    description: 'Deleted a total of {{slot0}} roles of colors.'
  },
  'es-ES': {
    title: 'Finalizado',
    description: 'Se han eliminado un total de {{slot0}} roles de colores.'
  }
}

const i18nsDeleteAsomeConfirmed: I18ns<I18nDeleteAsomeConfirmed> = {
  'en-US': {
    title: 'Delete partially finished',
    description: 'Deleted a total of {{slot0}}/{{slot1}} roles of colors.'
  },
  'es-ES': {
    title: 'Eliminación parcial finalizada',
    description: 'se han eliminado un total de {{slot0}}/{{slot1}} roles de colores.'
  }
}

const i18nsDeleteNotUsedConfirmed: I18ns<I18nDeleteNotUsedConfirmed> = {
  'en-US': {
    title: 'Finish delete not used',
    description: 'Deleted a total of {{slot0}}/{{slot1}} roles of colors.'
  },
  'es-ES': {
    title: 'Eliminación finalizada',
    description: 'se han eliminado un total de {{slot0}}/{{slot1}} roles de colores.'
  }
}

function deleteAll(locale: Locale) {
  const i18n = getI18n(locale, i18nsDeleteAll)
  return {
    embeds: [
      {
        title: i18n.title,
        description: i18n.description,
        color: Colors.Red
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.deleteServerAllColors).data)]
  }
}

function deleteAllConfirmed(locale: Locale, colorsLength: number) {
  const i18n = getI18n(locale, i18nsDeleteAllConfirmed)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, { '{{slot0}}': colorsLength.toString() }),
        color: Colors.Green
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.linkKofi).data)]
  }
}

function deleteNotUsed(locale: Locale) {
  const i18n = getI18n(locale, i18nsDeleteNotUsed)
  return {
    embeds: [
      {
        title: i18n.title,
        description: i18n.description
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.deleteServerNotUsedColors).data)]
  }
}
function deleteNotUsedConfirmed(locale: Locale, colorsOk: number, colorsLength: number) {
  const i18n = getI18n(locale, i18nsDeleteNotUsedConfirmed)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, {
          '{{slot0}}': colorsOk.toString(),
          '{{slot1}}': colorsLength.toString()
        })
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.linkKofi).data)]
  }
}

function deleteAsome(locale: Locale) {
  const i18n = getI18n(locale, i18nsDeleteAsome)
  return {
    embeds: [
      {
        title: i18n.title,
        description: i18n.description
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(MenuNames.settingDeleteAsomeColors).data)]
  }
}
function deleteAsomeConfirmed(locale: Locale, colorsOk: number, colorsLength: number) {
  const i18n = getI18n(locale, i18nsDeleteAsomeConfirmed)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, {
          '{{slot0}}': colorsOk.toString(),
          '{{slot1}}': colorsLength.toString()
        })
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.linkKofi).data)]
  }
}

export default {
  deleteAll,
  deleteAllConfirmed,
  deleteAsome,
  deleteAsomeConfirmed,
  deleteNotUsed,
  deleteNotUsedConfirmed
}
