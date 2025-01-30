import { readColors, deleteColors, createColors, updateColors } from './queries/colors'

export default {
  colors: {
    read: readColors,
    create: createColors,
    delete: deleteColors,
    update: updateColors
  }
}