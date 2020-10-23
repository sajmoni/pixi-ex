import * as PIXI from 'pixi.js'
import * as ex from 'pixi-ex'

const GAME_WIDTH = 1280
const GAME_HEIGHT = 720

const app = new PIXI.Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
})

document.querySelector('#game').append(app.view)

app.loader.add('spritesheet.json')

app.loader.load(() => {
  ex.init(app)

  const scale = new PIXI.Text('', { fill: '#ffffff' })
  scale.anchor.set(0.5)
  scale.x = GAME_WIDTH / 2
  scale.y = 20
  ex.makeResizable(scale)
  app.stage.addChild(scale)

  ex.useAutoFullScreen(() => {
    scale.text = `Canvas will resize when window is resized. Scale: ${ex.getGameScale()}`
  })

  const centeredText = new PIXI.Text('I am centered', { fill: 'lightblue' })
  ex.centerX(centeredText, GAME_WIDTH / 2)
  ex.centerY(centeredText, GAME_HEIGHT / 2)
  app.stage.addChild(centeredText)

  const squareContainer = new PIXI.Container()
  squareContainer.position.set(100, 100)
  squareContainer.hitArea = new PIXI.Rectangle(0, 0, 300, 200)
  const renderHitArea = ex.drawHitArea(squareContainer, new PIXI.Graphics())
  app.ticker.add(renderHitArea)

  app.stage.addChild(squareContainer)

  const square2 = new PIXI.Graphics()
  square2.position.set(250, 50)
  squareContainer.addChild(square2)

  const square1 = new PIXI.Sprite(ex.getTexture('square1'))
  square1.position.set(50, 50)
  square1.anchor.set(0.5)
  square2.alpha = 0.6
  squareContainer.addChild(square1)

  const overlappingText = new PIXI.Text('', { fill: '#ffffff' })
  overlappingText.position.set(300, 330)
  overlappingText.anchor.set(0.5)
  app.stage.addChild(overlappingText)

  app.ticker.add(() => {
    if (ex.isColliding(square1, square2)) {
      square2
        .clear()
        .beginFill(PIXI.utils.string2hex('#00ff00'))
        .drawRect(-16, -16, 32, 32)
        .endFill()
    } else {
      square2
        .clear()
        .beginFill(PIXI.utils.string2hex('#0000ff'))
        .drawRect(-16, -16, 32, 32)
        .endFill()
    }

    overlappingText.text = `${ex.getOverlappingArea(square1, square2)}`
  })

  const containerChildrenText = new PIXI.Text(
    `Total children in container: ${ex.getAllChildren(squareContainer).length}`,
    { fill: '#ffffff' },
  )
  containerChildrenText.position.set(300, 400)
  containerChildrenText.anchor.set(0.5)
  app.stage.addChild(containerChildrenText)

  const getGlobalPositionTextContent = () =>
    `Global: ${ex.getGlobalPosition(square1).x}, ${
      ex.getGlobalPosition(square1).y
    }`

  const globalPositionText = new PIXI.Text(getGlobalPositionTextContent(), {
    fill: '#ffffff',
    fontSize: 16,
  })
  ex.makeResizable(globalPositionText)
  square1.addChild(globalPositionText)

  ex.makeDraggable(square1, {
    onMove: (position) => {
      // TODO: Put this into the makeDraggable?
      square1.position = position
      globalPositionText.text = getGlobalPositionTextContent()
    },
  })

  const textureIdTitle = new PIXI.Text('Texture ids:', { fill: '#ffffff' })
  ex.makeResizable(textureIdTitle)
  textureIdTitle.position.set(GAME_WIDTH - 200, 200)
  textureIdTitle.anchor.set(0.5)
  app.stage.addChild(textureIdTitle)

  ex.getAllTextureIds().forEach((textureId, index) => {
    const text = new PIXI.Text(textureId, { fill: '#ffffff' })
    ex.makeResizable(text)
    text.position.set(GAME_WIDTH - 200, 250 + index * 50)
    text.anchor.set(0.5)
    app.stage.addChild(text)
  })

  let clicked = 0
  const clickMe = new PIXI.Text(`Click me! Times clicked: ${clicked}`, {
    fill: '#ffffff',
  })
  clickMe.position.set(GAME_WIDTH - 200, 400)
  clickMe.anchor.set(0.5)
  ex.makeClickable(clickMe, () => {
    clicked += 1
    clickMe.text = `Click me! Times clicked: ${clicked}`
  })
  app.stage.addChild(clickMe)

  const hoverMe = new PIXI.Text(`Hover me!`, {
    fill: '#ffffff',
  })
  hoverMe.position.set(GAME_WIDTH - 200, 500)
  hoverMe.anchor.set(0.5)
  ex.makeHoverable(hoverMe, {
    onOver: () => {
      hoverMe.style.fill = '#ff0000'
    },
    onOut: () => {
      hoverMe.style.fill = '#ffffff'
    },
  })
  app.stage.addChild(hoverMe)

  // * Grid overlay
  const gridGraphics = new PIXI.Graphics()
  app.stage.addChild(gridGraphics)
  ex.showGrid({ graphics: gridGraphics, numberOfCells: 2, color: 0xff00ff })
})
