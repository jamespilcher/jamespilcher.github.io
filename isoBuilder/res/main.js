
const gridWidth = 18
const gridHeight = 18
const buildLimit = 15

const moveCanvasRight = 500
const tileHeight = 48  // 42 * 1  672  this is too big. the gap above the textures!
const tileWidth = 48   //         736
const origin = [gridWidth / 2, 1]

const numOfTransparentBlocks = 2 // air and shadow..
const world = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0)));
world[0] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(2));


//world[LAYERNUM][Y][X]

const texture = new Image()
texture.src = "res/textures/blocks.png"
texture.onload = _ => init()
const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

const init = () => {
    world[1][0][0] = 2
    world[1][1][0] = 2

    drawWorld();
}

const drawWorld = () =>{   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (layerNum = 0; layerNum < world.length; layerNum++){
        for (y = 0; y < gridHeight; y++){
            for (x = 0; x < gridWidth; x++){
                blockVal = world[layerNum][y][x];
                if (blockVal == 0){ //only draw shadows on air blocks
                    drawShadowBlock(x,y,layerNum)
                    continue
                }
                drawImageTile(x,y,layerNum, blockVal); //draw the right cube.
            }
        }
    }
}

const drawImageTile = (x,y,layerNum, blockVal, alpha = 1) => {
	ctx.save();
    ctx.globalAlpha = alpha;
	ctx.translate((y-x) * tileWidth/2+moveCanvasRight,(x+y)*tileHeight/4+(buildLimit-layerNum)*tileHeight/2);  //THE +500 AND +50 NEED TO CHANGE
	block = blockVal*tileWidth
    ctx.drawImage(texture, block, 0, tileWidth, tileHeight,0,0,tileWidth,tileHeight);
    ctx.restore();
}

const drawShadowBlock = (x,y,layerNum) => {            //draw layer, treat shadow as a 'bottom slab'. force these slabs where the shadows should be.
    //only called on air blocks anyway
    for (i = layerNum; i < buildLimit; i++) {
        if (layerNum > 0 && (world[layerNum-1][y][x] < numOfTransparentBlocks - 1)){  //dont draw a floating shadow
            break;
        }

        if (world[i][y][x] > 1){  //if there is a solid block above the air block.
            shadowStrength = 1 - i/(buildLimit+1)
            drawImageTile(x,y,layerNum, 1,shadowStrength); //draw shadow 1=shadow;
            break;
        }
    }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();

    return {
      x: (evt.clientX - rect.left),
      y: (evt.clientY - rect.top)
    };
  }

//left click
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(evt);
    gridPos = to_grid_coordinate(mousePos.x, mousePos.y)
    block = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    where = projectDownward(block, gridPos)
    //console.log('Mouse position: ' + grid.x_grid + ',' + grid.y_grid);
    placeBlock(where.x, where.y, where.layer)
    return false;
  }, false);

//right click
canvas.addEventListener('contextmenu', function(evt) {
    evt.preventDefault() 
    var mousePos = getMousePos(evt);
    gridPos = to_grid_coordinate(mousePos.x, mousePos.y)
    block = selectedBlock(gridPos.x_grid, gridPos.y_grid, gridPos.left)
    //console.log('Mouse position: ' + grid.x_grid + ',' + grid.y_grid);
    deleteBlock(block.x, block.y, block.layer)
    return false;
}, false);

function to_grid_coordinate(x,y) {   
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

const projectDownward = (block, gridPos) => {
    x_new = block.x
    y_new = block.y
    layer_new = block.layer

    x = gridPos.x_grid
    y = gridPos.y_grid
    left = gridPos.left 
    x_ideal = block.x - block.layer
    y_ideal = block.y - block.layer
    console.log(x,y)
    console.log(x_ideal, y_ideal)

    if (x == x_ideal && y == y_ideal){
        layer_new += 1
    }
    if (x == x_ideal && y == y_ideal+1){
        //bottom
        y_new += 1
    }
    if (x == x_ideal+1 && y == y_ideal){
        //bottom
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
        (world[i][y+i][x+i] > 1)){
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
        (world[i][y+i-1][x+i-1] > 1)){
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
        console.log("top wins")

        return {
            left : new_left,
            x: topX,  //why is it offset by -1 and -2??
            y: topY,
            layer: topLayer,
        }
    }
    else if ((rightLayer > topLayer) && (rightLayer >= bottomLayer) && (rightLayer > leftLayer)){
        console.log("right wins")
        return {
            left : new_left,
            x: rightX,  //why is it offset by -1 and -2??
            y: rightY,
            layer: rightLayer,
        }
    }
    else if ((leftLayer > topLayer) && (leftLayer >= bottomLayer) &&(leftLayer > rightLayer)){
        console.log("left wins")

        return {
            left : new_left,
            x: leftX,  //why is it offset by -1 and -2??
            y: leftY,
            layer: leftLayer,
        }
    }
    else{
        console.log("bottom wins")
        return {
            left : left,
            x: bottomX,  //why is it offset by -1 and -2??
            y: bottomY,
            layer: bottomLayer,
        }
    }


  };
//////////////////////////////////////



const placeBlock = (x, y,z=1) => {
    randomBlock = Math.floor(Math.random() * (3)) + 2;
    if( (x >= 0) && (y >= 0) && (x < gridWidth) && (y < gridHeight) && (z < buildLimit) ){
        world[z][y][x] = randomBlock
    }
    drawWorld()
  };

const deleteBlock = (y, x, layer) => {
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
}