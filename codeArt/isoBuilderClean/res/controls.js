leftMouseDown = false
rightMouseDown = false
toolCanvas.addEventListener('click', UserSelectBlock);

canvas.addEventListener('mousedown', function(evt){
    evt.preventDefault()
    evt.stopPropagation()
    function placingBlock(){
        UserPlaceBlock()
        leftMouseDown = setTimeout(placingBlock, 100);
    }
    function deletingBlock(){
        UserDeleteBlock()
        rightMouseDown = setTimeout(deletingBlock, 200);
    }

    if (evt.button == 0){
        placingBlock()
    }
    console.log("daf")

    if (evt.button == 1){
        console.log("middle")
        getBlock()
    }
    if (evt.button == 2){
        deletingBlock()
    }
    return false

    });

canvas.addEventListener('mouseup', function(evt){
    evt.preventDefault()
    evt.stopPropagation()

    if (leftMouseDown) {
        clearTimeout(leftMouseDown);
        leftMouseDown = false;
    }
    if (rightMouseDown) {
        clearTimeout(rightMouseDown);
        rightMouseDown = false;
    }
    return false

  });

canvas.addEventListener('contextmenu', function(evt){
    evt.preventDefault()
    return false
});

document.onkeydown = function(e){
    e.preventDefault();
    if(e.keyCode == 32){
        rotateWorld90();
    }
    if(e.keyCode == 70){
        fillLayer();     
    }

}

document.onkeyup = function(e){
    e.preventDefault();
    if(e.keyCode == 81){
        console.log("q")
        paintMode = false;        
    }

}