import * as PIXI from 'pixi.js'

/**
 * After clearing you need to set beginFill again. This can be easy to miss
 * so therefore I combined them into one call
 */
export const prepareFill = (graphics: PIXI.Graphics, color: number): void => {
  graphics.clear()
  graphics.beginFill(color)
}

export const setPosition = (
  displayObject: PIXI.DisplayObject,
  position: { x: number; y: number },
) => {
  displayObject.position.set(position.x, position.y)
}

/**
 * Use hitArea width if it exists
 */
export const getWidth = (displayObject: PIXI.Container): number =>
  // * This will break if hitArea is anything else than PIXI.Rectangle
  // @ts-expect-error
  displayObject?.hitArea?.width || displayObject.width

/**
 * Use hitArea height if it exists
 */
export const getHeight = (displayObject: PIXI.Container): number =>
  // * This will break if hitArea is anything else than PIXI.Rectangle
  // @ts-expect-error
  displayObject?.hitArea?.height || displayObject.height

export const centerX = (container: PIXI.Container, xPosition: number): void => {
  container.x = xPosition
  container.pivot.x = container.width / 2
}

export const centerY = (container: PIXI.Container, yPosition: number): void => {
  container.y = yPosition
  container.pivot.y = container.height / 2
}

/**
 * Recursively get all children of a PIXI.DisplayObject
 * @param container
 * @returns
 */
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
