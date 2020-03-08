```js
ex.init(app)
```

Required to be called before any other function call to `pixi-ex`. 

_Note: init needs to be called after resources have been loaded_

## Arguments

`app` (object): Needs to be an object with fields: 

 - `renderer` (instance of `PIXI.Renderer`)
 - `loader` (instance of `PIXI.Loader`) 
 - `stage` (instance of `PIXI.Container`). 

This can be an object you create yourself or an instance of `PIXI.Application`.

## Returns

Nothing.

## Example with PIXI.Application

```js
import * as ex from 'pixi-ex'

const app = PIXI.Application({
  width: 800,
  height: 600,
})

document.body.appendChild(app.view)

app.loader.load(() => {
  ex.init(app)
})
```

## Example with a custom object

```js
import * as ex from 'pixi-ex'
import * as PIXI from 'pixi.js'

const renderer = new PIXI.Renderer({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
s})

const stage = new PIXI.Container()

const loader = new PIXI.Loader()

const app = { renderer, stage, loader }

document.body.appendChild(app.view)

app.loader.load(() => {
  ex.init(app)
})
```
