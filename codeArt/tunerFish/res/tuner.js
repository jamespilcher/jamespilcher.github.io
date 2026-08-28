const FISH_IMAGE_FILES = [
    'fish1.png', 'fish2.png', 'fish3.webp', 'fish4.png', 'fish5.png',
    'fish6.webp', 'fish7.png', 'fish8.png', 'fish9.png', 'fish10.png', 'fish11.webp'
];

class Tuner {
    constructor() {
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.referenceA4 = 440;

        this.audioContext = null;
        this.analyser = null;
        this.micStream = null;
        this.buffer = null;
        this.isListening = false;

        this.dial = null;
        this.dialCtx = null;

        // Smoothed display values
        this.displayCents = 0;
        this.displayFreq = 0;
        this.displayNote = '--';
        this.pitchHistory = [];

        // Fish background, swapped whenever the detected note changes
        this.fishImages = FISH_IMAGE_FILES.map((filename) => {
            const img = new Image();
            img.onload = () => {
                // Redraw once this image finishes loading, in case it's the
                // one currently selected and the initial draw missed it.
                if (this.currentFishImage === img) {
                    this.drawDial(this.displayCents, this.isListening);
                }
            };
            img.src = `res/fish/${filename}`;
            return img;
        });
        this.currentFishImage = null;
        this.lastNoteKey = null;

        this.init();
    }

    init() {
        this.setupDial();
        this.setupEventListeners();
        this.pickRandomFish();
        this.drawDial(0, false);
        window.addEventListener('resize', () => this.setupDial());
    }

    pickRandomFish() {
        const index = Math.floor(Math.random() * this.fishImages.length);
        this.currentFishImage = this.fishImages[index];
    }

    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => this.startListening());
        document.getElementById('referenceSelector').addEventListener('change', (e) => {
            this.referenceA4 = parseFloat(e.target.value);
        });
    }

    setupDial() {
        this.dial = document.getElementById('dialCanvas');
        const rect = this.dial.getBoundingClientRect();
        this.dial.width = rect.width;
        this.dial.height = rect.height;
        this.dialCtx = this.dial.getContext('2d');
        this.drawDial(this.displayCents, this.isListening);
    }

    async startListening() {
        if (this.isListening) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            const source = this.audioContext.createMediaStreamSource(this.micStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            source.connect(this.analyser);

            this.buffer = new Float32Array(this.analyser.fftSize);

            this.isListening = true;
            const startButton = document.getElementById('startButton');
            startButton.textContent = 'listening';
            startButton.disabled = true;

            this.tick();
        } catch (error) {
            console.error('Error starting tuner:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    }

    stopListening() {
        this.isListening = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
            this.micStream = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    tick() {
        if (!this.isListening) return;

        this.analyser.getFloatTimeDomainData(this.buffer);
        const freq = this.detectPitch(this.buffer, this.audioContext.sampleRate);

        // Require a few consecutive frames pointing at (roughly) the same
        // pitch before we trust it - a single noisy frame shouldn't be able
        // to flip the note or the needle.
        if (freq !== -1) {
            const last = this.pitchHistory.length ? this.pitchHistory[this.pitchHistory.length - 1] : freq;
            if (Math.abs(freq - last) / last > 0.5) {
                this.pitchHistory = []; // wildly different reading - start a fresh run
            }
            this.pitchHistory.push(freq);
            if (this.pitchHistory.length > 6) this.pitchHistory.shift();
        } else {
            this.pitchHistory = [];
        }

        const confirmed = this.pitchHistory.length >= 3;

        if (confirmed) {
            // Median of the recent run is far less jumpy than any single reading.
            const sorted = [...this.pitchHistory].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];

            const smoothing = 0.25;
            this.displayFreq = this.displayFreq === 0 ? median : this.displayFreq + (median - this.displayFreq) * smoothing;

            const { note, cents, octave } = this.frequencyToNote(this.displayFreq);
            this.displayCents = cents;
            this.displayNote = `${note}${octave}`;

            this.updateFishForNoteKey(this.displayNote);
            this.drawDial(this.displayCents, true);
        } else {
            this.displayCents *= 0.9;
            this.updateFishForNoteKey('none');
            this.drawDial(this.displayCents, false);
        }

        this._rafId = requestAnimationFrame(() => this.tick());
    }

    updateFishForNoteKey(noteKey) {
        if (noteKey !== this.lastNoteKey) {
            this.lastNoteKey = noteKey;
            this.pickRandomFish();
        }
    }

    // YIN pitch detection - far more resistant to octave errors and noise
    // than plain autocorrelation, which is what made note detection flaky.
    // See: de Cheveigne & Kawahara, "YIN, a fundamental frequency estimator
    // for speech and music" (2002).
    detectPitch(buffer, sampleRate) {
        const bufferSize = buffer.length;

        let rms = 0;
        for (let i = 0; i < bufferSize; i++) rms += buffer[i] * buffer[i];
        rms = Math.sqrt(rms / bufferSize);
        if (rms < 0.005) return -1; // too quiet, treat as silence

        const halfSize = Math.floor(bufferSize / 2);
        // Only search the tau range that maps to a musically-sane frequency
        // (50Hz - 1500Hz), instead of the full buffer - cheaper and it can't
        // lock onto junk outside that range.
        const minTau = Math.max(2, Math.floor(sampleRate / 1500));
        const maxTau = Math.min(halfSize - 1, Math.ceil(sampleRate / 50));

        const yinBuffer = new Float32Array(maxTau + 1);

        // Step 1: difference function
        for (let tau = 1; tau <= maxTau; tau++) {
            let sum = 0;
            for (let i = 0; i < halfSize; i++) {
                const delta = buffer[i] - buffer[i + tau];
                sum += delta * delta;
            }
            yinBuffer[tau] = sum;
        }

        // Step 2: cumulative mean normalized difference function
        yinBuffer[0] = 1;
        let runningSum = 0;
        for (let tau = 1; tau <= maxTau; tau++) {
            runningSum += yinBuffer[tau];
            yinBuffer[tau] = runningSum === 0 ? 1 : (yinBuffer[tau] * tau) / runningSum;
        }

        // Step 3: absolute threshold - take the first dip below the
        // threshold, then follow it down to its local minimum.
        const threshold = 0.15;
        let tauEstimate = -1;
        for (let tau = minTau; tau <= maxTau; tau++) {
            if (yinBuffer[tau] < threshold) {
                while (tau + 1 <= maxTau && yinBuffer[tau + 1] < yinBuffer[tau]) tau++;
                tauEstimate = tau;
                break;
            }
        }
        if (tauEstimate === -1) return -1; // no confident periodicity found

        // Step 4: parabolic interpolation around the dip for sub-sample accuracy
        const x0 = tauEstimate > minTau ? tauEstimate - 1 : tauEstimate;
        const x2 = tauEstimate + 1 <= maxTau ? tauEstimate + 1 : tauEstimate;
        let betterTau = tauEstimate;
        if (x0 !== tauEstimate && x2 !== tauEstimate) {
            const s0 = yinBuffer[x0];
            const s1 = yinBuffer[tauEstimate];
            const s2 = yinBuffer[x2];
            const denom = 2 * (2 * s1 - s2 - s0);
            if (denom) betterTau = tauEstimate + (s2 - s0) / denom;
        }

        const freq = sampleRate / betterTau;
        if (freq < 50 || freq > 1500) return -1;
        return freq;
    }

    frequencyToNote(freq) {
        // Semitones away from A4, relative to the selected reference pitch
        const semitonesFromA4 = 12 * Math.log2(freq / this.referenceA4);
        const roundedSemitones = Math.round(semitonesFromA4);
        const cents = Math.round((semitonesFromA4 - roundedSemitones) * 100);

        const noteIndex = ((roundedSemitones % 12) + 12 + 9) % 12; // +9 shifts A to index 9 (C-based names)
        const octave = 4 + Math.floor((roundedSemitones + 9) / 12);

        return {
            note: this.noteNames[noteIndex],
            octave,
            cents
        };
    }

    drawDial(cents, active) {
        const ctx = this.dialCtx;
        const w = this.dial.width;
        const h = this.dial.height;
        ctx.clearRect(0, 0, w, h);

        // Faint tuna stretched across the whole dial, behind the gauge
        if (this.currentFishImage && this.currentFishImage.complete && this.currentFishImage.naturalWidth) {
            ctx.globalAlpha = 0.15;
            ctx.drawImage(this.currentFishImage, 0, 0, w, h);
            ctx.globalAlpha = 1;
        }

        const cx = w / 2;
        const cy = h * 0.77;
        const radius = Math.min(w * 0.41, h * 0.55);

        // Clamp cents to +/- 50 for the needle sweep
        const clampedCents = Math.max(-50, Math.min(50, cents));
        const angle = (clampedCents / 50) * (Math.PI / 2.2); // sweep range

        // Arc background
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI + (Math.PI / 2 - Math.PI / 2.2), Math.PI * 2 - (Math.PI / 2 - Math.PI / 2.2));
        ctx.stroke();

        // Tick marks every 10 cents
        for (let t = -50; t <= 50; t += 10) {
            const a = -Math.PI / 2 + (t / 50) * (Math.PI / 2.2);
            const inner = radius - (t === 0 ? 16 : 10);
            const outer = radius;
            const x1 = cx + Math.cos(a) * inner;
            const y1 = cy + Math.sin(a) * inner;
            const x2 = cx + Math.cos(a) * outer;
            const y2 = cy + Math.sin(a) * outer;
            ctx.strokeStyle = t === 0 ? '#000' : '#999';
            ctx.lineWidth = t === 0 ? 3 : 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Needle
        const needleAngle = -Math.PI / 2 + angle;
        const needleLength = radius - 20;
        const nx = cx + Math.cos(needleAngle) * needleLength;
        const ny = cy + Math.sin(needleAngle) * needleLength;

        ctx.strokeStyle = active ? (Math.abs(cents) < 5 ? '#2e7d32' : '#c62828') : '#bbb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        // Needle pivot
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        // flat/sharp labels under the arc ends
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('flat', cx - radius * 0.75, cy + 4);
        ctx.fillText('sharp', cx + radius * 0.75, cy + 4);

        // Note / frequency / cents readout, drawn as plain text inside the dial
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(active ? this.displayNote : '--', cx, cy - radius * 0.55);

        ctx.font = '16px Arial';
        const freqText = active ? `${this.displayFreq.toFixed(1)} Hz` : '';
        const centsText = active ? `${this.displayCents > 0 ? '+' : ''}${Math.round(this.displayCents)}c` : '';
        ctx.fillText(`${freqText}  ${centsText}`, cx, cy - radius * 0.55 + 22);
    }
}

let tuner;
document.addEventListener('DOMContentLoaded', () => {
    tuner = new Tuner();
});

window.addEventListener('beforeunload', () => {
    if (tuner) {
        tuner.stopListening();
    }
});
