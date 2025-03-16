interface Modules {
  title: string
  description: string
  image: string
  status: 'complete' | 'in progress' | 'planned'
  link: {
    url: string
    text: string
  }
}

const mod: Modules[] = [
  {
    title: 'Colores Infinitos',
    description: 'Personaliza tu nombre con cualquier color, puedes usar cualquier color que te lo cambio.',
    image: '/assets/feature_color.webp',
    status: 'complete',
    link: {
      url: '/modules/colors',
      text: 'como personalizar los nombres?'
    }
  },
  {
    title: 'Bienvenidas Únicas',
    description:
      'Personaliza tus mensajes de bienvenida con un sistema que te permite personalizar como quieras, el limite es el cielo.',
    image: '/assets/feature_canvas.webp',
    status: 'in progress',
    link: {
      url: '/build-canvas/beforeofstart',
      text: 'Como crear un canvas?'
    }
  },
  {
    title: 'Sistema de Ranking',
    description: 'Impulsa la actividad de tu servidor, con un ranking que te permite ver quién es el mejor.',
    image: '/assets/feature_ranking.webp',
    status: 'planned',
    link: {
      url: '/modules/ranking',
      text: 'Como crear un canvas?'
    }
  }
]
export default mod
