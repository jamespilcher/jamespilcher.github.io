const tileHeight = 48  // 42 * 1  672  this is too big. the gap above the textures!
const tileWidth = 48   //         736

const gridWidth = 15
const gridHeight = 15
const buildLimit = 12


//tool bar settings
toolWidth = 2
toolHeight = 10
blockSpacing = 4 //FOR TOOLBAR



const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');



canvas.width = tileWidth * (gridWidth+2)
canvas.height = tileHeight * (gridHeight)

toolPosition = ((tileWidth + blockSpacing) * toolWidth + blockSpacing)

canvas.style.left = toolPosition + "px"
const centerGrid = (canvas.width- tileWidth) / 2


const texture = new Image()
texture.src = "res/textures/blocks.png"

texture.onload = _ => init()
const init = () => {
    genToolBar();
    drawWorld();
}


const world = new Array(buildLimit).fill(0).map(() => new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill("air")));
world[0] = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill("grid"));

const drawWorld = () =>{   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

const drawImageTile = (x,y,layerNum, block, alpha = 1) => {
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
        if (world[layerNum-1][y][x] == "air"){  //dont draw a floating shadow
            break;
        }

        if (blockData[world[i][y][x]]["isSolid"]){  //if there is a solid block above the air block.
            shadowStrength = 1 - (i-layerNum)/(i-layerNum+3) // 3 is arbritrary
            drawImageTile(x,y,layerNum, blockData["shadow"],shadowStrength); //draw shadow 1=shadow;
            break;
        }
    }
}