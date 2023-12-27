class Instrument {
    // atributes
    constructor() {
        this.audioContext = new AudioContext();
        this.noteSequence = [];
        this.active = true;
    }

    noteAsFrequency(note) {
        const noteMap = {
            "C": 60,
            "C#": 61,
            "D": 62,
            "D#": 63,
            "E": 64,
            "F": 65,
            "F#": 66,
            "G": 67,
            "G#": 68, 
            "A": 69,
            "A#": 70,
            "B": 71,
        }
        let noteNumber = noteMap[note]
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }

    playNotesAtIndex(index) {
        console.log("Playing notes at index " + index + ": " + this.noteSequence[index]);
        this.noteSequence[index].forEach(note => {
            this.playNote(note);
        });
    }

    playNote(note) {
    }

    setNoteSequence(noteSequence) {
        this.noteSequence = noteSequence;
    }

    addNoteAtIndex(note, index) {
        this.noteSequence[index] = note;
    }
}