import type { MessageOptions } from '@/types/main'
import { Colors, type Locale } from 'discord.js'

export default function colorsCastNoFound(locale: Locale): MessageOptions {
  return {
    embeds: [
      {
        title: 'No se pudo encontrar el color',
        description: 'Por favor, revisa tu imagen de perfil',
        color: Colors.Red
      }
    ]
  }
}