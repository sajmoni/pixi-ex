```js
ex.drawHitArea(displayObject, graphics)
```

Will display the `hitArea` for a `PIXI.DisplayObject`, if defined. Otherwise the `width` and `height` will be used. Returns a `render` function that needs to be called on each game update.

This function is only meant to be used for debugging.

## Arguments

`displayObject` (PIXI.DisplayObject)

`graphics` (PIXI.Graphics): Used to draw the hitBox

## Returns

A `render` function with no arguments

## Example

```js
import * as PIXI from 'pixi.js'
import * as ex from 'pixi-ex'

const render = ex.drawHitArea(
  new PIXI.Sprite(texture), 
  new PIXI.Graphics(),
)

const app = new PIXI.Application()

app.ticker.add(render)
```
