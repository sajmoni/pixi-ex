import * as ex from 'pixi-ex'
import {
  Application,
  Container,
  Rectangle,
  Graphics,
  utils,
  Assets,
} from 'pixi.js'

const GAME_WIDTH = 1280
const GAME_HEIGHT = 720

// settings.RESOLUTION = 2
const app = new Application({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
})

document.querySelector('#game')?.append(app.view)

Assets.add('spritesheet', 'spritesheet.json')

async function run() {
  const { textures } = await Assets.load('spritesheet')
  ex.init(app)
  const container = ex.container(app.stage)

  const scale = ex.text(container, { fill: '#ffffff' })
  scale.anchor.set(0.5)
  scale.x = GAME_WIDTH / 2
  scale.y = 20
  ex.handleResize(scale)

  ex.useAutoFullScreen(() => {
    scale.text = `Canvas will resize when window is resized. Scale: ${ex.getGameScale()}`
  })

  const centeredText = ex.text(
    container,
    { fill: 'lightblue' },
    'I am centered',
  )
  ex.centerX(centeredText, GAME_WIDTH / 2)
  ex.centerY(centeredText, GAME_HEIGHT / 2)

  const squareContainer = new Container()
  squareContainer.position.set(100, 100)
  squareContainer.hitArea = new Rectangle(0, 0, 300, 200)
  container.addChild(squareContainer)

  const renderHitArea = ex.drawHitArea(squareContainer, new Graphics())
  app.ticker.add(renderHitArea)

  const square2 = new Graphics()
  square2.position.set(250, 50)
  squareContainer.addChild(square2)

  const square1 = ex.sprite(squareContainer, textures['square1.png'])
  square1.position.set(50, 50)
  square1.anchor.set(0.5)
  square1.alpha = 0.6

  const overlappingText = ex.text(container, { fill: '#ffffff' })
  overlappingText.position.set(300, 330)
  overlappingText.anchor.set(0.5)

  app.ticker.add(() => {
    if (ex.isColliding(square1, square2)) {
      square2
        .clear()
        .beginFill(utils.string2hex('#00ff00'))
        .drawRect(-16, -16, 32, 32)
        .endFill()
    } else {
      square2
        .clear()
        .beginFill(utils.string2hex('#0000ff'))
        .drawRect(-16, -16, 32, 32)
        .endFill()
    }

    overlappingText.text = `${ex.getOverlappingArea(square1, square2)}`
  })

  const containerChildrenText = ex.text(
    container,
    { fill: '#ffffff' },
    `Total children in container: ${ex.getAllChildren(squareContainer).length}`,
  )
  containerChildrenText.position.set(300, 400)
  containerChildrenText.anchor.set(0.5)

  const getGlobalPositionTextContent = () =>
    `Global: ${ex.getGlobalPosition(square1).x}, ${
      ex.getGlobalPosition(square1).y
    }`

  const globalPositionText = ex.text(
    square1,
    {
      fill: '#ffffff',
      fontSize: 16,
    },
    getGlobalPositionTextContent(),
  )
  ex.handleResize(globalPositionText)
  square1.addChild(globalPositionText)

  let clicked = 0
  const clickMe = ex.text(
    container,
    {
      fill: '#ffffff',
    },
    `Click me! Times clicked: ${clicked}`,
  )
  clickMe.position.set(GAME_WIDTH - 200, 400)
  clickMe.anchor.set(0.5)
  ex.onClick(clickMe, () => {
    clicked += 1
    clickMe.text = `Click me! Times clicked: ${clicked}`
  })

  const hoverMe = ex.text(
    container,
    {
      fill: '#ffffff',
    },
    `Hover me!`,
  )
  hoverMe.position.set(GAME_WIDTH - 200, 500)
  hoverMe.anchor.set(0.5)
  ex.onHover(hoverMe, {
    onOver: () => {
      hoverMe.style.fill = '#ff0000'
    },
    onOut: () => {
      hoverMe.style.fill = '#ffffff'
    },
  })

  // * Grid overlay
  const gridGraphics = ex.graphics(container)
  gridGraphics.lineStyle(2, 0xff00ff, 0.5)
  ex.showGrid(gridGraphics, 4)

  ex.showMousePosition(container)
}

run()
