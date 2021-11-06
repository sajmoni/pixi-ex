import * as PIXI from 'pixi.js'

import { getTexture, getTextures } from './core'
import { makeResizable } from './modifiers'

// Purpose of this:
// 1. Shorter function names "new PIXI.Sprite()" -> "sprite()"
// 2. Sensible defaults
// 3. Automatically get texture
// 4. Never forget to add it to a parent again (Parent is a required argument)

export const sprite = (
  parent: PIXI.Container,
  textureName?: string,
): PIXI.Sprite => {
  const s = new PIXI.Sprite(textureName ? getTexture(textureName) : undefined)

  s.anchor.set(0.5)

  parent.addChild(s)

  return s
}

export const animatedSprite = (
  parent: PIXI.Container,
  textureNames: string[],
): PIXI.AnimatedSprite => {
  const a = new PIXI.AnimatedSprite(getTextures(textureNames))

  a.anchor.set(0.5)
  a.animationSpeed = 0.02
  a.play()

  parent.addChild(a)

  return a
}

export const text = (
  parent: PIXI.Container,
  textStyle: Partial<PIXI.ITextStyle>,
  textContent?: string,
): PIXI.Text => {
  const t = new PIXI.Text(textContent ?? '')

  t.style = new PIXI.TextStyle(textStyle)

  parent.addChild(t)

  makeResizable(t)

  t.anchor.set(0.5)

  return t
}

export const container = (parent: PIXI.Container): PIXI.Container => {
  const c = new PIXI.Container()
  parent.addChild(c)
  return c
}

export const graphics = (parent: PIXI.Container): PIXI.Graphics => {
  const g = new PIXI.Graphics()
  parent.addChild(g)
  return g
}
