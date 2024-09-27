export type Colors = Array<{
  label: string
  hexColor: `#${string}`
  emoji: { name: string }
}>
const COLORS: Colors = [
  {
    label: 'black',
    hexColor: '#000001',
    emoji: { name: '🖤' }
  },
  {
    label: 'red',
    hexColor: '#ff0000',
    emoji: { name: '🟥' }
  },
  {
    label: 'green',
    hexColor: '#00ff00',
    emoji: { name: '🟢' }
  },
  {
    label: 'blue',
    hexColor: '#0000ff',
    emoji: { name: '🔵' }
  },
  {
    label: 'yellow',
    hexColor: '#ffff00',
    emoji: { name: '🟡' }
  },
  {
    label: 'magenta',
    hexColor: '#ff00ff',
    emoji: { name: '🐙' }
  },
  {
    label: 'cloud',
    hexColor: '#00ffff',
    emoji: { name: '☁️' }
  }
]

export default COLORS
