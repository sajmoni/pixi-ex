import * as PIXI from 'pixi.js'

let _app: App
let ratio = 1
let gameWidth: number
let gameHeight: number
const textureMap: Record<string, PIXI.Texture> = {}
const textureIds: string[] = []

type App = {
  readonly renderer: PIXI.Renderer
  readonly stage: PIXI.Container
  readonly loader: PIXI.Loader
}

const extractTextures = (app: App | PIXI.Application): void => {
  const textureEntries: Array<[string, PIXI.Texture]> = Object.values(
    app.loader.resources,
  ).flatMap((resource) =>
    resource.textures ? Object.entries(resource.textures) : [],
  )

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

export const getAllChildren = (
  container: PIXI.DisplayObject,
): PIXI.DisplayObject[] => {
  if (container instanceof PIXI.Container) {
    return container.children
      .flatMap((child) => getAllChildren(child))
      .concat(container)
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
    .forEach((resizableTextObject: any) => {
      resizableTextObject.style.fontSize =
        resizableTextObject.originalFontSize * ratio
      resizableTextObject.scale.set(
        resizableTextObject.originalScale.x / ratio,
        resizableTextObject.originalScale.y / ratio,
      )
    })
}

export const makeResizable = (textObject: PIXI.Text): void => {
  // * This will break typechecking
  // @ts-expect-error
  textObject.originalFontSize = textObject.style.fontSize
  // @ts-expect-error
  textObject.originalScale = { x: textObject.scale.x, y: textObject.scale.y }
  textObject.style = {
    ...textObject.style,
    fontSize: textObject.style.fontSize * ratio,
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
  onStart?: (position: Position) => void
  onEnd?: (position: Position) => void
  onMove?: (position: Position) => void
  disabler?: () => boolean
}

export const makeDraggable = (
  displayObject: PIXI.DisplayObject,
  options: DraggableOptions = {},
): void => {
  const {
    onStart = noop,
    onEnd = noop,
    onMove = noop,
    disabler = () => false,
  } = options

  displayObject.interactive = true

  startEvents.forEach((event) => {
    displayObject.on(event, onStartInternal(displayObject, onStart, disabler))
  })

  endEvents.forEach((event) => {
    displayObject.on(event, onEndInternal(displayObject, onEnd, disabler))
  })

  moveEvents.forEach((event) => {
    displayObject.on(event, onMoveInternal(displayObject, onMove, disabler))
  })
}

const onMoveInternal = (
  displayObject: PIXI.DisplayObject,
  onMove: (position: Position) => void,
  disabler: () => boolean,
) => () => {
  if (disabler()) {
    return
  }

  // @ts-expect-error
  if (displayObject.dragging) {
    // @ts-expect-error
    const { x, y } = displayObject.dragData.getLocalPosition(
      displayObject.parent,
    )
    onMove({ x, y })
  }
}

const onStartInternal = (
  displayObject: PIXI.DisplayObject,
  onStart: (position: Position) => void,
  disabler: () => boolean,
) => (event: PIXI.InteractionEvent) => {
  if (disabler()) {
    return
  }

  // * This will probably break typechecking
  // @ts-expect-error
  displayObject.dragData = event.data
  // @ts-expect-error
  displayObject.dragging = true

  // @ts-expect-error
  const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)

  onStart({ x, y })
}

const onEndInternal = (
  displayObject: PIXI.DisplayObject,
  onEnd: (position: Position) => void,
  disabler: () => boolean,
) => () => {
  // @ts-expect-error
  if (disabler() || !displayObject.dragData) {
    return
  }

  // @ts-expect-error
  const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)

  onEnd({ x, y })

  // @ts-expect-error
  displayObject.dragging = false
  // @ts-expect-error
  displayObject.dragData = null
}

// * makeDraggable end

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

export const getGameScale = (): number => ratio

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
  // * This will break if hitArea is anything else than PIXI.Rectangle
  // @ts-expect-error
  displayObject?.hitArea?.width || displayObject.width

const getHeight = (displayObject: PIXI.Container): number =>
  // * This will break if hitArea is anything else than PIXI.Rectangle
  // @ts-expect-error
  displayObject?.hitArea?.height || displayObject.height

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

/**
 * Show a grid overlay to help with positioning.
 * You have to add the graphics object to the stage yourself.
 * Does not work if the screen has been resized
 */
export const showGrid = ({
  numberOfCells = 2,
  color = 0xffffff,
  graphics,
}: {
  numberOfCells: number
  color: number
  graphics: PIXI.Graphics
}): void => {
  throwErrorIfNoInit()

  graphics.clear().lineStyle(2, color, 1)

  const width = _app.renderer.width / numberOfCells
  const height = _app.renderer.height / numberOfCells

  for (let x = 0; x < numberOfCells; x++) {
    for (let y = 0; y < numberOfCells; y++) {
      graphics.drawRect(x * width, y * height, width, height)
    }
  }
}
