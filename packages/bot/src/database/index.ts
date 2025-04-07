import { readCanvas, upsertCanvas } from './queries/canvas'
import { deleteColors, insertColors, readColors, updateColorSetting, readColorsSettings } from './queries/colors'
import { getGuilds, readGuild } from './queries/guild'
import { readWelcome } from './queries/welcome'

export default {
  colors: {
    read: readColors,
    delete: deleteColors,
    insert: insertColors
  },
  colorsSettings: {
    read: readColorsSettings,
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
  },
  canvas: {
    read: readCanvas,
    upsert: upsertCanvas
    // delete: deleteCanvas
  }
}
