import type { Canvas } from './schema.welcome.v1'

export default {
  version: '1',
  title: 'default',
  h: 200,
  w: 200,
  bgColor: '#f00',
  layers: [
    {
      type: 'text',
      id: '1',
      dx: 0,
      dy: 0,
      text: '{{user_name}}',
      size: 34,
      family: 'Roboto',
      color: '#000',
      globalAlpha: 1,
      letterSpacing: 0,
      maxWidth: 50,
      weight: 400,
      align: 'start',
      baseline: 'top',
      filter: {
        blur: 10
      }
    },
    {
      type: 'shape',
      id: '2',
      dx: 0,
      dy: 0,
      dw: 100,
      dh: 100,
      image: 'https://i.pinimg.com/736x/25/b6/60/25b660a41df5005c3bbb7cdcb65755b5.jpg'
    }
  ]
} as Canvas