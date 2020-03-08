```js
ex.makeResizable(text)
```

Keeps a `PIXI.Text` looking sharp even after canvas has been resized with `ex.resize`. This function will reset the scale change of `ex.resize`, and instead resize by changing `fontSize` instead.

If you use `ex.resize`, then you need to call `makeResizable` on all `Text` objects.

_This function mutates the Text object and adds new fields to it, which probably will make type checkers fail_ 

## Arguments

`text` (PIXI.Text): The `PIXI.Text` object to make resizable.

## Returns

Nothing.
