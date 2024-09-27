export type Colors = Array<{
  name: string
  hexColor: `#${string}`
}>
const COLORS: Colors = [
  {
    name: 'black',
    hexColor: '#000001'
  },
  {
    name: 'red',
    hexColor: '#ff0000'
  },
  {
    name: 'green',
    hexColor: '#00ff00'
  },
  {
    name: 'blue',
    hexColor: '#0000ff'
  },
  {
    name: 'yellow',
    hexColor: '#ffff00'
  },
  {
    name: 'magenta',
    hexColor: '#ff00ff'
  },
  {
    name: 'cloud',
    hexColor: '#00ffff'
  }
]

export default COLORS
