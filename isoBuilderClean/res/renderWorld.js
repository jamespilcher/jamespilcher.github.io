currentBlockCoords = {left: false, x : 0, y : 0, layer : 0};
nextBlockCoords = {x : 0, y : 0, layer : 0};
currentBlock = "air"

const tileHeight = 48  // 42 * 1  672  this is too big. the gap above the textures!
const tileWidth = 48   //         736

const gridWidth = 18
const gridHeight = 18
const buildLimit = 12


//tool bar settings
toolWidth = 3
toolHeight = 7
blockSpacing = 4 //FOR TOOLBAR



const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled=false




canvas.width = tileWidth * (gridWidth+2)
canvas.height = tileHeight * (gridHeight)

toolPosition = ((tileWidth + blockSpacing) * toolWidth + blockSpacing)

canvas.style.left = toolPosition + "px"
const centerGrid = (canvas.width- tileWidth) / 2


const texture = new Image()
texture.src = "res/textures/textures.png"

texture.onload = _ => init()
const init = () => {
    genToolBar();
    drawWorld();
}

const world = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill("air")));
world[0] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill("grid"));

const drawWorld = () =>{   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fontSize = 18
    textOffset = 5
    ctx.font = fontSize + "px Serif";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    block = "Current Block: " + currentBlock
    currentCoord = "Current Coordinates: " + currentBlockCoords.x + ", " + currentBlockCoords.y + ", " + currentBlockCoords.layer
    nextCoord = "Next Coordinates: " + nextBlockCoords.x + ", " + nextBlockCoords.y + ", " + nextBlockCoords.layer
    ctx.fillText(block, textOffset, 20);
    ctx.fillText(currentCoord, textOffset, 40);
    ctx.fillText(nextCoord, textOffset, 60);


    for (layerNum = 0; layerNum < world.length; layerNum++){
        for (y = 0; y < gridHeight; y++){
            for (x = 0; x < gridWidth; x++){
                block = world[layerNum][y][x];
                if (block == "air"){ //only draw shadows on air blocks
                    calcShadow(x,y,layerNum)
                    continue
                }
                drawImageTile(x,y,layerNum, blockData[block]); //draw the right cube.
            }
        }
    }
}

const drawImageTile = (x,y,layerNum, block, alpha=1) => {
	ctx.save();
    ctx.globalAlpha = alpha;
	ctx.translate((y-x) * tileWidth/2+centerGrid,(x+y)*tileHeight/4+(buildLimit-layerNum)*tileHeight/2);  //THE +500 AND +50 NEED TO CHANGE
	blockPos = block["texturePos"]*tileWidth
    ctx.drawImage(texture, blockPos, 0, tileWidth, tileHeight,0,0,tileWidth,tileHeight);
    ctx.restore();
}

const calcShadow = (x,y,layerNum) => {            //draw layer, treat shadow as a 'bottom slab'. force these slabs where the shadows should be.
    //only called on air blocks anyway

    for (i = layerNum; i < buildLimit; i++) {
        if (world[layerNum-1][y][x] == "air"){  //if receive shdows
            break;
        }

        if (blockData[world[i][y][x]]["isSolid"]){  //if cast shadows
            shadowStrength = 1 - (i-layerNum)/(i-layerNum+3) // 3 is arbritrary
            drawImageTile(x,y,layerNum, blockData["shadow"],shadowStrength); //draw shadow 1=shadow;
            break;
        }
    }
}