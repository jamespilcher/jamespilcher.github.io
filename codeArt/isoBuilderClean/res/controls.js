const holdDelay = 400
let repeatTimer
toolCanvas.addEventListener('click', UserSelectBlock);

function stopRepeating(){
    clearTimeout(repeatTimer)
}

function repeatWhileHeld(action, interval){
    function repeat(){
        action()
        repeatTimer = setTimeout(repeat, interval)
    }
    stopRepeating()
    action()
    repeatTimer = setTimeout(repeat, holdDelay)
}

canvas.addEventListener('mousedown', function(evt){
    evt.preventDefault()
    if (evt.button == 0){
        repeatWhileHeld(UserPlaceBlock, 100)
    }
    if (evt.button == 1){
        getBlock()
    }
    if (evt.button == 2){
        repeatWhileHeld(UserDeleteBlock, 200)
    }
});

window.addEventListener('mouseup', stopRepeating)
window.addEventListener('blur', stopRepeating)

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