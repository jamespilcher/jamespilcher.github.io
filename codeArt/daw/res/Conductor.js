BPM = 120;
SMALLEST_NOTE = 1 / 16;
NOTE_DURATION = 60 / BPM * SMALLEST_NOTE;

class Conductor {
    constructor(instruments) {
        this.instruments = instruments;
    }
    playSong(bpm) {
        console.log("playing song at" + bpm);
        // loop through the instruments
        // for each note in noteSequence
        // play note, wait NOTE_DURATION
        // play next note
        // if no more notes, go back to beginning of noteSequence

        for (let i = 0; i < this.instruments.length; i++) {
            let instrument = this.instruments[i];
            console.log("here")
            for (let j = 0; j < instrument.noteSequence.length; j++) {
                instrument.playNotesAtIndex(j);
            }
        }
    }
    stopSong() {
        console.log("stopping song");
    }
}