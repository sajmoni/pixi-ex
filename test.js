import test from 'ava'
import * as PIXI from 'pixi.js'

import * as ex from './src'
import * as internal from './src/internal'

const displayObject = new PIXI.DisplayObject()
displayObject.name = 'displayObject'
const grandChild = new PIXI.Container()
grandChild.name = 'grandChild'
const child1 = new PIXI.Container()
child1.name = 'child1'
child1.addChild(grandChild)
const child2 = new PIXI.Container()
child2.name = 'child2'

const mockStage = new PIXI.Container()
mockStage.name = 'stage'
mockStage.addChild(child1)
mockStage.addChild(child2)

mockStage.addChild(displayObject)

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

test('some functions throw errors before init is called', (t) => {
  t.throws(ex.getTexture)
  t.throws(ex.getAllTextureIds)
  t.throws(ex.drawHitArea)
  t.throws(ex.resize)
  t.throws(ex.showGrid)
  ex.init(mockPixiApp)
})

test('getTexture', (t) => {
  t.deepEqual(ex.getTexture('sprite1'), {})
})

test('getTexture - texture not found', (t) => {
  t.throws(() => ex.getTexture('sprite2'))
})

test('getAllTextureIds', (t) => {
  t.deepEqual(ex.getAllTextureIds(), ['sprite1'])
})

test('getAllChildren', (t) => {
  t.deepEqual(
    ex.getAllChildren(mockStage).map((child) => child.name),
    [
      grandChild.name,
      child1.name,
      child2.name,
      displayObject.name,
      mockStage.name,
    ],
  )
})

test('resize', (t) => {
  t.notThrows(() => {
    ex.resize(1200, 1000)
  })
})

test('showGrid', (t) => {
  t.notThrows(() => {
    const graphics = new PIXI.Graphics()
    const gridGraphics = ex.showGrid({
      numberOfCells: 2,
      graphics,
      color: 0xffffff
    })
  })
})

const expectedCells = [
  {x: 0, y: 0}, 
  {x: 0, y: 125},
  {x: 250, y: 0},
  {x: 250, y: 125},
].map((cell) => ({ ... cell, width: 250, height: 125}))

test('getCells - resolution === 1, scale === 2', (t) => {
  const cells = internal.getCells({ width: 1000, height: 500, numberOfCells: 2, resolution: 1, scale: 2})

  t.deepEqual(cells, expectedCells)
})

test('getCells - resolution === 2, , scale === 1', (t) => {
  const cells = internal.getCells({ width: 1000, height: 500, numberOfCells: 2, resolution: 2, scale: 1})

  t.deepEqual(cells, expectedCells)
})


test('centerX', (t) => {
  const displayObject = { width: 100, x: 0, pivot: { x: 0 } }
  const xPosition = 500
  ex.centerX(displayObject, xPosition)
  t.is(displayObject.x, 500)
  t.is(displayObject.pivot.x, 50)
})

test('centerY', (t) => {
  const displayObject = { height: 100, y: 0, pivot: { y: 0 } }
  const yPosition = 500
  ex.centerY(displayObject, yPosition)
  t.is(displayObject.y, 500)
  t.is(displayObject.pivot.y, 50)
})

test('init - duplicate texture names across sprite sheets', (t) => {
  t.deepEqual(ex.getTexture('sprite1'), {})
  t.throws(() =>
    ex.init({
      ...mockPixiApp,
      loader: {
        ...mockPixiApp.loader,
        resources: {
          ...mockPixiApp.loader.resources,
          'spritesheet.json': {
            textures: { 'sprite1.png': {} },
          },
          'spritesheet2.json': {
            textures: { 'sprite1.png': {} },
          },
        },
      },
    }),
  )
})
