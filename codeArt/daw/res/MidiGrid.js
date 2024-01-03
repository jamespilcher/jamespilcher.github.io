SCALE = 12

class MidiGrid {
    constructor(instrument){
        this.instrument = instrument;
         // NUM_OF_NOTES by NOTES_RANGE
        this.grid = new Array(NUM_OF_NOTES);
        this.grid = new Array(SCALE).fill().map(() => Array(NUM_OF_NOTES).fill([])); // 2D array with NUM_NOTES columns
    }
    createGrid() {
        const buttonGrid = document.getElementById('midiGrid');

        for (let i = 0; i < SCALE; i++) {
            for (let j = 0; j < NUM_OF_NOTES; j++) {
                const button = document.createElement("button");
                button.textContent = "";
                
                this.grid[i][j] = button;
            }
        }
    }
}