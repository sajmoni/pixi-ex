---
name: drawHitArea
---

# drawHitArea

```js
ex.drawHitArea(displayObject, graphics)
```

Will display the hitArea for a `PIXI.DisplayObject`, if defined. Otherwise the width and height will be used. Returns a `render` function that needs to be called on each game update.

## Arguments

`displayObject` (PIXI.DisplayObject)

`graphics` (PIXI.Graphics): Used to draw the hitBox

## Returns

A `render` function with no arguments

## Example

```js
import * as PIXI from 'pixi.js'

const app = new PIXI.Application()

const sprite = new Pixi.Sprite(texture)

const render = ex.drawHitArea(sprite, new PIXI.Graphics())
app.ticker.add(render)
```
