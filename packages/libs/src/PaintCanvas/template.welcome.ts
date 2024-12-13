import type { Canvas } from '../schemas/schema.welcome.v1'

export default {
  version: '1',
  h: 200,
  w: 200,
  bgColor: 'transparent',
  layers: [
    {
      type: 'text',
      id: '1',
      dx: 0,
      dy: 0,
      text: '{{user_name}}',
      size: 100,
      family: 'Roboto',
      color: '#000',
      globalAlpha: 1,
      letterSpacing: 0,
      maxWidth: 0,
      weight: 400,
      align: 'start',
      baseline: 'top',
      filter: {}
    },
    {
      type: 'shape',
      id: '2',
      dx: 0,
      dy: 0,
      image: 'https://i.pinimg.com/736x/25/b6/60/25b660a41df5005c3bbb7cdcb65755b5.jpg'
    }
  ]
} as Canvas