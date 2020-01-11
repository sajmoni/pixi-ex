import 'core-js/es/array/flat-map'

let _app
let ratio = 1
let gameWidth
let gameHeight
const textureMap = {}
const textureIds = []

const extractTextures = (app) => {
  const textureEntries = Object
    .values(app.loader.resources)
    .filter((resource) => resource.textures)
    .flatMap((resource) => Object.entries(resource.textures))

  textureEntries.forEach(([key, texture]) => {
    const name = key.substring(0, key.length - 4)
    textureIds.push(name)

    if (!textureMap[name]) {
      textureMap[name] = texture
    } else {
      throw new Error(`pixi-ex: Texture names need to be unique: ${name}`)
    }
  })
}

export const init = (app) => {
  gameWidth = app.renderer.width
  gameHeight = app.renderer.height

  _app = app

  const noTexturesFound = Object
    .values(_app.loader.resources)
    .filter((resource) => resource.textures)
    .length === 0

  if (noTexturesFound) {
    console.warn('pixi-ex: No textures found! pixi.ex needs to be called after resources have been loaded.')
  } else {
    extractTextures(app)

    console.log('textureMap', textureMap)
  }
}

const throwErrorIfNoInit = () => {
  if (!_app) {
    throw new Error('ex.init has not been called')
  }
}

export const getTexture = (filename) => {
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

export const getAllChildren = (displayObject) => {
  if (displayObject.children.length) {
    return displayObject.children
      .flatMap(getAllChildren)
      .concat(displayObject)
  }
  return [displayObject]
}

export const resize = (width, height) => {
  throwErrorIfNoInit()

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

export const drawHitArea = (displayObject, graphics) => {
  throwErrorIfNoInit()

  // eslint-disable-next-line no-param-reassign
  graphics.name = 'pixi-ex: drawHitArea'
  _app.stage.addChild(graphics)

  // Needs to be called each game update
  const render = () => {
    if (!displayObject._destroyed) {
      const width = getWidth(displayObject)
      const height = getHeight(displayObject)

      const { x, y } = getGlobalPosition(displayObject, ratio)

      graphics
        .clear()
        .lineStyle(2, 0xFFFFFF, 1)
        .drawRect(x, y, width, height)
    }
  }
  return render
}
