function main(){
    saw = new Saw();
    note1 = new Note(saw, "C", 0, 16);
    note2 = new Note(saw, "E", 8, 16);
    note3 = new Note(saw, "G", 12, 16);
    saw.setNoteSequence([[note1], [note2], [note3]]);
    conductor = new Conductor([saw]);
    conductor.playSong(10);
}
