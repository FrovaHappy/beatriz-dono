import BuildCommand from '@/core/build/BuildCommand'
import { SlashCommandBuilder } from 'discord.js'
import msgShowMenu from './msg.index'
import db from '@db'


export default new BuildCommand({
  name: 'canvas',
  data: new SlashCommandBuilder()
    .setDescription('Manage the Canvas you have on your server')
    .setDescriptionLocalizations({
      'es-ES': 'Administra los Canvas que tienes en tu servidor',
      'en-US': 'Manage the Canvas you have on your server'
    }),
  execute: async e => {
    const { locale, guildId } = e
    const canvas = db.canvas.read(e.guildId)

    return msgShowMenu.getMessage(locale, {})
  }
})
