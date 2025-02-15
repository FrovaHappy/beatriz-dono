import { readColors, deleteColors, insertColors, updateColorSetting } from './queries/colors'
import { readGuild } from './queries/guild'
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
  }
}
