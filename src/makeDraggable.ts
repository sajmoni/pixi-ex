import type { DisplayObject, InteractionEvent } from 'pixi.js'

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
  displayObject: DisplayObject,
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

const onMoveInternal =
  (
    displayObject: DisplayObject,
    onMove: (position: Position) => void,
    disabler: () => boolean,
  ) =>
  () => {
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

const onStartInternal =
  (
    displayObject: DisplayObject,
    onStart: (position: Position) => void,
    disabler: () => boolean,
  ) =>
  (event: InteractionEvent) => {
    if (disabler()) {
      return
    }

    // * This will probably break typechecking
    // @ts-expect-error
    displayObject.dragData = event.data
    // @ts-expect-error
    displayObject.dragging = true

    // @ts-expect-error
    const { x, y } = displayObject.dragData.getLocalPosition(
      displayObject.parent,
    )

    onStart({ x, y })
  }

const onEndInternal =
  (
    displayObject: DisplayObject,
    onEnd: (position: Position) => void,
    disabler: () => boolean,
  ) =>
  () => {
    // @ts-expect-error
    if (disabler() || !displayObject.dragData) {
      return
    }

    // @ts-expect-error
    const { x, y } = displayObject.dragData.getLocalPosition(
      displayObject.parent,
    )

    onEnd({ x, y })

    // @ts-expect-error
    displayObject.dragging = false
    // @ts-expect-error
    displayObject.dragData = null
  }
