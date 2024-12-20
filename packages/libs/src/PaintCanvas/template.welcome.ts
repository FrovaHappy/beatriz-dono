import type { Canvas } from './schema.welcome.v1'
export default {
  version: '1',
  title: 'default',
  h: 200,
  w: 200,
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
      dw: 100,
      dh: 100,
      image: '{{user_avatar}}',
      color: 'transparent',
      clip: {
        d: 'M98.052 31.9605C104.249 50.8415 95.2438 74.951 76.9421 88.9907C58.5435 102.934 30.8489 106.71 15.2585 95.1875C-0.331831 83.5685 -3.72104 56.4573 3.92889 35.7367C11.482 14.9192 30.171 0.49222 50.2158 0.00809229C70.3573 -0.37921 91.7578 13.1764 98.052 31.9605Z',
        h: 102,
        w: 100
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
      dx: 100,
      dy: 100,
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