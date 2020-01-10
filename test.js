import test from 'ava'
import { Container } from 'pixi.js'

import * as ex from './index'

const mockStage = {
  scale: { set: () => {} },
  children: [
    { name: 'child1', children: [{ name: 'grandchild', children: [] }] },
    { name: 'child2', children: [] },
  ],
}

const mockPixiApp = {
  stage: mockStage,
  renderer: {
    width: 800,
    height: 600,
    resize: () => {},
  },
  loader: {
    resources: {
      'spritesheet.json': {
        textures: { 'sprite1.png': {} },
      },
    },
  },
}

const mockToGlobal = (position) => position

test('some functions throw errors before init is called', (t) => {
  t.throws(ex.getTexture)
  t.throws(ex.getAllTextureIds)
  t.throws(ex.drawHitArea)
  t.throws(ex.resize)
  ex.init(mockPixiApp)
})

test('getTexture', (t) => {
  t.deepEqual(ex.getTexture('sprite1'), {})
})

test('getAllTextureIds', (t) => {
  t.deepEqual(ex.getAllTextureIds(), ['sprite1'])
})

test('getAllChildren', (t) => {
  t.deepEqual(
    ex.getAllChildren(mockStage),
    [
      mockStage.children[0].children[0],
      mockStage.children[0],
      mockStage.children[1],
      mockStage,
    ],
  )
})

test.only('isColliding', (t) => {
  // const entity = {
  //   x: 25,
  //   y: 25,
  //   width: 10,
  //   height: 10,
  //   toGlobal: mockToGlobal,
  // }
  const entity = new Container()
  entity.position.set(25, 25)
  entity.width = 10
  entity.height = 10

  const otherEntity = {
    x: 30,
    y: 30,
    width: 10,
    height: 10,
    toGlobal: mockToGlobal,
  }
  // t.is(ex.isColliding(entity, otherEntity), true)

  // const otherEntity2 = {
  //   x: 100,
  //   y: 100,
  //   width: 10,
  //   height: 10,
  //   toGlobal: mockToGlobal,
  // }

  const otherEntity2 = new Container()
  otherEntity2.position.set(100, 100)
  otherEntity2.width = 10
  otherEntity2.height = 10

  t.is(ex.isColliding(entity, otherEntity2), false)
})

test('getOverlappingArea', (t) => {
  const entity1 = {
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    toGlobal: mockToGlobal,
  }

  const entity2 = {
    x: 5,
    y: 5,
    width: 2,
    height: 2,
    toGlobal: mockToGlobal,
  }

  t.is(ex.getOverlappingArea(entity1, entity2), 0)

  const entity3 = {
    x: 1,
    y: 0,
    width: 2,
    height: 2,
    toGlobal: mockToGlobal,
  }

  const entity4 = {
    x: 0,
    y: 1,
    width: 2,
    height: 2,
    toGlobal: mockToGlobal,
  }

  t.is(ex.getOverlappingArea(entity3, entity4), 1)

  const entity5 = {
    x: 1,
    y: 0,
    width: 2,
    height: 2,
    toGlobal: mockToGlobal,
  }

  const entity6 = {
    x: 1,
    y: 1,
    width: 2,
    height: 2,
    toGlobal: mockToGlobal,
  }

  t.is(ex.getOverlappingArea(entity5, entity6), 2)
})

test('resize', (t) => {
  t.notThrows(() => { ex.resize(1200, 1000) })
})
