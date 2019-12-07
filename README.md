<h1 align="center" style="background-color: black; color:#2bc4c2; padding: 10px 0 15px 0">
  pixi-ex
</h1>
<h4 align="center">
  Pixi extended - Utility functions for Pixi.js
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/pixi-ex?icon=npm" />
  <!-- <img src="https://badgen.net/npm/dw/pixi-ex?icon=npm" /> -->
  <img src="https://badgen.net/bundlephobia/minzip/pixi-ex" />
  <img src="https://badgen.net/github/last-commit/sajmoni/pixi-ex?icon=github" />
</div>

---

## Features

- [`ex.resize`](docs/api/resize) - Resize the canvas and retain the correct proportions

- [`ex.getTexture`](docs/api/getTexture) - Easily get pre-loaded textures

- [`ex.getGlobalPosition`](docs/api/getGlobalPosition) - Get the global position of a display object

- [`ex.getOverlappingArea`](docs/api/getOverlappingArea) - The area that two display objects are overlapping.

 - [`ex.drawHitArea`](docs/api/drawHitArea) - Draw a display objects `hitArea` if defined, otherwise width and height

 - [`ex.isColliding`](docs/api/isColliding) - Returns true if two display objects are colliding / overlapping

 - [`ex.fromHex`](docs/api/fromHex) - Convert `#ff00ff` to `0xff00ff`

 - [`ex.makeClickable`](docs/api/makeClickable) - Sets `interactive` to true, changes mouse cursor to `pointer` and adds a click listener to the display object.
 
 - [`ex.makeDraggable`](docs/api/makeDraggable) - Make a display object "draggable". Opacity is set to `0.5` while dragging.
 
 - [`ex.makeResizable`](docs/api/makeResizable) - Make text objects look good even when resized
 
 - [`ex.getAllChildren`](docs/api/getAllChildren) - Recursively get all children (including the input display object) from this point in the hierarchy, in a flat list.

 - [`ex.getAllTextureIds`](docs/api/getAllTextureIds) - Get all file names defined in all of your sprite sheets

[Full API docs](docs/README.md)

---

## Example usage

> Get a pre-loaded texture

```js
import * as PIXI from 'pixi.js'
import * as ex from 'pixi-ex'

const app = new PIXI.Application()

document.body.appendChild(app.view)

// Give pixi-ex a reference to the Pixi app. This function needs to be called before any other function calls.
ex.init(app)

app.loader.add('assets/spritesheet.json')

app.loader.load(() => {
  const square = new PIXI.Sprite(
    ex.getTexture('square'), // Assuming the spritesheet contains a 'square' texture
  )
})
```

---

## Install

`npm install pixi-ex`

or

`yarn add pixi-ex`

---

## Recipes

### Resize to full screen while retaining correct proportions

```js
const resizeGame = () => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  ex.resize(screenWidth, screenHeight)
}
resizeGame()

window.addEventListener('resize', resizeGame)
```

If you want the game to be horizontally centered:

```css
#container {
  display: flex;
  justify-content: center;
}
```

```html
<div id="container">
  <div id="game"></div>
</div>
```

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
