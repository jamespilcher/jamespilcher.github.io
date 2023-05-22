
const rows = 6;
const columns = 8;
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
    gridItem.width = gridItem.width;

    // Append the grid item to the grid container
    gridContainer.appendChild(gridItem);
  }
}


const pianoKeys = document.querySelectorAll('.grid-item')

function playSound(newUrl) {
    console.log(newUrl)
    new Audio(newUrl).play()
}


pianoKeys.forEach((pianoKey, i) => {
    note = notes[Math.floor(Math.random() * notes.length)];
    const newUrl = 'res/piano/' + note + '.mp3'
    pianoKey.addEventListener('mouseover', () => playSound(newUrl))
})