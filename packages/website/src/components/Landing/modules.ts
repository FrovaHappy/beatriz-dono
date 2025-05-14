// {{string}}: add color secondary to the text
interface Module {
  title: string
  icon: string
  status: string[]
  features: {
    icon: 'slash' | 'hand' | 'web'
    title: string
    description: string
    link: {
      url: string
      text: string
    }
  }[]
}

const mod: Module[] = [
  {
    title: 'Personaliza tu Usuario 🔥',
    icon: '/assets/modules/color.svg',
    status: ['estado al 97%', 'herramienta web al 0%'],
    features: [
      {
        icon: 'slash',
        title: 'colors {{<custom>}}',
        description:
          'Elige un color en específico para cambiarlo en tu nombre, solo debes pasarlo un valor hexadecimal y el bot lo cambia por ti. ',
        link: {
          url: '/modules/colors',
          text: 'leer más sobre {{/colors}}'
        }
      },
      {
        icon: 'hand',
        title: 'Selección Automática',
        description: 'Que mejor manera de combinar que con el color de tu foto de perfil.',
        link: {
          url: '/modules/colors',
          text: 'leer más sobre {{/colors}}'
        }
      }
    ]
  }
]
export default mod
