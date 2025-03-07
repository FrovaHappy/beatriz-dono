import { deleteColors, insertColors, readColors, updateColorSetting } from './queries/colors'
import { getGuilds, readGuild } from './queries/guild'
import { readWelcome } from './queries/welcome'

export default {
  colors: {
    read: readColors,
    delete: deleteColors,
    insert: insertColors,
    update: updateColorSetting
  },
  welcome: {
    read: readWelcome
  },
  guild: {
    read: readGuild
  },
  guilds: {
    read: getGuilds
  }
}
