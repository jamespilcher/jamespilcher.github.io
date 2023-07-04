currentBlockCoords = {left: false, x : 0, y : 0, layer : 0};
nextBlockCoords = {x : 0, y : 0, layer : 0};
currentBlock = "air"

const tileHeight = 48  // 42 * 1  672  this is too big. the gap above the textures!
const tileWidth = 48   //         736

const gridWidth = 14
const gridHeight = 14
const buildLimit = 8

lightSpread = 3

//tool bar settings
toolWidth = 11
toolHeight = 2
blockSpacing = 4 //FOR TOOLBAR



const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled=false




canvas.width = tileWidth * (gridWidth)
canvas.height = tileHeight * (gridHeight - 3)
const centerGrid = (canvas.width- tileWidth) / 2


const texture = new Image()
texture.src = "res/textures/blocks.png"

texture.onload = _ => init()
const init = () => {
    genToolBar();
    drawWorld();
}

const world = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill("air")));
const shadow = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0)));

world[0] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill("grid"));

const drawWorld = () =>{   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
/*     fontSize = 18
    textOffset = 5
    ctx.font = fontSize + "px Serif";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    block = "Current Block: " + currentBlock
    currentCoord = "Current Coordinates: " + currentBlockCoords.x + ", " + currentBlockCoords.y + ", " + currentBlockCoords.layer
    nextCoord = "Next Coordinates: " + nextBlockCoords.x + ", " + nextBlockCoords.y + ", " + nextBlockCoords.layer
    ctx.fillText(block, textOffset, 20);
    ctx.fillText(currentCoord, textOffset, 40);
    ctx.fillText(nextCoord, textOffset, 60); */


    for (layerNum = 0; layerNum < world.length; layerNum++){
        for (y = 0; y < gridHeight; y++){
            for (x = 0; x < gridWidth; x++){
                block = world[layerNum][y][x];
                drawImageTile(x,y,layerNum, blockData[block]); //draw the right cube.
                if (blockData[block]["shadowsOnBottom"]){ //only draw shadows on air blocks
                    shadowStrength = calcShadow(x,y,layerNum)
                    if (shadowStrength){
                        drawImageTile(x,y,layerNum, blockData["shadow"],shadowStrength); //draw the right cube.
                    }
                    continue
                }
            }
        }
    }
}


const drawImageTile = (x,y,layerNum, block, alpha=1) => {
	ctx.save();
    ctx.globalAlpha = alpha;
	ctx.translate((y-x) * tileWidth/2+centerGrid,(x+y)*tileHeight/4+(buildLimit-layerNum)*tileHeight/2);
	blockPos = block["texturePos"]*tileWidth
    ctx.drawImage(texture, blockPos, 0, tileWidth, tileHeight,0,0,tileWidth,tileHeight);
    ctx.restore();
}

const calcShadow = (x,y,layerNum) => {            //draw layer, treat shadow as a 'bottom slab'. force these slabs where the shadows should be.
    //only called on air blocks anyway

    shadowStrength = 0
    if (!blockData[world[layerNum-1][y][x]]["receiveShadows"]){  //if block below doesnt receive shadows.
        return 0;
    }
    //check if lighting block is near

    // go up until we find the first item that casts shadows
    for (i = layerNum; i < buildLimit; i++) {
        if (blockData[world[i][y][x]]["castShadows"]){  //if block above cast shadows
            shadowStrength = 1 - (i-layerNum)/(i-layerNum+3) // 3 is arbritrary
            //shadow[layerNum][y][x] = shadowStrength
            //drawImageTile(x,y,layerNum, blockData["shadow"],shadowStrength); //draw shadow 1=shadow;
            break;
        }
    }
    return shadowStrength
}