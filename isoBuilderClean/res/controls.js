
toolCanvas.addEventListener('click', UserSelectBlock);

canvas.addEventListener('click', UserPlaceBlock);
canvas.addEventListener('contextmenu', UserDeleteBlock, false)

document.onkeydown = function(e){
    e.preventDefault();
    if(e.keyCode == 32){
        rotateWorld90();
    }
    if(e.keyCode == 81){
        console.log("q")
        paintModeLayer = 0;s
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