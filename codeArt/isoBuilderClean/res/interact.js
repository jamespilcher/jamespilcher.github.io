
//use this function
lastMousePosition = {x: 0, y:0}
function updateCoordInfo(mousePos){
    gridPos = layerZeroCoordinate(mousePos.x, mousePos.y)
    prevCurrentBlockCoords = {
        x:  currentBlockCoords.x,
        y:  currentBlockCoords.y,
        z:  currentBlockCoords.layer
    }
    prevNextBlockCoords = {
        x:  nextBlockCoords.x,
        y:  nextBlockCoords.y,
        z:  nextBlockCoords.layer
    }
    currentBlockCoords = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    nextBlockCoords = posOfNextBlock(currentBlockCoords, gridPos)
    if (nextBlockCoords.x != prevNextBlockCoords.x || nextBlockCoords.y != prevNextBlockCoords.y ||
        nextBlockCoords.layer != prevNextBlockCoords.z || currentBlockCoords.x != prevCurrentBlockCoords.x || 
        currentBlockCoords.y != prevCurrentBlockCoords.y || currentBlockCoords.layer != prevCurrentBlockCoords.z){
        drawWorld()
        if (nextBlockCoords.x >= 0 && nextBlockCoords.y >= 0 && nextBlockCoords.layer >= 0){
            drawImageTile(currentBlockCoords.x,currentBlockCoords.y,currentBlockCoords.layer, blockData["highlight"])
        }
    }
}

function getMousePos(evt, c) {
    var rect = c.getBoundingClientRect();

    return {
      x: (evt.clientX - rect.left),
      y: (evt.clientY - rect.top)
    };
  }
canvas.addEventListener('mousemove', function(evt) {
    lastMousePosition = getMousePos(evt, canvas);
    gridPos = layerZeroCoordinate(lastMousePosition.x, lastMousePosition.y)
    newCurrentCoords = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    newNextCoords = posOfNextBlock(newCurrentCoords, gridPos)
    updateCoordInfo(lastMousePosition)
        //placeBlockAtCoordinates(nextBlockCoords.x, nextBlockCoords.y, nextBlockCoords.layer, true)
    return false;
  }, false);
//left click

function UserPlaceBlock(){
    gridPos = layerZeroCoordinate(lastMousePosition.x, lastMousePosition.y)
    currentBlockCoords = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    nextBlockCoords = posOfNextBlock(currentBlockCoords, gridPos)
    placeBlockAtCoordinates(nextBlockCoords.x, nextBlockCoords.y, nextBlockCoords.layer)
    updateCoordInfo(lastMousePosition)
    return false;
  }

function getBlock(){
    gridPos = layerZeroCoordinate(lastMousePosition.x, lastMousePosition.y)
    blockCoords = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    currentBlock = world[blockCoords.layer,blockCoords.y,blockCoords.x]
    return false;

}

//right click
function UserDeleteBlock(){
    gridPos = layerZeroCoordinate(lastMousePosition.x, lastMousePosition.y)
    blockCoords = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    //console.log('Mouse position: ' + grid.x_grid + ',' + grid.y_grid);
    deleteBlockAtCoordinates(blockCoords.x, blockCoords.y, blockCoords.layer)
    updateCoordInfo(lastMousePosition)
    return false;
}

function layerZeroCoordinate(x,y) { 
    //  
    a = (x - centerGrid) / tileWidth
    b = 2*(y - (buildLimit-1)/2 * tileHeight) /tileHeight
    i = Math.round(a + b)
    j = Math.round(b-a)
    //which half of the block is selected... this is important !
    q = (a+b - i +0.45)
    r = (b-a - j+0.45)

    if (r > q){
        left = true

    }
    else{
        left = false

    }

    return {
      y_grid: i -2,  //why is it offset by -1 and -2??
      x_grid: j -1 ,
      left: left
    }
  }

const posOfNextBlock = (blockCoords, gridPos) => {
    //

    x_new = blockCoords.x
    y_new = blockCoords.y
    layer_new = blockCoords.layer

    x = gridPos.x_grid
    y = gridPos.y_grid
    left = gridPos.left 

    x_ideal = blockCoords.x - blockCoords.layer
    y_ideal = blockCoords.y - blockCoords.layer

    if (x == x_ideal && y == y_ideal){
        layer_new += 1
    }
    if (x == x_ideal && y == y_ideal+1){
        y_new += 1
    }
    if (x == x_ideal+1 && y == y_ideal){
        x_new += 1
    }
    if (x == x_ideal+1 && y == y_ideal+1){
        if (left){
            x_new += 1
        }
        else{
            y_new += 1
        }
    }

    return {
        x: x_new,  //why is it offset by -1 and -2??
        y: y_new,
        layer: layer_new,
    }
    // figure out where on that grid x_ideal and y_ideal is...
    // cant worry about negatives, it MUST be able to go off of the grid.
    // top
    // right|left or bottom|right
    // left|right or bottom|left

    // we project it downward, then compare with our
  };

/////////////////////////////////////////////////////////////////////////////
const selectedBlock = (x, y, left) => {
    new_left = true

    topX=-1
    topY=-1
    topLayer=-1
    //top check
    for (i = buildLimit-1; i >= 0; i--) {
        if ( (y+i < gridHeight) && (x+i < gridWidth) && (y+i >= 0) && (x+i >= 0) &&
        (blockData[world[i][y+i][x+i]]["isSolid"])){ //block isnt transparent.
            topX = x+i
            topY = y+i
            topLayer = i
            newLeft = left

            break;
        }
    }

    bottomX=-1
    bottomY=-1
    bottomLayer=-1
    //bottom check

    for (i = buildLimit-1; i >= 1; i--) {
        if ( (y+i-1 < gridHeight) && (x+i-1 < gridWidth) && (y+i-1 >= 0) && (x+i-1 >= 0) &&
        (blockData[world[i][y+i-1][x+i-1]]["isSolid"])){ //block isnt transparent.
            bottomX = x+i-1
            bottomY = y+i-1
            bottomLayer = i
            newLeft = left

            break;
        }
    }

    //left check
    leftX = -1
    leftY = -1
    leftLayer = -1
    if (left){

        for (i = buildLimit-1; i >= 0; i--) {
            if ((y+i-1 < gridHeight) && (x+i < gridWidth) && (y+i-1 >= 0) && (x+i >= 0) &&
            (blockData[world[i][y+i-1][x+i]]["isSolid"])){
                leftX = x + i
                leftY = y + i -1
                leftLayer = i
                new_left = false
                break;
            }
        }
    }
    rightX = -1
    rightY = -1
    rightLayer = -1
    if (!left){
        for (i = buildLimit-1; i >= 0; i--) {
            if ((y+i < gridHeight) && (x+i-1 < gridWidth) && (y+i >= 0) && (x+i-1 >= 0) && 
            (blockData[world[i][y+i][x+i-1]]["isSolid"])){
                rightX = x + i -1
                rightY = y + i
                rightLayer = i
                new_left = false

                break;
            }
        }
    }
    if ((topLayer >= bottomLayer) && (topLayer >= rightLayer) && (topLayer >= leftLayer)){

        return {
            left : new_left,
            x: topX,  //why is it offset by -1 and -2??
            y: topY,
            layer: topLayer,
        }
    }
    else if ((rightLayer > topLayer) && (rightLayer >= bottomLayer) && (rightLayer > leftLayer)){
        return {
            left : new_left,
            x: rightX,  //why is it offset by -1 and -2??
            y: rightY,
            layer: rightLayer,
        }
    }
    else if ((leftLayer > topLayer) && (leftLayer >= bottomLayer) &&(leftLayer > rightLayer)){

        return {
            left : new_left,
            x: leftX,  //why is it offset by -1 and -2??
            y: leftY,
            layer: leftLayer,
        }
    }
    else{
        return {
            left : new_left,
            x: bottomX,  //why is it offset by -1 and -2??
            y: bottomY,
            layer: bottomLayer,
        }
    }

  };
//////////////////////////////////////



const placeBlockAtCoordinates = (x, y,z=1) => {

    if( (x >= 0) && (y >= 0) && (z > 0) && (x < gridWidth) && (y < gridHeight) && (z < buildLimit) ){
        world[z][y][x] = currentBlock
    }
    drawWorld()

  };

const deleteBlockAtCoordinates = (y, x, layer) => {
    if (layer != 0){
        world[layer][x][y] = "air"
    }
    drawWorld()
  };


//rotation from https://betterprogramming.pub/how-to-rotate-a-matrix-in-javascript-2c8a4c64b8d9
//only works with square grid...
const rotateLayer90 = (matrix) => {
    return matrix.map((row, i) =>
      row.map((val, j) => matrix[matrix.length - 1 - j][i])
    );
  };

const rotateWorld90 = () => {
    for (var i = 0; i < world.length; i++){
        world[i] = rotateLayer90(world[i]);
    }
    drawWorld()
    updateCoordInfo(lastMousePosition)
  }

const fillLayer = () => {
    layer = nextBlockCoords.layer
    if (layer < buildLimit){
        world[layer] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(currentBlock));
    }
    drawWorld()
    updateCoordInfo(lastMousePosition)

}
