---
name: getAllChildren
---

# getAllChildren

```js
ex.getAllChildren(displayObject)
```

Recursively get all descendants of a display object. Will return a flat list of display objects, including the initial display object.

## Arguments

`displayObject` (PIXI.DisplayObject): Any object that inherits from PIXI.DisplayObject, such as PIXI.Sprite

## Returns

(array): A flat list of display objects which has this display object as an ancestor.
