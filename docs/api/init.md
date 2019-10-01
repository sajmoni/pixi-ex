---
name: init
---

# init

```js
ex.init(app)
```

Gives `pixi-ex` a reference to your `PIXI.Application` object. Required to be called before any other function call.

## Arguments

`app` (object): An instance of PIXI.Application

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

ex.init(app)
```
