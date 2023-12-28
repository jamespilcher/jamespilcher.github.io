class Saw extends Instrument{
    constructor() {
        super();
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = 'sawtooth'; // Set oscillator type to sawtooth
        this.oscillator.connect(this.audioContext.destination);
        }

    playNote(note) {
        let oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(this.noteAsFrequency(note.note), this.audioContext.currentTime);
        oscillator.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + note.length * NOTE_DURATION); // Adjust the duration
        console.log("Playing note " + note.note + " for " + note.length * NOTE_DURATION + " seconds");
    }

    // Override the addNoteAtIndex method to directly use playSawNote
    addNoteAtIndex(note, index) {
        super.addNoteAtIndex(note, index);
    }
}