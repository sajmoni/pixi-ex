import {
  type Application,
  type Container,
  type DisplayObject,
  type Graphics,
  type Texture,
  type Renderer,
  Assets,
} from 'pixi.js'
import { Point } from 'pixi.js'
import { text } from './constructors'

import { getAllChildren, getHeight, getWidth } from './helpers'
import { getCells } from './internal'

let _app: Application | { stage: Container; renderer: Renderer }
let ratio = 1
let gameWidth: number
let gameHeight: number
const textureMap: Record<string, Texture> = {}
const textureIds: string[] = []

export const init = (
  app: Application | { stage: Container; renderer: Renderer },
): void => {
  gameWidth = app.renderer.width
  gameHeight = app.renderer.height

  _app = app
}

export const loadAssets = async (key: string): Promise<void> => {
  const spritesheet = await Assets.load(key)
  for (const [key, texture] of Object.entries(spritesheet.textures)) {
    textureIds.push(key)
    textureMap[key] = texture as Texture
  }
}

export const getAllTextureIds = (): string[] => {
  return textureIds
}

export const getTexture = (filename: string): Texture => {
  const texture = textureMap[filename]

  if (!texture) {
    throw new Error(`pixi-ex: Texture "${filename}" could not be retrieved`)
  }

  return texture
}

export const getTextures = (filenames: string[]): Texture[] => {
  let textures = []

  for (const filename of filenames) {
    textures.push(getTexture(filename))
  }

  return textures
}

const throwErrorIfNoInit = () => {
  if (!_app) {
    throw new Error('pixi-ex: init has not been called')
  }
}

/**
 * Resize the stage and maintain good text quality
 */
export const resize = (width: number, height: number): void => {
  throwErrorIfNoInit()

  ratio = Math.min(width / gameWidth, height / gameHeight)

  _app.stage.scale.set(ratio)

  _app.renderer.resize(gameWidth * ratio, gameHeight * ratio)

  /*
      The following code is needed to counteract the scale change on the whole canvas since
      texts get distorted by PIXI when you try to change their scale.
      Texts instead change size by setting their fontSize.
    */
  getAllChildren(_app.stage)
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
  container: Container,
  graphics: Graphics,
): renderFn => {
  throwErrorIfNoInit()

  graphics.name = 'pixi-ex: drawHitArea'
  _app.stage.addChild(graphics)

  const render = () => {
    // @ts-expect-error
    if (!container._destroyed) {
      const width = getWidth(container)
      const height = getHeight(container)

      const { x, y } = getGlobalPosition(container)

      graphics.clear().lineStyle(2, 0xffffff, 1).drawRect(x, y, width, height)
    }
  }

  return render
}

// * Make game fullscreen and resize when window is resized
export const useAutoFullScreen = (onChange?: () => void): void => {
  const resizeGame = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    resize(screenWidth, screenHeight)
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
export const showGrid = (graphics: Graphics, numberOfCells = 2): void => {
  throwErrorIfNoInit()

  const { resolution, width, height } = _app.renderer
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

export const showMousePosition = (container: Container) => {
  throwErrorIfNoInit()

  const _text = text(container, { fontSize: 16, fill: 'white' })
  const { resolution } = _app.renderer

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
