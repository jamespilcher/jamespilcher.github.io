const moveCanvasRight = 500
const tileHeight = 48  // 42 * 1  672  this is too big. the gap above the textures!
const tileWidth = 48   //         736


const numOfTransparentBlocks = 2 // air and shadow..


const gridWidth = 18
const gridHeight = 18
const buildLimit = 12
const origin = [gridWidth / 2, 1]


const texture = new Image()
texture.src = "res/textures/blocks2.png"
const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

texture.onload = _ => init()
const init = () => {
    drawWorld();
}

const world = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0)));
world[0] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(2));


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
            shadowStrength = 1 - (i-layerNum)/(i-layerNum+3) // 3 is arbritrary
            drawImageTile(x,y,layerNum, 1,shadowStrength); //draw shadow 1=shadow;
            break;
        }
    }
}