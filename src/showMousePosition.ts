import { Container } from 'pixi.js'
import { text } from './constructors'
import { getGameScale } from './core'

export const showMousePosition = (container: Container) => {
  const _text = text(container, { fontSize: 16, fill: 'white' })

  container.interactive = true
  container.on('mousemove', (event) => {
    const {
      data: {
        global: { x, y },
      },
    } = event

    const scale = getGameScale()
    _text.position.set(x / scale + 20, y / scale + 5)
    _text.text = `x: ${x.toFixed(2)}
y: ${y.toFixed(2)}`
  })
}
