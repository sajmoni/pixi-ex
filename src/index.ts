// eslint-disable-next-line import/no-unassigned-import
import 'core-js/es/array/flat-map'
import * as PIXI from 'pixi.js'

let _app: App
let ratio = 1
let gameWidth: number
let gameHeight: number
const textureMap: { [key: string]: PIXI.Texture } = {}
const textureIds: string[] = []

type App = {
  readonly renderer: PIXI.Renderer
  readonly stage: PIXI.Container
  readonly loader: PIXI.Loader
}

const extractTextures = (app: App | PIXI.Application): void => {
  const textureEntries: Array<[string, PIXI.Texture]> = Object.values(
    app.loader.resources,
  )
    .filter((resource) => resource.textures)
    // @ts-ignore
    .flatMap((resource) => Object.entries(resource.textures))

  textureEntries.forEach(([key, texture]) => {
    const name = key.slice(0, -4)
    textureIds.push(name)

    if (textureMap[name]) {
      throw new Error(
        `pixi-ex: Duplicate texture name found: ${name}. Texture names need to be unique`,
      )
    } else {
      textureMap[name] = texture
    }
  })
}

export const init = (app: App | PIXI.Application): void => {
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

export const getTexture = (filename: string): PIXI.Texture => {
  throwErrorIfNoInit()

  const texture = textureMap[filename]

  if (!texture) {
    throw new Error(`pixi-ex: Texture "${filename}" could not be retrieved`)
  }

  return texture
}

export const getAllTextureIds = () => {
  throwErrorIfNoInit()

  return textureIds
}

export const getAllChildren = (container: PIXI.Container): PIXI.Container[] => {
  if (container.children.length > 0) {
    return (
      container.children
        // @ts-ignore
        .flatMap((child: PIXI.Container) => getAllChildren(child))
        .concat(container)
    )
  }

  return [container]
}

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
    .forEach((container: any) => {
      container.style.fontSize = container.originalFontSize * ratio
      container.scale.set(1 / ratio)
    })
}

export const makeResizable = (textObject: PIXI.Text): void => {
  // * This will break typechecking
  // @ts-ignore
  textObject.originalFontSize = textObject.style.fontSize
  textObject.style = {
    ...textObject.style,
    fontSize: textObject.style.fontSize * ratio,
  }
  textObject.scale.set(1 / ratio)
}

// * makeDraggable
const startEvents = ['mousedown', 'touchstart']

const endEvents = ['pointerup', 'pointerupoutside']

const moveEvents = ['pointermove']

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

type Position = {
  x: number
  y: number
}

type DraggableOptions = {
  onDragStart?: (position: Position) => void
  onDragEnd?: (position: Position) => void
  onDragMove?: (position: Position) => void
  disabler?: () => boolean
}

export const makeDraggable = (
  displayObject: PIXI.DisplayObject,
  options: DraggableOptions = {},
): void => {
  const {
    onDragStart = noop,
    onDragEnd = noop,
    onDragMove = noop,
    disabler = () => false,
  } = options

  displayObject.interactive = true

  startEvents.forEach((event) => {
    displayObject.on(
      event,
      onDragStartInternal(displayObject, onDragStart, disabler),
    )
  })

  endEvents.forEach((event) => {
    displayObject.on(
      event,
      onDragEndInternal(displayObject, onDragEnd, disabler),
    )
  })

  moveEvents.forEach((event) => {
    displayObject.on(
      event,
      onDragMoveInternal(displayObject, onDragMove, disabler),
    )
  })
}

const onDragMoveInternal = (
  displayObject: PIXI.DisplayObject,
  onDragMove: (position: Position) => void,
  disabler: () => boolean,
) => () => {
  if (disabler()) {
    return
  }

  // @ts-ignore
  if (displayObject.dragging) {
    // @ts-ignore
    const { x, y } = displayObject.dragData.getLocalPosition(
      displayObject.parent,
    )
    onDragMove({ x, y })
  }
}

const onDragStartInternal = (
  displayObject: PIXI.DisplayObject,
  onDragStart: (position: Position) => void,
  disabler: () => boolean,
) => (event: PIXI.interaction.InteractionEvent) => {
  if (disabler()) {
    return
  }

  // * This will probably break typechecking
  // @ts-ignore
  displayObject.dragData = event.data
  // @ts-ignore
  displayObject.dragging = true

  // @ts-ignore
  const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)

  onDragStart({ x, y })
}

const onDragEndInternal = (
  displayObject: PIXI.DisplayObject,
  onDragEnd: (position: Position) => void,
  disabler: () => boolean,
) => () => {
  // @ts-ignore
  if (disabler() || !displayObject.dragData) {
    return
  }

  // @ts-ignore
  const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)

  onDragEnd({ x, y })

  // @ts-ignore
  displayObject.dragging = false
  // @ts-ignore
  displayObject.dragData = null
}

// * makeDraggable end

const CLICK_EVENTS = ['click', 'tap']

export const makeClickable = (
  displayObject: PIXI.DisplayObject,
  onClick: (event: PIXI.interaction.InteractionEvent) => void,
): void => {
  displayObject.interactive = true
  displayObject.cursor = 'pointer'

  CLICK_EVENTS.forEach((clickEvent) => {
    displayObject.on(clickEvent, (event: PIXI.interaction.InteractionEvent) => {
      onClick(event)
    })
  })
}

export const getGameScale = (): number => ratio

export const fromHex = (color: string): string =>
  `0x${color.slice(1, color.length)}`

export const getGlobalPosition = (
  displayObject: PIXI.DisplayObject,
): { x: number; y: number } => {
  const global = displayObject.toGlobal(new PIXI.Point(0, 0))

  return {
    x: global.x / ratio,
    y: global.y / ratio,
  }
}

const getWidth = (displayObject: PIXI.Container): number =>
  // @ts-ignore
  (displayObject.hitArea && displayObject.hitArea.width) || displayObject.width

const getHeight = (displayObject: PIXI.Container): number =>
  // @ts-ignore
  (displayObject.hitArea && displayObject.hitArea.height) ||
  displayObject.height

export const isColliding = (
  displayObject: PIXI.Container,
  otherDisplayObject: PIXI.Container,
): boolean => {
  const { x: entityX, y: entityY } = getGlobalPosition(displayObject)

  const entityWidth = getWidth(displayObject)
  const entityHeight = getHeight(displayObject)

  const { x: otherEntityX, y: otherEntityY } = getGlobalPosition(
    otherDisplayObject,
  )

  const otherEntityWidth = getWidth(otherDisplayObject)
  const otherEntityHeight = getHeight(otherDisplayObject)

  return (
    entityX + entityWidth >= otherEntityX &&
    otherEntityX + otherEntityWidth >= entityX &&
    entityY + entityHeight >= otherEntityY &&
    otherEntityY + otherEntityHeight >= entityY
  )
}

export const getOverlappingArea = (
  displayObject: PIXI.Container,
  otherDisplayObject: PIXI.Container,
): number => {
  if (!isColliding(displayObject, otherDisplayObject)) {
    return 0
  }

  const { x: entityX, y: entityY } = getGlobalPosition(displayObject)

  const entityWidth = getWidth(displayObject)
  const entityHeight = getHeight(displayObject)

  const { x: otherEntityX, y: otherEntityY } = getGlobalPosition(
    otherDisplayObject,
  )

  const otherEntityWidth = getWidth(otherDisplayObject)
  const otherEntityHeight = getHeight(otherDisplayObject)

  const minX = Math.max(entityX, otherEntityX)
  const maxX = Math.min(entityX + entityWidth, otherEntityX + otherEntityWidth)
  const dX = maxX - minX

  const minY = Math.max(entityY, otherEntityY)
  const maxY = Math.min(
    entityY + entityHeight,
    otherEntityY + otherEntityHeight,
  )
  const dY = maxY - minY

  return dX * dY
}

type renderFn = () => void

export const drawHitArea = (
  container: PIXI.Container,
  graphics: PIXI.Graphics,
): renderFn => {
  throwErrorIfNoInit()

  graphics.name = 'pixi-ex: drawHitArea'
  _app.stage.addChild(graphics)

  const render = () => {
    // @ts-ignore
    if (!container._destroyed) {
      const width = getWidth(container)
      const height = getHeight(container)

      const { x, y } = getGlobalPosition(container)

      graphics.clear().lineStyle(2, 0xffffff, 1).drawRect(x, y, width, height)
    }
  }

  return render
}

export const centerX = (container: PIXI.Container, xPosition: number): void => {
  container.x = xPosition
  container.pivot.x = container.width / 2
}

export const centerY = (container: PIXI.Container, yPosition: number): void => {
  container.y = yPosition
  container.pivot.y = container.height / 2
}

// * Make game fullscreen and resize when window is resized
export const useAutoFullScreen = (onChange: () => void): void => {
  const resizeGame = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    resize(screenWidth, screenHeight)
    onChange()
  }

  window.addEventListener('resize', resizeGame)
  resizeGame()
}
