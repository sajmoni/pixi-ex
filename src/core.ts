import {
  IRenderer,
  type Application,
  type Container,
  type DisplayObject,
  type Graphics,
  type Renderer,
} from 'pixi.js'
import { Point } from 'pixi.js'
import { text } from './constructors'

import { getAllChildren, getHeight, getWidth } from './helpers'
import { getCells } from './internal'

export type App =
  | Application
  | { stage: Container; renderer: Renderer | IRenderer }
let ratio = 1

/**
 * Resize the stage and maintain good text quality
 */
export const resize = (app: App, width: number, height: number): void => {
  const gameWidth = app.renderer.width
  const gameHeight = app.renderer.height

  ratio = Math.min(width / gameWidth, height / gameHeight)

  app.stage.scale.set(ratio)

  app.renderer.resize(gameWidth * ratio, gameHeight * ratio)

  /*
      The following code is needed to counteract the scale change on the whole canvas since
      texts get distorted by PIXI when you try to change their scale.
      Texts instead change size by setting their fontSize.
    */
  getAllChildren(app.stage)
    // * Keep if resizable text object
    .filter((child: any) => child.originalFontSize)
    .forEach((resizableTextObject: any) => {
      resizableTextObject.style.fontSize =
        resizableTextObject.originalFontSize * ratio

      resizableTextObject.scale.set(
        resizableTextObject.originalScale.x / ratio,
        resizableTextObject.originalScale.y / ratio,
      )
    })
}

export const getGameScale = (): number => ratio

type renderFn = () => void

export const drawHitArea = (
  stage: Container,
  object: Container,
  graphics: Graphics,
): renderFn => {
  graphics.name = 'pixi-ex: drawHitArea'
  stage.addChild(graphics)

  const render = () => {
    // @ts-expect-error
    if (!object._destroyed) {
      const width = getWidth(object)
      const height = getHeight(object)

      const { x, y } = getGlobalPosition(object)

      graphics.clear().lineStyle(2, 0xffffff, 1).drawRect(x, y, width, height)
    }
  }

  return render
}

// * Make game fullscreen and resize when window is resized
export const useAutoFullScreen = (app: App, onChange?: () => void): void => {
  const resizeGame = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    resize(app, screenWidth, screenHeight)
    if (onChange) {
      onChange()
    }
  }

  window.addEventListener('resize', resizeGame)
  resizeGame()
}

/**
 * Show a grid overlay to help with positioning.
 * You have to add the graphics object to the stage yourself.
 * Does not work if the screen has been resized
 *
 * Set the lineStyle before passing in the graphics object.
 */
export const showGrid = (
  renderer: Renderer | IRenderer,
  graphics: Graphics,
  numberOfCells = 2,
): void => {
  const { resolution, width, height } = renderer
  const cells = getCells({
    resolution,
    width,
    height,
    numberOfCells,
    scale: ratio,
  })

  for (const { x, y, width, height } of cells) {
    graphics.drawRect(x, y, width, height)
  }
}

export const getGlobalPosition = (
  displayObject: DisplayObject,
): { x: number; y: number } => {
  const global = displayObject.toGlobal(new Point(0, 0))
  const ratio = getGameScale()

  return {
    x: global.x / ratio,
    y: global.y / ratio,
  }
}

export const showMousePosition = (
  renderer: Renderer | IRenderer,
  container: Container,
) => {
  const _text = text(container, { fontSize: 16, fill: 'white' })
  const { resolution } = renderer

  container.interactive = true
  container.on('mousemove', (event) => {
    const {
      data: {
        global: { x, y },
      },
    } = event

    const scale = getGameScale()
    _text.position.set(x / resolution / scale + 20, y / resolution / scale + 5)
    _text.text = `x: ${x.toFixed(2)}
y: ${y.toFixed(2)}`
  })
}
