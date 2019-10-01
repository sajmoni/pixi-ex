# pixi-ex (Pixi extended)

> Utility functions for Pixi.js

`pixi-ex` is a collection of functions that make `pixi.js` easier to use.

## Features

 - Zero dependencies

## Install

`npm install pixi-ex`

`yarn add pixi-ex`

## Example usage

```js
import * as ex from 'pixi-ex'
import * as PIXI from 'pixi.js'

const app = new PIXI.Application()

document.body.appendChild(app.view)

// Give pixi-ex a reference to the Pixi app
ex.init(app)

// Example spritesheet
app.loader.add('assets/spritesheet.json')

app.loader.load(() => {
  const square = new PIXI.Sprite(
    ex.getTexture('square'), // Assuming the spritesheet contains a 'square' texture
  )
})
```

- `ex.resize` - Resize the canvas and retain the correct proportions

- `ex.getTexture` - Function to get pre-loaded textures. The input is the image name _without_ the file suffix (`.png`).

```js
new PIXI.Sprite(ex.getTexture('square'))
```

- `ex.getGameScale` - The scale of the screen. Will be 1 if `ex.resize` has not been used.

- `ex.getGlobalPosition` - Function to get the global position of a Pixi display object

- `ex.getOverlappingArea` - The area that two display objects are overlapping.

 - `ex.drawHitArea` - Draw the hitArea if defined, otherwise width and height

 - `ex.isColliding` - Returns true if two display objects are colliding / overlapping.

 - `ex.fromHex` - Convert `#ff00ff` to `0xff00ff`

 - `ex.makeClickable` - Sets `interactive` to true, changes mouse cursor to `pointer` and adds a click listener to the display object.
 
 - `ex.makeDraggable`
 
 - `ex.makeResizable` - If you use `ex.resize`, then you need to call `makeResizable` on all text objects, in order for them to look good.
 
 - `ex.getAllChildren` - Recursively get all children (including the input display object) from this point in the hierarchy, in a flat list.

 - `ex.getAllTextureIds` - 

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

## Other useful tools

[`juice.js`]() - Add "juice" to you animations to make them look nicer

[`muncher`]() - Automatically generate sprite sheets from the command line 

[`tiny-tools`]()

[`level1`]()

### TODO

 - Should functions take the app object and be curried or not?