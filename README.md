# pixi-ex

> Pixi extended - Utility functions for Pixi.js

`pixi-ex` is a collection of functions that make `pixi.js` easier to use.

---

## Features

- [`ex.resize`](docs/api/resize) - Resize the canvas and retain the correct proportions

- [`ex.getTexture`](docs/api/getTexture) - Function to get pre-loaded textures. The input is the image name _without_ the file suffix (`.png`).

```js
new PIXI.Sprite(ex.getTexture('square'))
```

- [`ex.getGameScale`](docs/api/getGameScale) - The scale of the screen. Will be 1 if `ex.resize` has not been used.

- [`ex.getGlobalPosition`](docs/api/getGlobalPosition) - Function to get the global position of a PIXI.DisplayObject

- [`ex.getOverlappingArea`](docs/api/getOverlappingArea) - The area that two display objects are overlapping.

 - [`ex.drawHitArea`](docs/api/drawHitArea) - Draw the hitArea if defined, otherwise width and height

 - [`ex.isColliding`](docs/api/isColliding) - Returns true if two display objects are colliding / overlapping.

 - [`ex.fromHex`](docs/api/fromHex) - Convert `#ff00ff` to `0xff00ff`

 - [`ex.makeClickable`](docs/api/makeClickable) - Sets `interactive` to true, changes mouse cursor to `pointer` and adds a click listener to the display object.
 
 - [`ex.makeDraggable`](docs/api/makeDraggable) - Make a display object "draggable". Opacity is set to `0.5` while dragging.
 
 - [`ex.makeResizable`](docs/api/makeResizable) - If you use `ex.resize`, then you need to call `makeResizable` on all `Text` objects, in order for them to look good.
 
 - [`ex.getAllChildren`](docs/api/getAllChildren) - Recursively get all children (including the input display object) from this point in the hierarchy, in a flat list.

 - [`ex.getAllTextureIds`](docs/api/getAllTextureIds) - Get all file names defined in all of your sprite sheets.

---

## Example usage

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

---

## See also

[`juice.js`]() - Add "juice" to you animations to make them look nicer

[`muncher`]() - Automatically generate sprite sheets from the command line 

[`tiny-toolkit`]()

[`level1`]()
