import { Container, DisplayObject, Graphics, Rectangle } from 'pixi.js'

/**
 * A beginFill function that also calls clear
 */
export const beginFill = (graphics: Graphics, color: number): Graphics => {
  graphics.clear()
  graphics.beginFill(color)
  return graphics
}

/**
 * Removes the need to access the x and y properties of a position
 */
export const setPosition = (
  displayObject: Container,
  position: { x: number; y: number },
): void => {
  displayObject.position.set(position.x, position.y)
}

/**
 * Use hitArea width if it exists
 */
export const getWidth = (displayObject: Container): number =>
  // * This will break if hitArea is anything else than PIXI.Rectangle
  // @ts-expect-error
  displayObject?.hitArea?.width ?? displayObject.width

/**
 * Use hitArea height if it exists
 */
export const getHeight = (displayObject: Container): number =>
  // * This will break if hitArea is anything else than PIXI.Rectangle
  // @ts-expect-error
  displayObject?.hitArea?.height ?? displayObject.height

export const centerX = (container: Container, xPosition: number): void => {
  container.x = xPosition
  container.pivot.x = container.width / 2
}

export const centerY = (container: Container, yPosition: number): void => {
  container.y = yPosition
  container.pivot.y = container.height / 2
}

/**
 * Recursively get all children of a PIXI.DisplayObject
 * @param container
 * @returns
 */
export const getAllChildren = (container: DisplayObject): DisplayObject[] => {
  if (container instanceof Container) {
    return container.children
      .flatMap((child) => getAllChildren(child))
      .concat(container)
  }

  return [container]
}

/**
 * A draw rect function that actually takes a rect
 */
export const drawRect = (
  graphics: Graphics,
  rectangle:
    | Rectangle
    | { x: number; y: number; width: number; height: number },
): Graphics => {
  graphics.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
  return graphics
}
