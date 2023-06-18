const manSize = 32;
const bombSize = 32;
const numMen = 400;

canvas = document.getElementById('manCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 450;
canvas.height = canvas.width;
ctx.imageSmoothingEnabled = false;

men = [];
bombs = [];

class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.explode();
        bombs.push(this);
    }

    explode() {
        // after x seconds, remove the bomb from the array
        const self = this;
        setTimeout(function () {
            bombs.splice(bombs.indexOf(self), 1);
        }, 100);
    }

}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.image = new Image();
        this.image.src = "res/men/man-red.png"
        this.placeBombTrail();

    }
    updateRotation() {
        this.rotation = Math.atan2(bombs[0].y - this.y, bombs[0].x - this.x) + 3 * Math.PI / 2;
    }
    placeBombTrail() {
        const self = this
        var timer = setInterval(function () {
            var bomb = new Bomb(self.x, self.y);
        }, 25);
    }
}

class Man {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.spawnX = x;
        this.spawnY = y;
        
        this.rotation = Math.random() * 2 * Math.PI;
        this.state = 0;
        this.image = new Image();
        var colours = ["blue", "green", "yellow", "red", "cyan", "purple"];
        this.image.src = "res/men/man-" + colours[Math.floor(Math.random() * colours.length)] + ".png";
        this.reactionTime = Math.random() * 200 + 45;
        this.rotationPertubation = (Math.random() - 0.5) * 0.03;
        this.speed = Math.random() * 0.5 + 1.7;
        this.moveTimer = null;
        this.turnTimer = null;
        this.thinkTimer = null;
        this.runTimer = null; // timer for running away from bomb
        this.pickStateTimer = null;

        men.push(this);

        const self = this; // Store reference to 'this'

        this.image.onload = function () {
            self.turn();
            self.checkForBombs();
            self.pickState();
        }
    }

    // set timeout of 1 sec
    pickState() {
        const self = this;
        this.pickStateTimer = setInterval(function () {
            clearInterval(self.runTimer);
            self.runTimer = null;
            clearInterval(self.moveTimer);
            self.moveTimer = null;
            clearInterval(self.turnTimer);
            self.turnTimer = null;
            clearInterval(self.thinkTimer);
            self.thinkTimer = null;

            let newState = self.skewedRandom();
            if (newState == 0) {
                self.think();
            }
            else if (newState == 1) {
                self.turn();
            }
            else if (newState == 2) {
                self.move();
            }
        }, 1000);
    }

    skewedRandom() {
        const states = [0, 1, 2]; // The three states
        const weights = [0.1, 0.4, 0.5]; // The corresponding weights or probabilities

        // Calculate the total weight
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

        // Generate a random number between 0 and the total weight
        const random = Math.random() * totalWeight;

        let sum = 0;
        for (let i = 0; i < states.length; i++) {
            sum += weights[i];
            if (random < sum) {
                return states[i]; // Return the selected state
            }
        }
    }


    move() {
        const self = this;
        self.moveTimer = setInterval(function () {
            // ensure greater than 0, less than height and width
            var newX = self.x + Math.cos(self.rotation - Math.PI / 2) * self.speed;
            var newY = self.y + Math.sin(self.rotation - Math.PI / 2) * self.speed;
            // turn around if hit wall
            if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
                self.rotation = Math.atan2(self.spawnY - self.y, self.spawnX - self.x) + Math.PI / 2;
                newX = self.x + Math.cos(self.rotation - Math.PI / 2) * self.speed;
                newY = self.y + Math.sin(self.rotation - Math.PI / 2) * self.speed;
                //self.rotation = self.rotation + Math.PI + 0.03; // some random amount
            }
            self.x = newX;
            self.y = newY;
        }, 25);
    }

    turn() {
        const minDistance = Math.PI;
        let newRotation = 2 * Math.PI * Math.random();
        const self = this;
        let amountToChange = (newRotation - self.rotation) * 0.05;
        // interpolate between current rotation and new rotation
        self.turnTimer = setInterval(function () {
            if (Math.abs(amountToChange) < 0.03) {
                clearInterval(self.turnTimer);
                self.turnTimer = null;
                return;
            }
            amountToChange = (newRotation - self.rotation) * 0.1;
            self.rotation = self.rotation + amountToChange;
            //self.drawMan(self.x, self.y, self.rotation);
        }, 25);
        return;
    }

    think() {
        const self = this;
        self.thinkTimer = setInterval(function () {
        }, 25);
    }

    checkForBombs() {
        const self = this;
        setInterval(function () {
            clearInterval(self.runTimer);  // don't run twice at once
            self.runTimer = null;
            if (bombs.length) {
                // find closest bomb
                var closestBombDist = canvas.width;
                var closestBomb = null;
                for (var i = 0; i < bombs.length; i++) {
                    var bombX = bombs[i].x;
                    var bombY = bombs[i].y;
                    var distance = Math.sqrt(Math.pow(bombX - self.x, 2) + Math.pow(bombY - self.y, 2));
                    if (distance < closestBombDist) {
                        closestBombDist = distance;
                        closestBomb = bombs[i];
                    }
                }
                if (closestBombDist < 85) {
                    // clear previous states
                    clearInterval(self.thinkTimer); // don't pick a new state, instead run!
                    self.thinkTimer = null;
                    clearInterval(self.turnTimer); // don't pick a new state, instead run!
                    self.turnTimer = null;
                    clearInterval(self.moveTimer); // don't pick a new state, instead run!
                    self.moveTimer = null;
                    // dont pick new state
                    clearInterval(self.pickStateTimer);
                    self.pickStateTimer = null;
                    // run!
                    self.runFromBomb(closestBomb);
                }
            }
            if (!self.runTimer && !self.pickStateTimer) {
                self.pickState();
            }
        }, self.reactionTime);
    }
    runFromBomb(bomb) {
        var bombX = bomb.x;
        var bombY = bomb.y;
        const self = this;
        this.rotation = Math.atan2(bombY - self.y, bombX - self.x) + 3 * Math.PI / 2;
        this.runTimer = setInterval(function () {
            self.rotation += self.rotationPertubation;
            const speedMultiplier = 1.5;
            var newX = self.x + Math.cos(self.rotation - Math.PI / 2) * self.speed * speedMultiplier;
            var newY = self.y + Math.sin(self.rotation - Math.PI / 2) * self.speed * speedMultiplier;
/*             if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
                self.rotation = self.rotation + Math.PI; // some random amount
                newX = self.x + Math.cos(self.rotation - Math.PI / 2) * self.speed * speedMultiplier;
                newY = self.y + Math.sin(self.rotation - Math.PI / 2) * self.speed * speedMultiplier;
            } */
            self.x = newX;
            self.y = newY;
        }, 25);
    }
}


for (var i = 0; i < numMen; i++) {
    // random number in a range rect.left, rect.right

    randomX = Math.random() * canvas.width;
    randomY = Math.random() * canvas.height;
    new Man(randomX, randomY);
}

canvas.addEventListener('click', function (e) { // get the mouse click coordinates
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var manX = x - manSize / 2; // Center the man horizontally
    var manY = y - manSize / 2; // Center the man vertically

    man = new Man(x, y);
}
);

canvas.addEventListener('contextmenu', function (e) { // get the mouse click coordinates
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var manX = x - bombSize / 2; // Center the man horizontally
    var manY = y - bombSize / 2; // Center the man vertically

    bomb = new Bomb(x, y);
}
);

canvas.addEventListener('mousemove', function (e) { // get the mouse move coordinates
    e.preventDefault();
    player.updateRotation();
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    player.x = x;
    player.y = y;
}
);


function drawFig(x, y, rotation, image) {
    ctx.save(); // Save the current canvas state
    ctx.translate(x, y); // Translate to the specified coordinates
    ctx.rotate(rotation); // Rotate by the specified angle (in radians)
    ctx.drawImage(image, -image.width / 2, -image.height / 2); // Draw the image centered at (0, 0)
    ctx.restore(); // Restore the canvas state
}
// main, draw men function
// each frame check and see if you need to run from bombs

player = new Player(0, 0);

setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFig(player.x, player.y, player.rotation, player.image);
    for (man of men) {
        drawFig(man.x, man.y, man.rotation, man.image);
    }
}, 25);