import { type Canvas } from '@/types/Canvas.types'

const WELCOME: Canvas = {
  height: 250,
  width: 500,
  color: undefined,
  layers: [
    {
      id: 0,
      type: 'image',
      x: 0,
      y: 0,
      height: 250,
      width: 500,
      img: 'https://imgur.com/6p5IsJY.png'
    },
    {
      id: 1,
      type: 'icon',
      height: 100,
      width: 100,
      color: undefined,
      x: 365,
      y: 60,
      shape: 'circle'
    },
    {
      id: 2,
      type: 'image',
      x: 100,
      y: 33,
      height: 217,
      width: 400,
      img: 'https://imgur.com/5ZHN41E.png'
    },
    {
      id: 3,
      type: 'image',
      x: 360,
      y: 55,
      height: 112,
      width: 112,
      img: 'https://imgur.com/uswdO0J.png'
    },
    {
      id: 4,
      type: 'image',
      x: 10,
      y: 10,
      height: 155,
      width: 200,
      img: 'https://imgur.com/uo2L5PS.png'
    },
    {
      id: 5,
      x: 350,
      y: 80,
      type: 'text',
      color: '#E54554',
      size: 36,
      family: 'Inter',
      weight: 900,
      align: 'end',
      limitLetters: 300,
      baseline: 'top',
      content: '<user_name>'
    },
    {
      id: 7,
      x: 260,
      y: 60,
      type: 'text',
      size: 20,
      color: '#651D24',
      family: 'Karla Italic',
      weight: 600,
      align: 'start',
      limitLetters: 0,
      baseline: 'top',
      content: 'Bienvenido'
    }
  ]
}

export default WELCOME
