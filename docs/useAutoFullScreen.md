```js
ex.useAutoFullscreen(onChange)
```

Automatically resize canvas to be full screen.

Note: If your game is using pixel perfect rendering. This will make your pixels look distorted, so you probably want to avoid doing this.

## Arguments

`onChange` (() => void): A callback that is called whenever the canvas is resized.

## Returns

Nothing.

## Example

```js
const onChange = () => {
  console.log('Canvas was resized')
}

ex.useAutoFullScreen(onChange)
```

## Tips

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
