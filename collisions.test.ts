import test from 'ava'
import { Container, Sprite } from 'pixi.js'
import { isColliding } from 'pixi-ex'

test('isColliding - true', (t) => {
  const displayObject1 = new Sprite()
  displayObject1.width = 100
  displayObject1.height = 100

  const displayObject2 = new Sprite()
  displayObject2.x = 1
  displayObject2.width = 100
  displayObject2.height = 100

  t.true(isColliding(displayObject1, displayObject2))
})

test('isColliding - false', (t) => {
  const displayObject1 = new Container()
  displayObject1.x = 200
  displayObject1.y = 200
  displayObject1.width = 100
  displayObject1.height = 100

  const displayObject2 = new Container()
  displayObject2.width = 100
  displayObject2.height = 100

  t.false(isColliding(displayObject1, displayObject2))
})

test('isColliding - nested hierarchy', (t) => {
  const grandparent = new Container()
  grandparent.x = 200
  grandparent.y = 200
  grandparent.width = 100
  grandparent.height = 100

  const parent = new Container()
  parent.x = 200
  parent.y = 200
  parent.width = 100
  parent.height = 100
  grandparent.addChild(parent)

  const displayObject1 = new Container()
  displayObject1.x = 200
  displayObject1.y = 200
  displayObject1.width = 100
  displayObject1.height = 100
  parent.addChild(displayObject1)

  const displayObject2 = new Container()
  displayObject2.width = 100
  displayObject2.height = 100

  t.false(isColliding(displayObject1, displayObject2))
})

test('isColliding - nested hierarchy 2', (t) => {
  const grandparent = new Container()
  grandparent.x = 50
  grandparent.width = 100
  grandparent.height = 100

  const parent = new Container()
  parent.x = 50
  parent.width = 100
  parent.height = 100
  grandparent.addChild(parent)

  const displayObject1 = new Sprite()
  displayObject1.x = 200
  displayObject1.width = 300
  displayObject1.height = 300
  parent.addChild(displayObject1)

  const displayObject2 = new Sprite()
  displayObject2.x = 200
  displayObject2.width = 300
  displayObject2.height = 300
  grandparent.addChild(displayObject2)

  t.true(isColliding(displayObject1, displayObject2))
})
