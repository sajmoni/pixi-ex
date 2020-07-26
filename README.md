<img src="./pixi-ex.png">
<h4 align="center">
  Pixi extended - Utility functions for <a href="https://github.com/pixijs/pixi.js">PixiJS</a>
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/pixi-ex?icon=npm" />
  <img src="https://badgen.net/bundlephobia/minzip/pixi-ex" />
  <img src="https://badgen.net/github/last-commit/sajmoni/pixi-ex?icon=github" />
</div>

---

[PixiJS](https://github.com/pixijs/pixi.js) is one of the most popular 2D WebGL libraries. This library aims to include some useful utilities to make PixiJS easier to work with.

---

## API

- [`resize`](docs/resize.md) - Resize the canvas and retain the correct proportions

- [`getTexture`](docs/getTexture.md) - Easily get pre-loaded textures

- [`getGlobalPosition`](docs/getGlobalPosition.md) - Get the global position of a display object

- [`getOverlappingArea`](docs/getOverlappingArea.md) - Get overlapping area of two display objects

- [`drawHitArea`](docs/drawHitArea.md) - Debug your display objects hit areas

- [`isColliding`](docs/isColliding.md) - Returns true if two display objects are colliding / overlapping

- [`makeClickable`](docs/makeClickable.md) - Sets `interactive` to true, changes mouse cursor to `pointer` and adds a click listener to the display object.

- [`makeDraggable`](docs/makeDraggable.md) - Make a display object "draggable". Opacity is set to `0.5` while dragging.

- [`makeResizable`](docs/makeResizable.md) - Make text objects look good even when resized

- [`getAllChildren`](docs/getAllChildren.md) - Get all children (including the input display object) from this point in the hierarchy.

- [`centerX`](docs/centerX.md) - Center a display object on the horizontal axis.

- [`centerY`](docs/centerY.md) - Center a display object on the vertical axis.

- [`useAutoFullScreen`](docs/useAutoFullScreen.md) - Automatically resize canvas to be full screen.

- [`getAllTextureIds`](docs/getAllTextureIds.md) - Get all file names defined in all of your sprite sheets

- [`getGameScale`](api/getGameScale.md) - Get the game scale after resize

- [`init`](api/init.md)

---

## Example usage

> Get a pre-loaded texture

```js
import * as PIXI from 'pixi.js'
import * as ex from 'pixi-ex'

const app = new PIXI.Application()

document.body.appendChild(app.view)

app.loader.add('assets/spritesheet.json')

app.loader.load(() => {
  // Give pixi-ex a reference to the Pixi app. This function needs to be called before any other calls to pixi-ex.
  // It also needs to be called after resources are loaded.
  ex.init(app)
  const square = new PIXI.Sprite(
    ex.getTexture('square'), // Assuming the spritesheet contains a 'square' texture
  )
})
```

Check out [`example/index.js`](example/index.js) for more example usages.

---

## :package: Install

`npm install pixi-ex`

or

`yarn add pixi-ex`

---

## :book: Recipes

### Make all text objects resizable

If you are making a resizable game, you probably want all text objects to look good when resized.

In that case, you might want to wrap the `Pixi.Text` constructor.

```js
export default (text, textStyle = {}) => {
  const textObject = new PIXI.Text(text, textStyle)
  ex.makeResizable(textObject)
  return textObject
}
```

---

## See also

[`juice.js`](https://github.com/rymdkraftverk/juice.js) - Add "juice" to you animations to make them look nicer

[`muncher`](https://github.com/sajmoni/muncher) - Automatically generate sprite sheets from the command line

[`level1`](https://github.com/rymdkraftverk/level1) - Delayed and repeated callback execution for games
