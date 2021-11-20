<img src="./pixi-ex.png">
<h4 align="center">
  Pixi extended - Useful utilities for <a href="https://github.com/pixijs/pixi.js">PixiJS</a>
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/pixi-ex?icon=npm" />
  <img src="https://badgen.net/bundlephobia/minzip/pixi-ex" />
  <img src="https://badgen.net/github/last-commit/sajmoni/pixi-ex?icon=github" />
</div>

---

## Features

- TypeScript support
- Zero dependencies

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

- [`init`](api/init.md) - Required to be called before using certain features

### Constructors

The purpose of these are:

1. Shorter function names "new PIXI.Sprite()" -> "sprite()"
2. Sensible defaults
3. Automatically get texture(s)
4. Prevents you from forgetting to add the object to a parent

- sprite

- animatedSprite

- text

- container

- graphics

### Helpers

- prepareFill

- setPosition

- getWidth

- getHeight

- centerX

- centerY

- getAllChildren

- drawRect

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

Check out [`app/index.js`](app/index.js) for more example usages.

---

## :package: Install

`npm install pixi-ex`

or

`yarn add pixi-ex`
