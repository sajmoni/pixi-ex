---
name: makeResizable
---

# makeResizable

```js
ex.makeResizable(text)
```

Keeps a `PIXI.Text` looking sharp even after canvas has been resized with `ex.resize`. This function will reset the scale change of `ex.resize`, and instead resize by changing `fontSize` instead.

_This function mutates the Text object and adds new fields to it, which probably will make type checkers fail_ 

## Arguments

`text` (PIXI.Text): The PIXI.Text object to make draggable.

## Returns

Nothing.
