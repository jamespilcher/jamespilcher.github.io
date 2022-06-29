let lastMousePosition

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();

    return {
      x: (evt.clientX - rect.left),
      y: (evt.clientY - rect.top)
    };
  }
canvas.addEventListener('mousemove', function(evt) {
    lastMousePosition = getMousePos(evt);
    return false;
  }, false);
//left click

function UserPlaceBlock(evt){
    var mousePos = getMousePos(evt);
    gridPos = layerZeroCoordinate(mousePos.x, mousePos.y)
    block = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    console.log("click")
    where = posOfNextBlock(block, gridPos)
    //console.log('Mouse position: ' + grid.x_grid + ',' + grid.y_grid);
    placeBlockAtCoordinates(where.x, where.y, where.layer)

    return false;
  }

//right click
function UserDeleteBlock(evt){
    evt.preventDefault() 
    var mousePos = getMousePos(evt);
    gridPos = layerZeroCoordinate(mousePos.x, mousePos.y)
    block = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    //console.log('Mouse position: ' + grid.x_grid + ',' + grid.y_grid);
    deleteBlockAtCoordinates(block.x, block.y, block.layer)
    return false;
}

function layerZeroCoordinate(x,y) { 
    //  
    a = (x - moveCanvasRight) / tileWidth
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

const posOfNextBlock = (block, gridPos) => {
    //

    x_new = block.x
    y_new = block.y
    layer_new = block.layer

    x = gridPos.x_grid
    y = gridPos.y_grid
    left = gridPos.left 

    x_ideal = block.x - block.layer
    y_ideal = block.y - block.layer

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

    topX=0
    topY=0
    topLayer=0
    //top check
    for (i = buildLimit-1; i >= 0; i--) {
        if ( (y+i < gridHeight) && (x+i < gridWidth) && (y+i >= 0) && (x+i >= 0) &&
        (world[i][y+i][x+i] > 1)){ //block isnt transparent.
            topX = x+i
            topY = y+i
            topLayer = i
            newLeft = left

            break;
        }
    }

    bottomX=0
    bottomY=0
    bottomLayer=0
    //bottom check

    for (i = buildLimit-1; i >= 1; i--) {
        if ( (y+i-1 < gridHeight) && (x+i-1 < gridWidth) && (y+i-1 >= 0) && (x+i-1 >= 0) &&
        (world[i][y+i-1][x+i-1] > 1)){ //block isnt transparent.
            bottomX = x+i-1
            bottomY = y+i-1
            bottomLayer = i
            newLeft = left

            break;
        }
    }

    //left check
    leftX = 0
    leftY = 0
    leftLayer = 0
    if (left){

        for (i = buildLimit-1; i >= 0; i--) {
            if ((y+i-1 < gridHeight) && (x+i < gridWidth) && (y+i-1 >= 0) && (x+i >= 0) &&
            (world[i][y+i-1][x+i] >= numOfTransparentBlocks)){
                leftX = x + i
                leftY = y + i -1
                leftLayer = i
                new_left = false
                break;
            }
        }
    }
    rightX = 0
    rightY = 0
    rightLayer = 0
    if (!left){
        for (i = buildLimit-1; i >= 0; i--) {
            if ((y+i < gridHeight) && (x+i-1 < gridWidth) && (y+i >= 0) && (x+i-1 >= 0) && 
            (world[i][y+i][x+i-1] >= numOfTransparentBlocks)){
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
            left : left,
            x: bottomX,  //why is it offset by -1 and -2??
            y: bottomY,
            layer: bottomLayer,
        }
    }


  };
//////////////////////////////////////



const placeBlockAtCoordinates = (x, y,z=1, paintMode=false) => {
    randomBlock = Math.floor(Math.random() * (3)) + 3;
    if( (x >= 0) && (y >= 0) && (z > 0) && (x < gridWidth) && (y < gridHeight) && (z < buildLimit) ){
        world[z][y][x] = randomBlock
    }
    drawWorld()
  };

const deleteBlockAtCoordinates = (y, x, layer) => {
    if (layer != 0){
        world[layer][x][y] = 0
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
  }

document.onkeydown = function(e){
    e.preventDefault();
    if(e.keyCode == 32){
        rotateWorld90();
    }
    if(e.keyCode == 81){
        console.log("q")
        paintModeLayer = 0;
        paintMode = true;        
    }

}

document.onkeyup = function(e){
    e.preventDefault();
    if(e.keyCode == 81){
        console.log("q")
        paintMode = false;        
    }

}