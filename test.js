import test from 'ava'

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

test('getTexture - texture not found', (t) => {
  t.throws(() => ex.getTexture('sprite2'))
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

test('resize', (t) => {
  t.notThrows(() => { ex.resize(1200, 1000) })
})

test('init - duplicate texture names across sprite sheets', (t) => {
  t.deepEqual(ex.getTexture('sprite1'), {})
  t.throws(() => ex.init({
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
  }))
})
