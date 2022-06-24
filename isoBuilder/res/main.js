
const gridWidth = 20
const gridHeight = 12
const tileheight = 32
const tilewidth = 64
const origin = [gridWidth / 2,1]

// 5 is the number of rows and 4 is the number of columns.
const world = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0));
// assume aspect ratio of tile is 2:1
// 64 to 32
