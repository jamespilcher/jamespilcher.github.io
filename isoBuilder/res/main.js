
const gridWidth = 16
const gridHeight = 16
const buildLimit = 5

const tileheight = 42
const tilewidth = 46
const origin = [gridWidth / 2, 1]

// 5 is the number of rows and 4 is the number of columns.
const world = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0));
// assume aspect ratio of tile is 2:1
// 64 to 32
const texture = new Image()
texture.src = "res/textures/blocks.png"
texture.onload = _ => init()


function resizeCanvas(gridWidth, gridheight, tilewidth, tileheight,buildLimit) {
    var canvas = document.getElementById("myCanvas");  
    canvas.width = gridWidth*tilewidth;
    canvas.height = gridheight * tileheight;
  }

window.onload = function(){
    var canvas = document.getElementById('layer1');
    var ctx = canvas.getContext('2d');
    var img = new Image();   // Create new img element
    img.src = "res/textures/kitty.jpg"
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    var canvas2 = document.getElementById('layer2');
    var ctx2 = canvas2.getContext('2d');
    var img2 = new Image();   // Create new img element
    img2.onload = function() {
        ctx2.drawImage(img, 0, 0);
    };
    var canvas3 = document.getElementById('layer3');
    var ctx3 = canvas2.getContext('2d');
    var img3 = new Image();   // Create new img element
    img3.onload = function() {
        ctx2.drawImage(img, 0, 0);
    };
    var canvas4 = document.getElementById('layer4');
    var ctx4 = canvas2.getContext('2d');
    var img4 = new Image();   // Create new img element
    img4.onload = function() {
        ctx2.drawImage(img, 0, 0);
    };
}

