import { validateCanvas } from './validate'
const data = {
  height: 100,
  width: 100,
  layers: [
    {
      type: 'icon',
      id: 5,
      color: '#ffffff',
      height: 100,
      width: 100,
      x: 0,
      y: 0,
      shape: 'circle'
    },
    {
      type: 'text',
      content: 'This is',
      x: 0,
      y: 0,
      id: 1,
      align: 'center',
      baseline: 'alphabetic',
      color: '#000000',
      family: 'Arial',
      limitLetters: 100,
      size: 20,
      weight: 1000
    }
  ]
}
describe('Canvas Validation', () => {
  it('should return undefine if the data matches the schema', () => {
    const result = validateCanvas(data)

    expect(result).toBeUndefined()
  })
  it('should return ZodError if the data does not match the schema', () => {
    data.layers[0].shape = 'star'
    const result = validateCanvas(data)
    expect(result?.issues).toHaveLength(1)
  })
})
