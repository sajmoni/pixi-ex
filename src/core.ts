import type {
  Application,
  Container,
  DisplayObject,
  Graphics,
  Loader,
  Renderer,
  Texture,
} from 'pixi.js'
import { Point } from 'pixi.js'

import { getAllChildren, getHeight, getWidth } from './helpers'
import { getCells } from './internal'

let _app: App | Application
let ratio = 1
let gameWidth: number
let gameHeight: number
const textureMap: Record<string, Texture> = {}
const textureIds: string[] = []

type App = {
  readonly renderer: Renderer
  readonly stage: Container
  readonly loader: Loader
}

const extractTextures = (app: App | Application): void => {
  const textureEntries: Array<[string, Texture]> = Object.values(
    app.loader.resources,
  ).flatMap((resource) =>
    resource.textures ? Object.entries(resource.textures) : [],
  )

  textureEntries.forEach(([key, texture]) => {
    textureIds.push(key)

    if (textureMap[key]) {
      throw new Error(
        `pixi-ex: Duplicate texture name found: ${key}. Texture names need to be unique`,
      )
    } else {
      textureMap[key] = texture
    }
  })
}

export const init = (app: App | Application): void => {
  gameWidth = app.renderer.width
  gameHeight = app.renderer.height

  _app = app

  const noTexturesFound =
    Object.values(_app.loader.resources).filter((resource) => resource.textures)
      .length === 0

  if (noTexturesFound) {
    console.warn(
      'pixi-ex: No textures found! init needs to be called after resources have been loaded.',
    )
  } else {
    extractTextures(app)
  }
}

const throwErrorIfNoInit = () => {
  if (!_app) {
    throw new Error('pixi-ex: init has not been called')
  }
}

export const getTexture = (filename: string): Texture => {
  throwErrorIfNoInit()

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

export const getAllTextureIds = (): string[] => {
  throwErrorIfNoInit()

  return textureIds
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
