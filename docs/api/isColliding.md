---
name: isColliding
---

# isColliding

```js
ex.isColliding(displayObject, otherDisplayObject)
```

Check if two display objects positions are overlapping. Will use the global `x` and `y` positions. Will use `hitArea` if defined, otherwise `height` and `width`.

## Arguments

`displayObject` (PIXI.DisplayObject): The first display object to use for collision detection.

`otherDisplayObject` (PIXI.DisplayObject) The second display object to use for collision detection.

## Returns

(Boolean): Returns true if the display objects are colliding.
