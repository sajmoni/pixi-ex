---
name: init
---

# init

```js
ex.init(app)
```

Required to be called before any other function call to `pixi-ex`. 

_Note: init needs to be called after resources have been loaded_

## Arguments

`app` (object): Needs to be an object with fields: `renderer` (instance of `PIXI.Renderer`), `loader` (instance of `PIXI.Loader`) and `stage` (instance of `PIXI.Container`). This can be an object you create yourself or an instance of `PIXI.Application`.

## Returns

Nothing.

## Example

```js
import * as ex from 'pixi-ex'

const app = PIXI.Application({
  width: 800,
  height: 800,
})

document.body.appendChild(app.view)

app.loader.load(() => {
  ex.init(app)
})
```
