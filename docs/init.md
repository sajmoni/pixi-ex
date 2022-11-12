```js
ex.init(app)
```

Required to be called before calling:

- resize
- drawHitArea
- showGrid
- showMousePosition

## Arguments

`app` (object): Needs to be an object with fields:

- `renderer` (instance of `PIXI.Renderer`)
- `stage` (instance of `PIXI.Container`)

This can be an object you create yourself or an instance of `PIXI.Application`.

## Example with PIXI.Application

```ts
import * as ex from 'pixi-ex'

const app = PIXI.Application({
  width: 800,
  height: 600,
})

document.body.appendChild(app.view)

ex.init(app)
```

## Example with a custom object

```ts
import * as ex from 'pixi-ex'
import * as PIXI from 'pixi.js'

const renderer = new PIXI.Renderer({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  s,
})

const stage = new PIXI.Container()

const app = { renderer, stage }

document.body.appendChild(app.view)

ex.init(app)
```
