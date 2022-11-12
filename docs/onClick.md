```js
ex.onClick(displayObject, callback)
```

Small convenience function to make a `PIXI.DisplayObject` "clickable". It sets `interactive` to true, changes mouse cursor to `pointer` and adds a listener for `click` and `tap` events.

## Arguments

`displayObject` (Object): The display object to make clickable.

`callback` (Function): Will be called on `click` and `tap`. Gets the `Pixi` `event` as an argument.

## Example

```js
ex.onClick(new Sprite(), (event) => {
  console.log('Sprite was clicked')
})
```
