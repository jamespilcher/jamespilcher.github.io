// Speech to text, using the browser's speech recognition.
export class Transcriber {
    static activeTranscribers = [];

    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognizer = null;
        if (SpeechRecognition !== undefined) {
            this.recognizer = new SpeechRecognition();
            this.recognizer.lang = "en-US";
            this.recognizer.continuous = true;
            this.recognizer.interimResults = true;
            this.recognizer.onresult = (event) => this._speechRecognition(event);
            this.recognizer.onerror = (event) => this._onError(event);
            this.recognizer.onend = () => this._onEnd();
        }

        this.recording = false;
        this.transcript = "";
        this.endedTranscript = "";

        Transcriber.activeTranscribers.push(this);
    }

    startRecording() {
        this.stopRecording();
        this.transcript = "";
        this.endedTranscript = "";
        if (this.recognizer === null) {
            return;
        }
        this.recording = true;
        this._start();
    }

    stopRecording() {
        this.recording = false;
        if (this.recognizer !== null) {
            this.recognizer.abort();
        }
    }

    static stopAllRecordings() {
        for (const transcriber of Transcriber.activeTranscribers) {
            transcriber.stopRecording();
        }
    }

    _start() {
        try {
            this.recognizer.start();
        } catch (error) {
            // start() throws if the last recognition has not finished closing. _onEnd starts it again.
        }
    }

    // Each event holds everything heard since the recognizer last started.
    _speechRecognition(event) {
        if (!this.recording) {
            return;
        }
        let heard = "";
        for (const result of event.results) {
            heard += " " + result[0].transcript;
        }
        this.transcript = this.endedTranscript + this._plainWords(heard);
    }

    // Lower case words with no punctuation except apostrophes.
    _plainWords(text) {
        return text
            .toLowerCase()
            .replace(/’/g, "'")
            .replace(/[^a-z0-9' ]+/g, " ");
    }

    // Silence and our own abort() are expected. Anything else, such as a refused microphone, ends the recording.
    _onError(event) {
        if (event.error !== "no-speech" && event.error !== "aborted") {
            this.recording = false;
        }
    }

    // The browser ends recognition by itself after a silence, so it is started again.
    _onEnd() {
        this.endedTranscript = this.transcript;
        if (this.recording) {
            this._start();
        }
    }

    getTranscript() {
        return this.transcript;
    }
}
