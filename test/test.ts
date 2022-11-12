import test from 'ava'
import * as ex from 'pixi-ex'
import { Container, Graphics, Assets } from 'pixi.js'

import * as internal from '../src/internal'

const container = new Container()
container.name = 'container'
const grandChild = new Container()
grandChild.name = 'grandChild'
const child1 = new Container()
child1.name = 'child1'
child1.addChild(grandChild)
const child2 = new Container()
child2.name = 'child2'

const mockStage = new Container()
mockStage.name = 'stage'
mockStage.addChild(child1)
mockStage.addChild(child2)

mockStage.addChild(container)

const mockPixiApp = {
  stage: mockStage,
  renderer: {
    width: 800,
    height: 600,
    resize: () => {},
  },
}

test('some functions throw errors before init is called', async (t) => {
  t.throws(() => ex.drawHitArea(new Container(), new Graphics()))
  t.throws(() => ex.resize(10, 10))
  t.throws(() => ex.showGrid(new Graphics()))
  //@ts-expect-error
  ex.init(mockPixiApp)
  Assets.add('spritesheet', 'spritesheet.json')
  await ex.load('spritesheet')
})

test.serial('getTexture', (t) => {
  t.deepEqual(ex.getTexture('sprite1.png'), {})
})

test.serial('getTexture - texture not found', (t) => {
  t.throws(() => ex.getTexture('sprite2.png'))
})

test.serial('getAllTextureIds', (t) => {
  t.deepEqual(ex.getAllTextureIds(), ['sprite1.png'])
})

test('getAllChildren', (t) => {
  t.deepEqual(
    ex.getAllChildren(mockStage).map((child) => child.name),
    [grandChild.name, child1.name, child2.name, container.name, mockStage.name],
  )
})

test('resize', (t) => {
  t.notThrows(() => {
    ex.resize(1200, 1000)
  })
})

// TODO: Enable this test again once pixi supports it
test.skip('showGrid', (t) => {
  t.notThrows(() => {
    ex.showGrid(new Graphics(), 2)
  })
})

const expectedCells = [
  { x: 0, y: 0 },
  { x: 0, y: 125 },
  { x: 250, y: 0 },
  { x: 250, y: 125 },
].map((cell) => ({ ...cell, width: 250, height: 125 }))

test('getCells - resolution === 1, scale === 2', (t) => {
  const cells = internal.getCells({
    width: 1000,
    height: 500,
    numberOfCells: 2,
    resolution: 1,
    scale: 2,
  })

  t.deepEqual(cells, expectedCells)
})

test('getCells - resolution === 2, , scale === 1', (t) => {
  const cells = internal.getCells({
    width: 1000,
    height: 500,
    numberOfCells: 2,
    resolution: 2,
    scale: 1,
  })

  t.deepEqual(cells, expectedCells)
})

test('centerX', (t) => {
  const displayObject = { width: 100, x: 0, pivot: { x: 0 } }
  const xPosition = 500
  //@ts-expect-error
  ex.centerX(displayObject, xPosition)
  t.is(displayObject.x, 500)
  t.is(displayObject.pivot.x, 50)
})

test('centerY', (t) => {
  const displayObject = { height: 100, y: 0, pivot: { y: 0 } }
  const yPosition = 500
  //@ts-expect-error
  ex.centerY(displayObject, yPosition)
  t.is(displayObject.y, 500)
  t.is(displayObject.pivot.y, 50)
})
