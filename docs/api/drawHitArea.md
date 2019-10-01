---
name: drawHitArea
---

# drawHitArea

```js
ex.drawHitArea(displayObject, graphics)
```

Will display the hitArea for a `PIXI.DisplayObject`, if defined. Otherwise the width and height  will be used. Needs to be called on every game update.

## Arguments

`displayObject` (PIXI.DisplayObject)

`graphics` (PIXI.Graphics): Used to draw the hitBox

## Returns

Nothing.

## Example

```js
const sprite = new Pixi.Sprite(texture)

ex.drawHitArea(sprite, new PIXI.Graphics())
```
