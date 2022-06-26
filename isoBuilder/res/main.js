
const gridWidth = 16
const gridHeight = 16
const buildLimit = 10

const tileHeight = 48  // 42 * 1  672  this is too big. the gap above the textures!
const tileWidth = 48   //         736
const origin = [gridWidth / 2, 1]

const world = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0)));
world[0] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(2));


//world[LAYERNUM][Y][X]

const texture = new Image()
texture.src = "res/textures/blocks.png"
texture.onload = _ => init()

const init = () => {
    world[1][4][4] = 3
    world[1][4][5] = 3
    world[1][4][6] = 4
    world[2][4][4] = 3
    world[2][4][5] = 3
    world[2][4][6] = 4
    world[3][4][4] = 3
    world[3][4][5] = 3
    world[3][4][6] = 4
    world[4][4][4] = 3
    world[4][4][5] = 3
    world[4][4][6] = 4
    world[5][4][4] = 3
    world[5][4][5] = 3
    world[5][4][6] = 4

    world[5][5][4] = 3
    world[5][5][5] = 3
    world[5][5][6] = 4
    world[5][6][4] = 3
    world[5][6][5] = 3
    world[6][6][6] = 4

    world[1][6][5] = 4


    world[9][15][7] = 4
    world[8][0][5] = 3
    world[2][0][5] = 3
    world[2][0][3] = 3




    var canvas = document.getElementById('world');
    var ctx = canvas.getContext('2d');
    drawWorld(ctx);
}

const drawWorld = (ctx) =>{   

    for (layerNum = 0; layerNum < world.length; layerNum++){
        for (y = 0; y < gridHeight; y++){
            for (x = 0; x < gridWidth; x++){
                blockVal = world[layerNum][y][x];
                if (blockVal == 0){ //only draw shadows on air blocks
                    drawShadowBlock(ctx,x,y,layerNum)
                    continue
                }
                drawImageTile(ctx,x,y,layerNum, blockVal); //draw the right cube.
            }
        }
    }
}

const drawImageTile = (c,x,y,layerNum, blockVal, alpha = 1) => {
    if (blockVal == 1){
        console.log("drawing shadow")
    }
	c.save();
    c.globalAlpha = alpha;
	c.translate((y-x) * tileWidth/2+500,(x+y)*tileHeight/4+(buildLimit-layerNum)*tileHeight/2);  //THE +500 AND +50 NEED TO CHANGE
	block = blockVal*tileWidth
    c.drawImage(texture, block, 0, tileWidth, tileHeight,0,0,tileWidth,tileHeight);
    c.restore();
}

const drawShadowBlock = (c,x,y,layerNum) => {            //draw layer, treat shadow as a 'bottom slab'. force these slabs where the shadows should be.
    for (i = layerNum; i < buildLimit; i++) {
        if (world[layerNum-1][y][x] < 2){  //dont draw a floating shadow
            break;
        }
        if (world[layerNum][y][x] > 1){  //dont draw a shadow on a solid block
            break;
        }
        if (world[i][y][x] > 1){  //if there is a solid block above the air block.
            shadowStrength = 1 - i/11
            drawImageTile(c,x,y,layerNum, 1,shadowStrength); //draw shadow 1=shadow;
            break;
        }
    }
}