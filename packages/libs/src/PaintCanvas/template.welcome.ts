import type { Canvas } from './schema.welcome.v1'
export default {
  version: '1',
  title: 'default',
  h: 400,
  w: 400,
  layerCastColor: '2',
  bgColor: '#fff',
  layers: [
    {
      type: 'text',
      id: '1',
      dx: 100,
      dy: 180,
      text: '{{user_name}}',
      size: 34,
      family: 'Dancing Script',
      color: '#000',
      globalAlpha: 1,
      letterSpacing: 0,
      maxWidth: 200,
      weight: 400,
      align: 'center',
      baseline: 'middle',
      filter: {
        dropShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 10,
          color: '#000'
        }
      }
    },
    {
      type: 'shape',
      id: '3',
      dx: 50,
      dy: 50,
      dw: 300,
      dh: 300,
      image: 'https://imgur.com/tv2lwL6.png',
      color: '#f00',
      clip: {
        d: 'M -0.61302203,6.4231086 H 179.38698 V 186.42311 H -0.61302203 Z',
        h: 180,
        w: 180,
        align: 'top'
      },
      filter: {
        grayscale: 100,
        opacity: 80,
        dropShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 20,
          color: '#000'
        }
      }
    },
    {
      type: 'text',
      id: '4',
      dx: 200,
      dy: 200,
      text: '+',
      size: 34,
      family: 'Dancing Script',
      color: '#000',
      globalAlpha: 1,
      letterSpacing: 0,
      maxWidth: 200,
      weight: 400,
      align: 'center',
      baseline: 'middle',
      filter: {
        dropShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 10,
          color: '#000'
        }
      }
    }
  ]
} as Canvas