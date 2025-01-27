import { readColors, deleteColors, createColors } from './queries/colors'

export default {
  colors: {
    read: readColors,
    create: createColors,
    delete: deleteColors
  }
}