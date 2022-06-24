
const gridWidth = 16
const gridHeight = 16
const buildLimit = 16

const tileheight = 16
const tilewidth = 32
const origin = [gridWidth / 2, 1]

// 5 is the number of rows and 4 is the number of columns.
const world = new Array(gridHeight).fill(0).map(() => new Array(gridWidth).fill(0));
// assume aspect ratio of tile is 2:1
// 64 to 32



window.onload = function(){
    var canvas = document.getElementById('plane');
    var ctx = canvas.getContext('2d');
    var img = new Image();   // Create new img element
    var img = document.getElementById("kitty");
    ctx.drawImage(img, 10, 10, 150, 180);
    ctx.drawImage(img,0,0)
  }

