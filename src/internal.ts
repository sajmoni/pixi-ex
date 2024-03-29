type GetCellsArgs = {
  width: number
  height: number
  numberOfCells: number
  resolution: number
  scale: number
}

type Cell = {
  x: number
  y: number
  width: number
  height: number
}

export const getCells = ({
  width,
  height,
  numberOfCells,
  resolution,
  scale,
}: GetCellsArgs): Cell[] => {
  const cellWidth = width / numberOfCells / resolution / scale
  const cellHeight = height / numberOfCells / resolution / scale

  let cells = []
  for (let x = 0; x < numberOfCells; x++) {
    for (let y = 0; y < numberOfCells; y++) {
      cells.push({
        x: x * cellWidth,
        y: y * cellHeight,
        width: cellWidth,
        height: cellHeight,
      })
    }
  }

  return cells
}
