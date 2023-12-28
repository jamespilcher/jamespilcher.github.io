function main(){
    BPM = 60;
    SMALLEST_NOTE = 1 / 16; // 16th notes
    NOTE_DURATION = 60 / BPM * SMALLEST_NOTE;
    NUM_BARS = 12
    NUM_OF_NOTES = NUM_BARS / SMALLEST_NOTE;
    saw = new Saw();
    note0 = new Note(saw, "C", 48);
    note1 = new Note(saw, "G", 48);
    note2 = new Note(saw, "E", 16);
    note3 = new Note(saw, "D#",16);
    saw.addNoteAtIndex(note0, 0);
    saw.addNoteAtIndex(note1, 0);
    saw.addNoteAtIndex(note2, 16);
    saw.addNoteAtIndex(note3, 32);
    console.log(saw.noteSequence)
    conductor = new Conductor([saw]);
    conductor.playSong();
    saw.midiGrid.display();
}
