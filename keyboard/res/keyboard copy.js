const audioContext = new AudioContext();

// Create the C3 oscillator
const C3sine = audioContext.createOscillator();
C3sine.type = 'sine';
C3sine.frequency.value = 130.81;
const C3PanNode = audioContext.createStereoPanner();
C3PanNode.pan.value = -.75;
C3sine.connect(C3PanNode);
C3PanNode.connect(audioContext.destination);

// Create the C#3 oscillator
const C3SharpSine = audioContext.createOscillator();
C3SharpSine.type = 'sine';
C3SharpSine.frequency.value = 138.59;
const C3SharpPanNode = audioContext.createStereoPanner();
C3SharpPanNode.pan.value = -0.713;
C3SharpSine.connect(C3SharpPanNode);
C3SharpPanNode.connect(audioContext.destination);

// Create the D3 oscillator
const D3sine = audioContext.createOscillator();
D3sine.type = 'sine';
D3sine.frequency.value = 146.83;
const D3PanNode = audioContext.createStereoPanner();
D3PanNode.pan.value = -0.677;
D3sine.connect(D3PanNode);
D3PanNode.connect(audioContext.destination);

// Create the D#3 oscillator
const D3SharpSine = audioContext.createOscillator();
D3SharpSine.type = 'sine';
D3SharpSine.frequency.value = 155.56;
const D3SharpPanNode = audioContext.createStereoPanner();
D3SharpPanNode.pan.value = -0.640;
D3SharpSine.connect(D3SharpPanNode);
D3SharpPanNode.connect(audioContext.destination);

// Create the E3 oscillator
const E3sine = audioContext.createOscillator();
E3sine.type = 'sine';
E3sine.frequency.value = 164.81;
const E3PanNode = audioContext.createStereoPanner();
E3PanNode.pan.value = -0.603;
E3sine.connect(E3PanNode);
E3PanNode.connect(audioContext.destination);

// Create the F3 oscillator
const F3sine = audioContext.createOscillator();
F3sine.type = 'sine';
F3sine.frequency.value = 174.61;
const F3PanNode = audioContext.createStereoPanner();
F3PanNode.pan.value = -0.567;
F3sine.connect(F3PanNode);
F3PanNode.connect(audioContext.destination);

// Create the F#3 oscillator
const F3SharpSine = audioContext.createOscillator();
F3SharpSine.type = 'sine';
F3SharpSine.frequency.value = 185.00;
const F3SharpPanNode = audioContext.createStereoPanner();
F3SharpPanNode.pan.value = -0.530;
F3SharpSine.connect(F3SharpPanNode);
F3SharpPanNode.connect(audioContext.destination);

// Create the G3 oscillator
const G3sine = audioContext.createOscillator();
G3sine.type = 'sine';
G3sine.frequency.value = 196.00;
const G3PanNode = audioContext.createStereoPanner();
G3PanNode.pan.value = -0.494;
G3sine.connect(G3PanNode);
G3PanNode.connect(audioContext.destination);

// Create the G#3 oscillator
const G3SharpSine = audioContext.createOscillator();
G3SharpSine.type = 'sine';
G3SharpSine.frequency.value = 207.65;
const G3SharpPanNode = audioContext.createStereoPanner();
G3SharpPanNode.pan.value = -0.457;
G3SharpSine.connect(G3SharpPanNode);
G3SharpPanNode.connect(audioContext.destination);

// Create the A3 oscillator
const A3sine = audioContext.createOscillator();
A3sine.type = 'sine';
A3sine.frequency.value = 220.00;
const A3PanNode = audioContext.createStereoPanner();
A3PanNode.pan.value = -0.421;
A3sine.connect(A3PanNode);
A3PanNode.connect(audioContext.destination);

// Create the A#3 oscillator
const A3SharpSine = audioContext.createOscillator();
A3SharpSine.type = 'sine';
A3SharpSine.frequency.value = 233.08;
const A3SharpPanNode = audioContext.createStereoPanner();
A3SharpPanNode.pan.value = -0.384;
A3SharpSine.connect(A3SharpPanNode);
A3SharpPanNode.connect(audioContext.destination);

// Create the B3 oscillator
const B3sine = audioContext.createOscillator();
B3sine.type = 'sine';
B3sine.frequency.value = 246.94;
const B3PanNode = audioContext.createStereoPanner();
B3PanNode.pan.value = -0.348;
B3sine.connect(B3PanNode);
B3PanNode.connect(audioContext.destination);

// Create the C4 oscillator
const C4sine = audioContext.createOscillator();
C4sine.type = 'sine';
C4sine.frequency.value = 261.63;
const C4PanNode = audioContext.createStereoPanner();
C4PanNode.pan.value = -0.311;
C4sine.connect(C4PanNode);
C4PanNode.connect(audioContext.destination);

// Create the C#4 oscillator
const C4SharpSine = audioContext.createOscillator();
C4SharpSine.type = 'sine';
C4SharpSine.frequency.value = 277.18;
const C4SharpPanNode = audioContext.createStereoPanner();
C4SharpPanNode.pan.value = -0.274;
C4SharpSine.connect(C4SharpPanNode);
C4SharpPanNode.connect(audioContext.destination);

// Create the D4 oscillator
const D4sine = audioContext.createOscillator();
D4sine.type = 'sine';
D4sine.frequency.value = 293.66;
const D4PanNode = audioContext.createStereoPanner();
D4PanNode.pan.value = -0.238;
D4sine.connect(D4PanNode);
D4PanNode.connect(audioContext.destination);

// Create the D#4 oscillator
const D4SharpSine = audioContext.createOscillator();
D4SharpSine.type = 'sine';
D4SharpSine.frequency.value = 311.13;
const D4SharpPanNode = audioContext.createStereoPanner();
D4SharpPanNode.pan.value = -0.201;
D4SharpSine.connect(D4SharpPanNode);
D4SharpPanNode.connect(audioContext.destination);

// Create the E4 oscillator
const E4sine = audioContext.createOscillator();
E4sine.type = 'sine';
E4sine.frequency.value = 329.63;
const E4PanNode = audioContext.createStereoPanner();
E4PanNode.pan.value = -0.165;
E4sine.connect(E4PanNode);
E4PanNode.connect(audioContext.destination);

// Create the F4 oscillator
const F4sine = audioContext.createOscillator();
F4sine.type = 'sine';
F4sine.frequency.value = 349.23;
const F4PanNode = audioContext.createStereoPanner();
F4PanNode.pan.value = -0.128;
F4sine.connect(F4PanNode);
F4PanNode.connect(audioContext.destination);

// Create the F#4 oscillator
const F4SharpSine = audioContext.createOscillator();
F4SharpSine.type = 'sine';
F4SharpSine.frequency.value = 369.99;
const F4SharpPanNode = audioContext.createStereoPanner();
F4SharpPanNode.pan.value = -0.091;
F4SharpSine.connect(F4SharpPanNode);
F4SharpPanNode.connect(audioContext.destination);

// Create the G4 oscillator
const G4sine = audioContext.createOscillator();
G4sine.type = 'sine';
G4sine.frequency.value = 392.00;
const G4PanNode = audioContext.createStereoPanner();
G4PanNode.pan.value = -0.055;
G4sine.connect(G4PanNode);
G4PanNode.connect(audioContext.destination);

// Create the G#4 oscillator
const G4SharpSine = audioContext.createOscillator();
G4SharpSine.type = 'sine';
G4SharpSine.frequency.value = 415.30;
const G4SharpPanNode = audioContext.createStereoPanner();
G4SharpPanNode.pan.value = -0.018;
G4SharpSine.connect(G4SharpPanNode);
G4SharpPanNode.connect(audioContext.destination);

// Create the A4 oscillator
const A4sine = audioContext.createOscillator();
A4sine.type = 'sine';
A4sine.frequency.value = 440.00;
const A4PanNode = audioContext.createStereoPanner();
A4PanNode.pan.value = 0.018;
A4sine.connect(A4PanNode);
A4PanNode.connect(audioContext.destination);

// Create the A#4 oscillator
const A4SharpSine = audioContext.createOscillator();
A4SharpSine.type = 'sine';
A4SharpSine.frequency.value = 466.16;
const A4SharpPanNode = audioContext.createStereoPanner();
A4SharpPanNode.pan.value = 0.055;
A4SharpSine.connect(A4SharpPanNode);
A4SharpPanNode.connect(audioContext.destination);

// Create the B4 oscillator
const B4sine = audioContext.createOscillator();
B4sine.type = 'sine';
B4sine.frequency.value = 493.88;
const B4PanNode = audioContext.createStereoPanner();
B4PanNode.pan.value = 0.091;
B4sine.connect(B4PanNode);
B4PanNode.connect(audioContext.destination);

// Create the C5 oscillator
const C5sine = audioContext.createOscillator();
C5sine.type = 'sine';
C5sine.frequency.value = 523.25;
const C5PanNode = audioContext.createStereoPanner();
C5PanNode.pan.value = 0.128;
C5sine.connect(C5PanNode);
C5PanNode.connect(audioContext.destination);

// Create the C#5 oscillator
const C5SharpSine = audioContext.createOscillator();
C5SharpSine.type = 'sine';
C5SharpSine.frequency.value = 554.37;
const C5SharpPanNode = audioContext.createStereoPanner();
C5SharpPanNode.pan.value = 0.165;
C5SharpSine.connect(C5SharpPanNode);
C5SharpPanNode.connect(audioContext.destination);

// Create the D5 oscillator
const D5sine = audioContext.createOscillator();
D5sine.type = 'sine';
D5sine.frequency.value = 587.33;
const D5PanNode = audioContext.createStereoPanner();
D5PanNode.pan.value = 0.201;
D5sine.connect(D5PanNode);
D5PanNode.connect(audioContext.destination);

// Create the D#5 oscillator
const D5SharpSine = audioContext.createOscillator();
D5SharpSine.type = 'sine';
D5SharpSine.frequency.value = 622.25;
const D5SharpPanNode = audioContext.createStereoPanner();
D5SharpPanNode.pan.value = 0.238;
D5SharpSine.connect(D5SharpPanNode);
D5SharpPanNode.connect(audioContext.destination);

// Create the E5 oscillator
const E5sine = audioContext.createOscillator();
E5sine.type = 'sine';
E5sine.frequency.value = 659.25;
const E5PanNode = audioContext.createStereoPanner();
E5PanNode.pan.value = 0.274;
E5sine.connect(E5PanNode);
E5PanNode.connect(audioContext.destination);

// Create the F5 oscillator
const F5sine = audioContext.createOscillator();
F5sine.type = 'sine';
F5sine.frequency.value = 698.46;
const F5PanNode = audioContext.createStereoPanner();
F5PanNode.pan.value = 0.311;
F5sine.connect(F5PanNode);
F5PanNode.connect(audioContext.destination);

// Create the F#5 oscillator
const F5SharpSine = audioContext.createOscillator();
F5SharpSine.type = 'sine';
F5SharpSine.frequency.value = 739.99;
const F5SharpPanNode = audioContext.createStereoPanner();
F5SharpPanNode.pan.value = 0.348;
F5SharpSine.connect(F5SharpPanNode);
F5SharpPanNode.connect(audioContext.destination);

// Create the G5 oscillator
const G5sine = audioContext.createOscillator();
G5sine.type = 'sine';
G5sine.frequency.value = 783.99;
const G5PanNode = audioContext.createStereoPanner();
G5PanNode.pan.value = 0.384;
G5sine.connect(G5PanNode);
G5PanNode.connect(audioContext.destination);

// Create the G#5 oscillator
const G5SharpSine = audioContext.createOscillator();
G5SharpSine.type = 'sine';
G5SharpSine.frequency.value = 830.61;
const G5SharpPanNode = audioContext.createStereoPanner();
G5SharpPanNode.pan.value = 0.421;
G5SharpSine.connect(G5SharpPanNode);
G5SharpPanNode.connect(audioContext.destination);

// Create the A5 oscillator
const A5sine = audioContext.createOscillator();
A5sine.type = 'sine';
A5sine.frequency.value = 880.00;
const A5PanNode = audioContext.createStereoPanner();
A5PanNode.pan.value = 0.457;
A5sine.connect(A5PanNode);
A5PanNode.connect(audioContext.destination);

// Create the A#5 oscillator
const A5SharpSine = audioContext.createOscillator();
A5SharpSine.type = 'sine';
A5SharpSine.frequency.value = 932.33;
const A5SharpPanNode = audioContext.createStereoPanner();
A5SharpPanNode.pan.value = 0.494;
A5SharpSine.connect(A5SharpPanNode);
A5SharpPanNode.connect(audioContext.destination);

// Create the B5 oscillator
const B5sine = audioContext.createOscillator();
B5sine.type = 'sine';
B5sine.frequency.value = 987.77;
const B5PanNode = audioContext.createStereoPanner();
B5PanNode.pan.value = 0.53;
B5sine.connect(B5PanNode);
B5PanNode.connect(audioContext.destination);

// Create the C6 oscillator
const C6sine = audioContext.createOscillator();
C6sine.type = 'sine';
C6sine.frequency.value = 1046.50;
const C6PanNode = audioContext.createStereoPanner();
C6PanNode.pan.value = 0.567;
C6sine.connect(C6PanNode);
C6PanNode.connect(audioContext.destination);

// Create the C#6 oscillator
const C6SharpSine = audioContext.createOscillator();
C6SharpSine.type = 'sine';
C6SharpSine.frequency.value = 1108.73;
const C6SharpPanNode = audioContext.createStereoPanner();
C6SharpPanNode.pan.value = 0.604;
C6SharpSine.connect(C6SharpPanNode);
C6SharpPanNode.connect(audioContext.destination);

// Create the D6 oscillator
const D6sine = audioContext.createOscillator();
D6sine.type = 'sine';
D6sine.frequency.value = 1174.66;
const D6PanNode = audioContext.createStereoPanner();
D6PanNode.pan.value = 0.64;
D6sine.connect(D6PanNode);
D6PanNode.connect(audioContext.destination);

// Create the D#6 oscillator
const D6SharpSine = audioContext.createOscillator();
D6SharpSine.type = 'sine';
D6SharpSine.frequency.value = 1244.51;
const D6SharpPanNode = audioContext.createStereoPanner();
D6SharpPanNode.pan.value = 0.7;
D6SharpSine.connect(D6SharpPanNode);
D6SharpPanNode.connect(audioContext.destination);

// Create the E6 oscillator
const E6sine = audioContext.createOscillator();
E6sine.type = 'sine';
E6sine.frequency.value = 1318.51;
const E6PanNode = audioContext.createStereoPanner();
E6PanNode.pan.value = 0.75;
E6sine.connect(E6PanNode);
E6PanNode.connect(audioContext.destination);



const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
  if (audioContext.state !== 'running') {
    audioContext.resume()
    playChord();
  }
});

function playChord() {
    C3sine.start();
    E4sine.start();
    G3sine.start();
    C5sine.start();
    setTimeout(function() {
        B5sine.start();
        C5sine.stop();
    }
    , 1000);
}


const rows = 6;
const columns = 6;

// Get the grid container element
const gridContainer = document.querySelector('.grid-container');

// Create the grid dynamically
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    // Create a grid item (div element)
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.textContent = `Row ${row + 1}, Col ${col + 1}`;

    // Add a hover event listener to the grid item
    gridItem.addEventListener('mouseover', () => {
      gridItem.style.backgroundColor = '#ffcc00';
    });

    // Add a hover out event listener to the grid item
    gridItem.addEventListener('mouseout', () => {
      gridItem.style.backgroundColor = '#f2f2f2';
    });

    // Append the grid item to the grid container
    gridContainer.appendChild(gridItem);
  }
}