const toolCanvas = document.getElementById('toolbar');
const toolCtx = toolCanvas.getContext('2d');
toolCtx.imageSmoothingEnabled=false

toolCanvas.style.left = 0
toolCanvas.width = (tileWidth + blockSpacing) * toolWidth + blockSpacing
toolCanvas.height = (tileHeight + blockSpacing) * toolHeight + blockSpacing
toolCanvas.style.top = 100 + "px"
const toolBar = new Array(toolHeight).fill(0).map(() => new Array(toolWidth).fill("air"));

// ctx.save();
// ctx.globalAlpha = alpha;
// ctx.translate((y-x) * tileWidth/2+centerGrid,(x+y)*tileHeight/4+(buildLimit-layerNum)*tileHeight/2);  //THE +500 AND +50 NEED TO CHANGE
// blockPos = block["texturePos"]*tileWidth
// ctx.drawImage(texture, blockPos, 0, tileWidth, tileHeight,0,0,tileWidth,tileHeight);
// ctx.restore();

const genToolBar = () =>{   //this could use some work. sort by groupType maybe. idk...
    texture.width = 7 * 48 
    counter = 0
    console.log(toolBar)

    for (var block in blockData) {
        i = Math.floor(counter/toolWidth)

        j = counter % toolWidth
        if (blockData[block]["isPlacable"]){
            console.log(i,j)
            toolBar[i][j] = block
        }
        else{continue}
        counter += 1
    }
    drawToolBar()
}

const drawToolBar = () =>{   //this could use some work. sort by groupType maybe. idk...
    counter = 0
    console.log(toolBar)
    toolCtx.clearRect(0, 0, canvas.width, canvas.height);
    for (q = 0; q < toolBar.length; q++){
        for (r = 0; r < toolBar[0].length; r++){
            if (toolBar[q][r]){
                block = blockData[toolBar[q][r]]
                drawToolBlock(block,r,q)
            }
       
        }
    }
    
}


const drawToolBlock = (block,x,y) =>{   //this could use some work. sort by groupType maybe. idk...
    toolCtx.save();
    toolCtx.translate(x*(tileWidth+blockSpacing)+blockSpacing, y*(tileHeight+blockSpacing)+blockSpacing);  //THE +500 AND +50 NEED TO CHANGE
    blockPos = block["texturePos"]*tileWidth
    toolCtx.drawImage(texture, blockPos, 0, tileWidth, tileHeight,0,0,tileWidth,tileHeight);
    toolCtx.restore();
}

const UserSelectBlock = (evt) =>{   //this could use some work. sort by groupType maybe. idk...
    var mousePos = getMousePos(evt, toolCanvas);
    drawToolBar()
    blockY = Math.floor((mousePos.y - blockSpacing) / (tileHeight+blockSpacing))
    blockX = Math.floor((mousePos.x - blockSpacing) / (tileHeight+ blockSpacing))
    if (blockY < 0){
        blockY = 0
    }
    currentBlock = toolBar[blockY][blockX]
    if (blockData[currentBlock]["isPlacable"]){
        drawToolBlock(blockData["highlight"],blockX,blockY)
    }
}
