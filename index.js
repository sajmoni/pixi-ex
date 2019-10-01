import 'core-js/es/array/flat-map'

let _app
let ratio = 1
let gameWidth
let gameHeight

export const init = (app) => {
  gameWidth = app.renderer.width
  gameHeight = app.renderer.height

  _app = app
}

const throwErrorIfNoInit = () => {
  if (!_app) {
    throw new Error('ex.init has not been called')
  }
}

export const getTexture = (filename) => {
  throwErrorIfNoInit()

  try {
    const texture = Object
      .values(_app.loader.resources)
      .filter((resource) => resource.textures)
      .flatMap((resource) => Object.entries(resource.textures))
      .find(([key]) => key === `${filename}.png`)

    return texture[1]
  } catch (error) {
    throw new Error(`pixi-ex: Texture "${filename}" could not be retrieved: ${error}`)
  }
}

export const getAllTextureIds = () => {
  if (!_app) {
    throw new Error('ex.init has not been called')
  }
  return Object
    .values(_app.loader.resources)
    .filter((resource) => resource.textures)
    .flatMap((resource) => Object.keys(resource.textures))
    .map((key) => key.substring(0, key.length - 4))
}

export const getAllChildren = (displayObject) => {
  if (displayObject.children.length) {
    return displayObject.children
      .flatMap(getAllChildren)
      .concat(displayObject)
  }
  return [displayObject]
}

export const resize = (width, height) => {
  ratio = Math.min(
    width / gameWidth,
    height / gameHeight,
  )

  _app
    .stage
    .scale
    .set(ratio)

  _app
    .renderer
    .resize(
      gameWidth * ratio,
      gameHeight * ratio,
    )

  /*
      The following code is needed to counteract the scale change on the whole canvas since
      texts get distorted by PIXI when you try to change their scale.
      Texts instead change size by setting their fontSize.
    */
  getAllChildren(_app.stage)
    // Keep if resizable text object
    .filter((c) => c.originalFontSize)
    .forEach((displayObject) => {
      // eslint-disable-next-line no-param-reassign
      displayObject.style.fontSize = displayObject.originalFontSize * ratio
      displayObject.scale.set(1 / ratio)
    })
}

export const makeResizable = (textObject) => {
  // This will probably break typechecking
  // eslint-disable-next-line no-param-reassign
  textObject.originalFontSize = textObject.style.fontSize
  // eslint-disable-next-line no-param-reassign
  textObject.style = {
    ...textObject.style,
    fontSize: textObject.style.fontSize * ratio,
  }
  textObject.scale.set(1 / ratio)
}

// makeDraggable
const startEvents = [
  'mousedown',
  'touchstart',
]

const endEvents = [
  'pointerup',
  'pointerupoutside',
]

const moveEvents = [
  'pointermove',
]

const noop = () => {}

export const makeDraggable = (displayObject, options = {}) => {
  const {
    onDragStart = noop,
    onDragEnd = noop,
    onDragMove = noop,
    disabler = () => false,
  } = options

  // eslint-disable-next-line no-param-reassign
  displayObject.interactive = true

  startEvents.forEach((event) => {
    displayObject.on(event, onDragStartInternal(displayObject, onDragStart, disabler))
  })

  endEvents.forEach((event) => {
    displayObject.on(event, onDragEndInternal(displayObject, onDragEnd, disabler))
  })

  moveEvents.forEach((event) => {
    displayObject.on(event, onDragMoveInternal(displayObject, onDragMove, disabler))
  })
}

const onDragMoveInternal = (displayObject, onDragMove, disabler) => () => {
  if (disabler()) {
    return
  }

  if (displayObject.dragging) {
    const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)
    onDragMove({ x, y })
  }
}

const onDragStartInternal = (displayObject, onDragStart, disabler) => (event) => {
  if (disabler()) {
    return
  }

  // This will probably break typechecking
  // eslint-disable-next-line no-param-reassign
  displayObject.dragData = event.data
  // eslint-disable-next-line no-param-reassign
  displayObject.dragging = true

  const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)

  onDragStart({ x, y })
}

const onDragEndInternal = (displayObject, onDragEnd, disabler) => () => {
  if (disabler() || !displayObject.dragData) {
    return
  }

  const { x, y } = displayObject.dragData.getLocalPosition(displayObject.parent)

  onDragEnd({ x, y })

  // eslint-disable-next-line no-param-reassign
  displayObject.dragging = false
  // eslint-disable-next-line no-param-reassign
  displayObject.dragData = null
}

// makeDraggable end

const CLICK_EVENTS = ['click', 'tap']

export const makeClickable = (displayObject, onClick) => {
  // eslint-disable-next-line no-param-reassign
  displayObject.interactive = true
  // eslint-disable-next-line no-param-reassign
  displayObject.cursor = 'pointer'

  CLICK_EVENTS.forEach((event) => {
    displayObject.on(event, () => {
      // eslint-disable-next-line no-param-reassign
      displayObject.cursor = 'default'
      onClick()
    })
  })
}

export const getGameScale = () => ratio

// Convert #ff00ff to 0xff00ff
export const fromHex = (color) => `0x${color.substring(1, color.length)}`

export const getGlobalPosition = (displayObject) => {
  const global = displayObject.toGlobal({ x: 0, y: 0 })

  return {
    x: global.x / ratio,
    y: global.y / ratio,
  }
}

const getWidth = (displayObject) => (displayObject.hitArea && displayObject.hitArea.width)
  || displayObject.width
const getHeight = (displayObject) => (displayObject.hitArea && displayObject.hitArea.height)
  || displayObject.height

export const isColliding = (displayObject, otherDisplayObject) => {
  const {
    x: entityX,
    y: entityY,
  } = getGlobalPosition(displayObject)

  const entityWidth = getWidth(displayObject)
  const entityHeight = getHeight(displayObject)

  const {
    x: otherEntityX,
    y: otherEntityY,
  } = getGlobalPosition(otherDisplayObject)

  const otherEntityWidth = getWidth(otherDisplayObject)
  const otherEntityHeight = getHeight(otherDisplayObject)

  return (entityX + entityWidth >= otherEntityX
    && otherEntityX + otherEntityWidth >= entityX
    && entityY + entityHeight >= otherEntityY
    && otherEntityY + otherEntityHeight >= entityY)
}

export const getOverlappingArea = (displayObject, otherDisplayObject) => {
  if (!isColliding(displayObject, otherDisplayObject)) {
    return 0
  }

  const {
    x: entityX,
    y: entityY,
  } = getGlobalPosition(displayObject)

  const entityWidth = getWidth(displayObject)
  const entityHeight = getHeight(displayObject)

  const {
    x: otherEntityX,
    y: otherEntityY,
  } = getGlobalPosition(otherDisplayObject)

  const otherEntityWidth = getWidth(otherDisplayObject)
  const otherEntityHeight = getHeight(otherDisplayObject)

  const minX = Math.max(entityX, otherEntityX)
  const maxX = Math.min(entityX + entityWidth, otherEntityX + otherEntityWidth)
  const dX = maxX - minX

  const minY = Math.max(entityY, otherEntityY)
  const maxY = Math.min(entityY + entityHeight, otherEntityY + otherEntityHeight)
  const dY = maxY - minY

  return dX * dY
}

export const drawHitArea = (graphics) => {
  if (!_app) {
    throw new Error('ex.init has not been called')
  }

  // eslint-disable-next-line no-param-reassign
  graphics.name = 'pixi-ex: drawHitArea'
  _app.stage.addChild(graphics)

  // Needs to be called each game update
  const render = (displayObject) => {
    if (!displayObject._destroyed) {
      const width = getWidth(displayObject)
      const height = getHeight(displayObject)

      const { x, y } = getGlobalPosition(displayObject, ratio)

      // TODO: use drawRect
      graphics
        .clear()
        .lineStyle(2, 0xFFFFFF, 1)
        .moveTo(x, y)
        .lineTo(x + width, y)
        .lineTo(x + width, y + height)
        .lineTo(x, y + height)
        .lineTo(x, y)
    }
  }
  return render
}
