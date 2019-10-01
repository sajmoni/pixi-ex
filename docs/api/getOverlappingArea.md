---
name: getOverlappingArea
---

# getOverlappingArea

```js
ex.getOverlappingArea(displayObject, otherDisplayObject)
```

Return a value for how much area two display objects are overlapping with. Will use the global `x` and `y` positions. Will use `hitArea` if defined, otherwise `height` and `width`.

## Arguments

`displayObject` (PIXI.DisplayObject): The first display object to use for overlap detection.

`otherDisplayObject` (PIXI.DisplayObject) The second display object to use for overlap detection.

## Returns

(Number): The area that is overlapping.
