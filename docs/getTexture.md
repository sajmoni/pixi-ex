```js
ex.getTexture(fileName)
```

Gets a pre-loaded texture. The input is the image name _without_ the file suffix (`.png`).

_Note. Texture names need to be unique across all sprite sheets_

## Arguments

`fileName` (string): The file name as defined in any sprite sheet

## Returns

(Object): A texture

## Example

```js
new PIXI.Sprite(ex.getTexture('player'))

new PIXI.AnimatedSprite(['enemy-0', 'enemy-1'].map(ex.getTexture))
```
