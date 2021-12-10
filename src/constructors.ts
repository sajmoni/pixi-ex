import {
  AnimatedSprite,
  Container,
  Graphics,
  ITextStyle,
  Rectangle,
  Sprite,
  TextStyle,
  Text,
  Texture,
} from 'pixi.js'

import { makeResizable } from './modifiers'

export const sprite = (parent: Container, texture?: Texture): Sprite => {
  const s = new Sprite(texture ?? Texture.EMPTY)

  s.anchor.set(0.5)

  parent.addChild(s)

  return s
}

export const animatedSprite = (
  parent: Container,
  textures?: Texture[],
): AnimatedSprite => {
  const a = new AnimatedSprite(
    textures && textures.length > 0 ? textures : [Texture.EMPTY],
  )

  a.anchor.set(0.5)
  a.animationSpeed = 0.02
  a.play()

  parent.addChild(a)

  return a
}

export const text = (
  parent: Container,
  textStyle: Partial<ITextStyle>,
  textContent?: string,
): Text => {
  const t = new Text(textContent ?? '')

  t.style = new TextStyle(textStyle)

  parent.addChild(t)

  makeResizable(t)

  t.anchor.set(0.5)

  return t
}

export const container = (parent: Container): Container => {
  const c = new Container()
  parent.addChild(c)
  return c
}

export const graphics = (parent: Container): Graphics => {
  const g = new Graphics()
  parent.addChild(g)
  return g
}

/**
 * Create a Rectangle from an object with x, y, width and height
 */
export const rectangle = (rectangle: {
  x: number
  y: number
  width: number
  height: number
}) => {
  return new Rectangle(
    rectangle.x,
    rectangle.y,
    rectangle.width,
    rectangle.height,
  )
}
