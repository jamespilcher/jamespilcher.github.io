//store all the block data in here
// list of all possible blocks2

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');


const texture = new Image()
texture.src = "res/textures/blocks2.png"

texture.onload = _ => init()
const init = () => {
    drawWorld();
}

blockData = {
    "air" : { 
        "texturePos" : 0,
        "isSolid" : false
    },
    "shadow" : {
        "texturePos" : 1,
        "isSolid" : false
    },
    "grid" : {
        "texturePos" : 2,
        "isSolid" : true
    },
    "stone1" : {
        "texturePos" : 3,
        "isSolid" : true
    },
    "stone2" : {
        "texturePos" : 4,
        "isSolid" : true
    },
    "stone3" : {
        "texturePos" : 5,
        "isSolid" : true
    },
}