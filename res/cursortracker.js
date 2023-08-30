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

function getCursorPos(event){
    return [event.pageX - - document.documentElement.scrollLeft, event.pageY - document.documentElement.scrollTop];
}
c.style.position = "fixed";
c.style.zIndex = "99";
var ctx = c.getContext("2d");


timer = setInterval(function() {
    setCSize();
    clearInterval(timer);
}, 250);

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
    x,y = getCursorPos(event);
    // add scroll distance 
    x = event.pageX - document.documentElement.scrollLeft;
    y = event.pageY - document.documentElement.scrollTop;
    mousePositions.push(new mousePosition(x, y));
    console.log(event.pageY, document.documentElement.scrollTop, c.height)

});

mouseColours = ["rgba(90, 140, 90, 0.8)", "rgba(255, 140, 255, 0.8)", "rgba(255, 140, 90, 0.8)", "rgba(90, 140, 255, 0.8)"];
currentColour = 0;

// on mouse down change colour
document.addEventListener('mousedown', function(event) {
    x = event.pageX - document.documentElement.scrollLeft;
    y = event.pageY - document.documentElement.scrollTop;

    currentColour = (currentColour + 1) % mouseColours.length;
    firework( x, y);
});

function firework(x,y){
    // firework
    console.log("firework");
}


maxSize = 8;
minSize = 5;

// ease off from max size to min size depending on index
function getSize(index) {
    return minSize + (index * (maxSize - minSize) / mousePositions.length);
}
ctx.fillStyle = "rgba(90, 140, 90, 0.8)";
setInterval(function() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (i = 0; i < mousePositions.length; i++) {
        ctx.fillStyle = mouseColours[currentColour]
        size = getSize(i);
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
