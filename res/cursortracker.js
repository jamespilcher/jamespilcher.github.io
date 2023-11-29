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

    c.width = window.innerWidth
    c.height = window.innerHeight
    console.log(c.width, c.height)
}

function getCursorPos(event){
    x = event.pageX - document.documentElement.scrollLeft;
    y = event.pageY - document.documentElement.scrollTop;
    return [x,y];
}
var ctx = c.getContext("2d");

setCSize();

class mousePosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
mousePositions = [];

class firework {
    constructor(x, y, base_colour) {
        this.x = x;
        this.y = y;
        this.base_colour = base_colour;
    }
    explode() {
        for (i = 0; i < 20; i++) {
            embers.push(new ember(this.x, this.y, this.base_colour));
        }
    }
}
class ember {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.size = 12;
        this.speed = 5;
        this.xDirectionModifier = Math.random() * 2 - 1;  
        this.yDirectionModifier = Math.random() * 2 - 1;
        let self = this;      
        let timer = setInterval(function() {
            console.log("ember", self.x, self.y, self.size)
            self.x += self.speed * self.xDirectionModifier;
            self.y += self.speed * self.yDirectionModifier;
            self.size -= 1;
            if (self.size < 0) {
                // remove from list
                embers.splice(embers.indexOf(self), 1);
                clearInterval(timer);
            }
        }, 40);
    }
}

embers = [];

function updateCursor(event){
    if (mousePositions.length > 6) {
        mousePositions.shift();
    }
    var x;
    var y;
    [x,y] = getCursorPos(event);
    mousePositions.push(new mousePosition(x, y));
}


document.addEventListener('mousemove', updateCursor);

mouseColours = ["rgba(90, 140, 90, 0.8)", "rgba(255, 140, 255, 0.8)", "rgba(255, 140, 90, 0.8)", "rgba(90, 140, 255, 0.8)"];
currentColourIndex = Math.floor(Math.random() * mouseColours.length);

// on mouse down change colour
document.addEventListener('mousedown', function(event) {
    setCSize(); // reset if need be, in case there is a bug..
    var [x,y] = getCursorPos(event);
    let fire = new firework(x, y, mouseColours[currentColourIndex]);
    fire.explode();
    currentColourIndex = (currentColourIndex + 1) % mouseColours.length;
});

maxSize = 8;
minSize = 5;

// ease off from max size to min size depending on index
function getSize(index) {
    return minSize + (index * (maxSize - minSize) / mousePositions.length);
}
ctx.fillStyle = "rgba(90, 140, 90, 0.8)";
setInterval(function() {
    ctx.clearRect(0, 0, c.width, c.height);
    // Mouse cursor trail
    for (i = 0; i < mousePositions.length; i++) {
        ctx.fillStyle = mouseColours[currentColourIndex]
        size = getSize(i);
        ctx.fillRect(mousePositions[i].x - 2, mousePositions[i].y + 7, size, size);
    }

    // Embers for fire works
    for (i = 0; i < embers.length; i++) {
        ctx.fillStyle = embers[i].colour;
        ctx.fillRect(embers[i].x, embers[i].y, embers[i].size, embers[i].size);
    }
}
, 20);

setInterval(function() {
    if (mousePositions.length > 1) {
        mousePositions.shift();
    }
}
, 80);
