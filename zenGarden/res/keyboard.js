

const rows = 6;
const columns = 8;

// create a grid of rows by collumns, code goes here

growthWorld = new Array(rows*columns).fill(1)

// size of audio folder
const notes = [ "A2", "A3", "A4", "A5", "A6", "A7",
                "C2", "C3", "C4", "C5", "C6", "C7",
                "D2", "D3", "D4", "D5", "D6", "D7",
                "E2", "E3", "E4", "E5", "E6", "E7",
                "G2", "G3", "G4", "G5", "G6", "G7" ]

// Get the grid container element
const gridContainer = document.querySelector('.grid-container');

function playSound(newUrl) {
  new Audio(newUrl).play()
}

// Create the grid dynamically
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    // Create a grid item (div element)
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.style.opacity = 0;
    // Append the grid item to the grid container
    gridContainer.appendChild(gridItem);
  }
}


const pianoKeys = document.querySelectorAll('.grid-item')

function playSound(newUrl) {
    new Audio(newUrl).play()
}

function randomDegrowth(){
  randomSquare = Math.floor(Math.random() * growthWorld.length);
  growthWorld[randomSquare] -= .3;
  pianoKeys[randomSquare].style.backgroundColor = 'rgb(50, ' + growthWorld[randomSquare] * 30 + ', 10)';
}


function fadeIn(element){
  var op = 0;  // initial opacity
  var timer = setInterval(function () {
      if (op == 1){
          clearInterval(timer);
      }
      op += 0.02;
      element.style.opacity = op;
  }, 25);
}

function startGrid() {

  // fade in bodge
  numOfKeys = pianoKeys.length
  i = 0
  setInterval(function () {
    if (i == numOfKeys){
        clearInterval(timer);
    }
    fadeIn(pianoKeys[i])
    i += 1
  }, 10);


  startButton.style.display = 'none';
  pianoKeys.forEach((pianoKey, i) => {
    note = notes[Math.floor(Math.random() * notes.length)];
    const newUrl = 'res/piano/' + note + '.mp3'
    pianoKey.addEventListener('mouseover', function() {
      growthWorld[i] += 1
      pianoKey.style.backgroundColor = 'rgb(50, ' + growthWorld[i] * 30 + ', 10)'
      randomDegrowth()
      // grow tree
      playSound(newUrl)
    })
})
}





// each time you hover over them, the tree grows< think forest!