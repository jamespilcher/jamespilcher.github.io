// canvas over entire screen
var c = document.getElementById("cursortracker");

function setCSize(){
    c.width = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.body.clientWidth,
        document.documentElement.clientWidth
      );
      
    c.height = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
    );
}
setCSize();
c.style.position = "fixed";
c.style.zIndex = "99";
var ctx = c.getContext("2d");

// when mouse moves left to right, draw a line
class mousePosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
mousePositions = [];

// on mouse move, update mouse position
// fix on resize
window.addEventListener('scroll', function() {
    setCSize();
    mousePositions = [];
});

window.addEventListener('resize', function() {
    setCSize();
    mousePositions = [];
});

document.addEventListener('mousemove', function(event) {
    if (mousePositions.length > 10) {
        mousePositions.shift();
    }
    x = event.pageX
    y = event.pageY
    mousePositions.push(new mousePosition(x, y));
    console.log(event.pageY, document.documentElement.scrollTop, c.height)

});

maxSize = 8;
minSize = 5;

// ease off from max size to min size depending on index
function getSize(index) {
    return minSize + (index * (maxSize - minSize) / mousePositions.length);
}

setInterval(function() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (i = 0; i < mousePositions.length; i++) {
        size = getSize(i);
        ctx.fillStyle = "rgba(90, 140, 90, 0.8)";
        ctx.fillRect(mousePositions[i].x - 2, mousePositions[i].y + 7, size, size);
    }
    // 
}
, 20);

setInterval(function() {
    if (mousePositions.length > 1) {
        mousePositions.shift();
    }
}
, 80);

timer = setInterval(function() {
    setCSize();
    clearInterval(timer);
}, 250);