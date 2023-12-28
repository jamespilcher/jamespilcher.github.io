SCALE = 12

class MidiGrid {
    constructor(instrument){
        this.instrument = instrument;
         // NUM_OF_NOTES by NOTES_RANGE
        this.grid = new Array(NUM_OF_NOTES);
        this.grid = new Array(SCALE).fill().map(() => Array(NUM_OF_NOTES).fill([])); // 2D array with NUM_NOTES columns
    }
    display() {
        console.log("AHHAHAAHAHAHAHAHHA")
        const table = document.createElement("table");

        for (let i = 0; i < this.grid.length; i++) {
            const row = table.insertRow();
            for (let j = 0; j < this.grid[i].length; j++) {
                const cell = row.insertCell();
                cell.textContent = this.grid[i][j].join(", ");
            }
        }

        document.getElementById("table").appendChild(table);
        console.log(this.grid);
    }
}