import type { Canvas } from './schema.welcome.v1'

export default {
  version: '1',
  title: 'default',
  h: 200,
  w: 200,
  layerCastColor: '2',
  layers: [
    {
      type: 'text',
      id: '1',
      dx: 0,
      dy: 0,
      text: '{{user_name}}',
      size: 34,
      family: 'Roboto',
      color: 'auto',
      globalAlpha: 1,
      letterSpacing: 0,
      maxWidth: 50,
      weight: 400,
      align: 'start',
      baseline: 'top',
      filter: {
        blur: 2
      }
    },
    {
      type: 'shape',
      id: '2',
      dx: 0,
      dy: 0,
      dw: 100,
      dh: 100,
      image: 'https://i.pinimg.com/736x/a0/ff/c3/a0ffc3de26c59b956b758d50b2137dc5.jpg'
    }
  ]
} as Canvas