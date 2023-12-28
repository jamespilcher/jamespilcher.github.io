

class Conductor {
    constructor(instruments) {
        this.instruments = instruments;
    }
    async playSong() {
        for (let i = 0; i < NUM_OF_NOTES; i++) {
            for (let j = 0; j < this.instruments.length; j++) {
                let instrument = this.instruments[j];
                instrument.playNotesAtIndex(i);
            }
            await sleep(NOTE_DURATION);
        }
        function sleep(s) {
            console.log("sleeping for " + s + " seconds");
            return new Promise(resolve => setTimeout(resolve, s * 1000));
        }
    }

    stopSong() {
        console.log("stopping song");
    }
}