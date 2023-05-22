

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
audioUrls = []

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
      element.style.opacity = op;
      op += 0.02;
  }, 25);
}

function startGrid() {
  // fade in bodge
  startButton.style.display = 'none';
  numOfKeys = pianoKeys.length
  i = 0
  var timer = setInterval(function () {
    if (i == numOfKeys-1){
        clearInterval(timer);
        twinkle.style.display = 'unset';

    }
    fadeIn(pianoKeys[i])
    i += 1
  }, 25);


  pianoKeys.forEach((pianoKey, i) => {
    note = notes[Math.floor(Math.random() * notes.length)];
    const newUrl = 'res/piano/' + note + '.mp3';
    audioUrls.push(newUrl);
    pianoKey.addEventListener('mouseover', function() {
      playKey(i)
    })
})
    // get element by id 'StartButton'
}





// each time you hover over them, the tree grows< think forest!

function playKey(i) {
  growthWorld[i] += 1
  pianoKeys[i].style.backgroundColor = 'rgb(50, ' + growthWorld[i] * 30 + ', 10)'
  randomDegrowth()
  // grow tree
  playSound(audioUrls[i])
}

function autoPlayer(){
  playSpeed = Math.floor(Math.random() * 180) + 75;
  var timer = setInterval(function () {
    i = Math.floor(Math.random() * pianoKeys.length);
    if (i > numOfKeys-4){
      clearInterval(timer);
    }
    playKey(i)
  }, playSpeed);
}
