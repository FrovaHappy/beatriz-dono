import { readColors, deleteColors, insertColors, updateColorSetting } from './queries/colors'

export default {
  colors: {
    read: readColors,
    delete: deleteColors,
    insert: insertColors,
    update: updateColorSetting
  }
}
