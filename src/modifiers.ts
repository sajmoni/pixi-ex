import * as PIXI from 'pixi.js'
import { getGameScale } from './core'

/**
 * Make it possible to resize PIXI.Text using the resize function
 */
export const makeResizable = (textObject: PIXI.Text): void => {
  const ratio = getGameScale()

  // * This will break typechecking
  // @ts-expect-error
  textObject.originalFontSize = textObject.style.fontSize
  // @ts-expect-error
  textObject.originalScale = { x: textObject.scale.x, y: textObject.scale.y }
  textObject.style = {
    ...textObject.style,
    // Pixis default font size is 26
    fontSize: textObject.style.fontSize ?? 26 * ratio,
  }
  textObject.scale.set(
    // @ts-expect-error
    textObject.originalScale.x / ratio,
    // @ts-expect-error
    textObject.originalScale.y / ratio,
  )
}

export const makeHoverable = (
  displayObject: PIXI.DisplayObject,
  options: { onOver: () => void; onOut: () => void },
) => {
  const { onOver, onOut } = options

  displayObject.interactive = true

  displayObject.on('pointerover', () => {
    onOver()
  })

  displayObject.on('pointerout', () => {
    onOut()
  })
}

const CLICK_EVENTS = ['click', 'tap']

export const makeClickable = (
  displayObject: PIXI.DisplayObject,
  onClick: (event: PIXI.InteractionEvent) => void,
): void => {
  displayObject.interactive = true
  displayObject.cursor = 'pointer'

  CLICK_EVENTS.forEach((clickEvent) => {
    displayObject.on(clickEvent, (event: PIXI.InteractionEvent) => {
      onClick(event)
    })
  })
}
