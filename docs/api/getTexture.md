---
name: getTexture
---

# getTexture

```js
ex.getTexture(fileName)
```

Gets a pre-loaded texture. Texture names need to be unique across all sprite sheets.

## Arguments

`fileName` (string): The file name as defined in any sprite sheet

## Returns

(Object): A texture

## Example

```js
const sprite = new PIXI.Sprite(ex.getTexture('lizard'))
```
