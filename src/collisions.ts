import type { Container } from 'pixi.js'
import { getGlobalPosition } from './core'
import { getHeight, getWidth } from './helpers'

export const isColliding = (
  displayObject: Container,
  otherDisplayObject: Container,
): boolean => {
  const { x: entityX, y: entityY } = getGlobalPosition(displayObject)

  const entityWidth = getWidth(displayObject)
  const entityHeight = getHeight(displayObject)

  const { x: otherEntityX, y: otherEntityY } =
    getGlobalPosition(otherDisplayObject)

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
  displayObject: Container,
  otherDisplayObject: Container,
): number => {
  if (!isColliding(displayObject, otherDisplayObject)) {
    return 0
  }

  const { x: entityX, y: entityY } = getGlobalPosition(displayObject)

  const entityWidth = getWidth(displayObject)
  const entityHeight = getHeight(displayObject)

  const { x: otherEntityX, y: otherEntityY } =
    getGlobalPosition(otherDisplayObject)

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
