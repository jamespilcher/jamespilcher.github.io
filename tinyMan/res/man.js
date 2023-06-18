const manSize = 32;

canvas = document.getElementById('manCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 350;
canvas.height = 350;
ctx.imageSmoothingEnabled=false;


class Man {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.rotation = Math.random() * 2 * Math.PI;
      this.state = 0;
      this.image = new Image();
      
      this.moveTimer = null;
      this.turnTimer = null;
      this.thinkTimer = null;
      var colours = ["blue", "green", "yellow", "red", "cyan", "purple"];
      this.image.src = "res/men/man-" + colours[Math.floor(Math.random() * colours.length)] + ".png";
      
      const self = this; // Store reference to 'this'

      this.image.onload = function() {
        self.turn();
        self.pickState();
      }
    }
    
    // set timeout of 1 sec
    pickState() {
        const self = this;
        var timer = setInterval(function () {
            clearInterval(self.moveTimer);
            clearInterval(self.turnTimer);
            clearInterval(self.thinkTimer);
            let newState = self.skewedRandom();
            if (newState == 0){
                self.think();
            }
            else if (newState == 1){
                self.turn();
            }
            else if (newState == 2){
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
            var newX = self.x + Math.cos(self.rotation - Math.PI / 2) * 2;
            var newY = self.y + Math.sin(self.rotation - Math.PI / 2) * 2;
            if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
                self.rotation = self.rotation + Math.PI;
                return;
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
        }, 500);
    }

  }


adam = new Man(canvas.width/2, canvas.height/2);
men = [adam];
canvas.addEventListener('click', function(e) { // get the mouse click coordinates
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var manX = x - manSize / 2; // Center the man horizontally
        var manY = y - manSize / 2; // Center the man vertically

        man = new Man(x, y);
        men.push(man);
    }
);


function drawMan(x, y, rotation, image) {
    ctx.save(); // Save the current canvas state
    ctx.translate(x, y); // Translate to the specified coordinates
    ctx.rotate(rotation); // Rotate by the specified angle (in radians)
    ctx.drawImage(image, -image.width / 2, -image.height / 2); // Draw the image centered at (0, 0)
    ctx.restore(); // Restore the canvas state
  }
// main, draw men function
setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for( man of men){
        drawMan(man.x,man.y,man.rotation, man.image);
    }
}, 25);