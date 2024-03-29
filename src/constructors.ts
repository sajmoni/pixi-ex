import {
  AnimatedSprite,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  TextStyle,
  Text,
  Texture,
  type ITextStyle,
} from 'pixi.js'

/**
 * Create a Sprite
 */
export const sprite = (parent: Container, texture?: Texture): Sprite => {
  const s = new Sprite(texture ?? Texture.EMPTY)
  parent.addChild(s)

  return s
}

/**
 * Create an AnimatedSprite
 *
 * Auto-plays
 */
export const animatedSprite = (
  parent: Container,
  textures?: Texture[],
): AnimatedSprite => {
  const a = new AnimatedSprite(
    textures && textures.length > 0 ? textures : [Texture.EMPTY],
  )
  parent.addChild(a)

  a.animationSpeed = 0.02
  a.play()

  return a
}

/**
 * Create a Text
 */
export const text = (
  parent: Container,
  textStyle: Partial<ITextStyle>,
  textContent?: string,
): Text => {
  const t = new Text(textContent ?? '')
  parent.addChild(t)

  t.style = new TextStyle(textStyle)

  return t
}

/**
 * Create a Container
 */
export const container = (parent: Container): Container => {
  const c = new Container()
  parent.addChild(c)

  return c
}

/**
 * Create a Graphics object
 */
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
