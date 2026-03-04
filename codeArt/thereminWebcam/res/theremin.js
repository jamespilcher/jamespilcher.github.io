class WebcamTheremin {
    constructor() {
        // Different musical scales - all notes sound good together
        this.scales = {
            'c-pentatonic': {
                name: 'C Major Pentatonic',
                notes: [
                    { name: 'C3', freq: 130.81 },
                    { name: 'D3', freq: 146.83 },
                    { name: 'E3', freq: 164.81 },
                    { name: 'G3', freq: 196.00 },
                    { name: 'A3', freq: 220.00 },
                    { name: 'C4', freq: 261.63 },
                    { name: 'D4', freq: 293.66 },
                    { name: 'E4', freq: 329.63 },
                    { name: 'G4', freq: 392.00 },
                    { name: 'A4', freq: 440.00 },
                    { name: 'C5', freq: 523.25 },
                    { name: 'D5', freq: 587.33 },
                    { name: 'E5', freq: 659.25 },
                    { name: 'G5', freq: 783.99 },
                    { name: 'A5', freq: 880.00 }
                ]
            },
            'c-blues': {
                name: 'C Blues',
                notes: [
                    { name: 'C3', freq: 130.81 },
                    { name: 'Eb3', freq: 155.56 },
                    { name: 'F3', freq: 174.61 },
                    { name: 'F#3', freq: 184.99 },
                    { name: 'G3', freq: 196.00 },
                    { name: 'Bb3', freq: 233.08 },
                    { name: 'C4', freq: 261.63 },
                    { name: 'Eb4', freq: 311.13 },
                    { name: 'F4', freq: 349.23 },
                    { name: 'F#4', freq: 369.99 },
                    { name: 'G4', freq: 392.00 },
                    { name: 'Bb4', freq: 466.16 },
                    { name: 'C5', freq: 523.25 },
                    { name: 'Eb5', freq: 622.25 },
                    { name: 'F#5', freq: 739.99 }
                ]
            },
            'c-major': {
                name: 'C Major',
                notes: [
                    { name: 'C3', freq: 130.81 },
                    { name: 'D3', freq: 146.83 },
                    { name: 'E3', freq: 164.81 },
                    { name: 'F3', freq: 174.61 },
                    { name: 'G3', freq: 196.00 },
                    { name: 'A3', freq: 220.00 },
                    { name: 'B3', freq: 246.94 },
                    { name: 'C4', freq: 261.63 },
                    { name: 'D4', freq: 293.66 },
                    { name: 'E4', freq: 329.63 },
                    { name: 'F4', freq: 349.23 },
                    { name: 'G4', freq: 392.00 },
                    { name: 'A4', freq: 440.00 },
                    { name: 'B4', freq: 493.88 },
                    { name: 'C5', freq: 523.25 }
                ]
            },
            
            'whole-tone': {
                name: 'Whole Tone',
                notes: [
                    { name: 'C3', freq: 130.81 },
                    { name: 'D3', freq: 146.83 },
                    { name: 'E3', freq: 164.81 },
                    { name: 'F#3', freq: 184.99 },
                    { name: 'G#3', freq: 207.65 },
                    { name: 'A#3', freq: 233.08 },
                    { name: 'C4', freq: 261.63 },
                    { name: 'D4', freq: 293.66 },
                    { name: 'E4', freq: 329.63 },
                    { name: 'F#4', freq: 369.99 },
                    { name: 'G#4', freq: 415.30 },
                    { name: 'A#4', freq: 466.16 },
                    { name: 'C5', freq: 523.25 },
                    { name: 'D5', freq: 587.33 },
                    { name: 'E5', freq: 659.25 }
                ]
            }
        };
        
        // Current scale selection
        this.currentScale = 'c-pentatonic';
        this.musicalNotes = this.scales[this.currentScale].notes;

        // Audio setup
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.reverbNode = null;
        this.dryGainNode = null;
        this.wetGainNode = null;
        this.isPlaying = false;

        // Video setup
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.isTracking = false;

        // Brightness tracking
        this.brightnessHistory = [];
        this.maxHistoryLength = 100;
        this.currentBrightness = 0;        
        // Threshold image processing (separate from brightness measurement)
        this.thresholdCanvas = null;
        this.thresholdCtx = null;
        this.brightnessThreshold = 50; // 50% threshold
        this.tempCanvas = null;
        this.tempCtx = null;
        // Chart setup
        this.chart = null;
        this.chartCtx = null;

        // Note timing
        this.currentNoteStartTime = 0;
        this.lastPlayedNote = null;
        this.maxNoteDuration = 2500; // 2 seconds
        this.fadeStartDuration = 2000; // Start fading at 1.5 seconds
        this.isNoteFading = false;
        this.baseVolume = 0.1; // 20% of 0.5 max volume
        
        // Window focus state
        this.isWindowActive = true;
        this.wasPlayingBeforePause = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupChart();
        this.setupThresholdDisplay();
        this.setupWindowFocusListeners();
        // Auto-start the theremin
        this.autoStartTheremin();
    }

    setupEventListeners() {
        const volumeSlider = document.getElementById('volumeSlider');
        const scaleSelector = document.getElementById('scaleSelector');
        const oscillatorSelector = document.getElementById('oscillatorSelector');
        const reverbSlider = document.getElementById('reverbSlider');
        volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
        scaleSelector.addEventListener('change', (e) => this.changeScale(e.target.value));
        oscillatorSelector.addEventListener('change', (e) => this.changeOscillatorType(e.target.value));
        reverbSlider.addEventListener('input', (e) => this.updateReverb(e.target.value));
    }

    setupWindowFocusListeners() {
        // Handle window focus/blur
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());
        
        // Handle page visibility changes (for tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleWindowBlur();
            } else {
                this.handleWindowFocus();
            }
        });
    }

    handleWindowFocus() {
        this.isWindowActive = true;
        if (this.wasPlayingBeforePause && this.gainNode) {
            // Resume audio by restoring volume
            const volumeSlider = document.getElementById('volumeSlider');
            this.baseVolume = (volumeSlider.value / 100)* 0.15;
            this.gainNode.gain.setValueAtTime(this.baseVolume, this.audioContext.currentTime);
        }
    }

    handleWindowBlur() {
        this.isWindowActive = false;
        if (this.gainNode && this.isPlaying) {
            this.wasPlayingBeforePause = true;
            // Mute audio when window loses focus
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
    }

    async autoStartTheremin() {
        // Start automatically when page loads
        await this.startTheremin();
    }

    setupChart() {
        this.chart = document.getElementById('brightnessChart');
        this.chartCtx = this.chart.getContext('2d');
        
        // Set canvas internal dimensions to match CSS dimensions
        const rect = this.chart.getBoundingClientRect();
        this.chart.width = rect.width;
        this.chart.height = rect.height;
        
        this.chartCtx.fillStyle = 'white';
        this.chartCtx.fillRect(0, 0, this.chart.width, this.chart.height);
    }

    setupThresholdDisplay() {
        // Create a canvas for the threshold display inside the brightness block
        this.thresholdCanvas = document.createElement('canvas');
        this.thresholdCtx = this.thresholdCanvas.getContext('2d');
        
        // Style the canvas to fill the brightness block
        this.thresholdCanvas.style.width = '100%';
        this.thresholdCanvas.style.height = '100%';
        this.thresholdCanvas.style.objectFit = 'cover';
        
        // Insert the canvas into the brightness block
        const brightnessBlock = document.getElementById('brightnessBlock');
        brightnessBlock.appendChild(this.thresholdCanvas);
    }

    async startTheremin() {
        try {
            // Initialize audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Get webcam access
            const stream = await navigator.mediaDevices.getUserMedia({ video : true, audio: false
            });
            
            // Setup video element
            this.video = document.getElementById('videoElement');
            this.video.srcObject = stream;
            
            // Handle video metadata load
            this.video.onloadedmetadata = () => {
                // Start video playback
                this.video.play();
                
                // Setup audio nodes
                this.setupAudioNodes();
                
                // Start tracking
                this.startTracking();
            };
            
        } catch (error) {
            console.error('Error starting theremin:', error);
            alert('Could not access webcam or audio. Please check permissions.');
        }
    }

    setupAudioNodes() {
        // Create oscillator and gain nodes
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();
        
        // Create reverb nodes
        this.reverbNode = this.audioContext.createConvolver();
        this.dryGainNode = this.audioContext.createGain();
        this.wetGainNode = this.audioContext.createGain();
        
        // Generate impulse response for reverb
        this.createReverbImpulse();
        
        // Configure oscillator
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        
        // Configure gain (start with low volume)
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        // Configure reverb mix (start with no reverb)
        this.dryGainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
        this.wetGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        // Connect nodes: oscillator -> gain -> [dry + wet(reverb)] -> destination
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.dryGainNode);
        this.gainNode.connect(this.reverbNode);
        this.reverbNode.connect(this.wetGainNode);
        this.dryGainNode.connect(this.audioContext.destination);
        this.wetGainNode.connect(this.audioContext.destination);
        
        // Start oscillator
        this.oscillator.start();
        this.isPlaying = true;
        
        // Initialize reverb to match slider value
        const reverbSlider = document.getElementById('reverbSlider');
        this.updateReverb(reverbSlider.value);
    }
    
    createReverbImpulse() {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2; // 2 second reverb
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Create exponential decay with some randomness
                const decay = Math.pow(1 - (i / length), 2);
                channelData[i] = (Math.random() * 2 - 1) * decay;
            }
        }
        
        this.reverbNode.buffer = impulse;
    }

    startTracking() {
        // Create hidden canvas for brightness analysis
        this.canvas = document.createElement('canvas');

        // Use video's actual dimensions, or calculate reasonable defaults based on video element size
        if (this.video.videoWidth && this.video.videoHeight) {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        } else {
            // Fallback: use video element's display dimensions
            const videoRect = this.video.getBoundingClientRect();
            this.canvas.width = videoRect.width || 200;
            this.canvas.height = videoRect.height || 150;
        }

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Create reusable temp canvas for threshold processing
        this.tempCanvas = document.createElement('canvas');
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
        this.tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true });

        this.isTracking = true;
        // Use setInterval for mobile compatibility
        this._trackingInterval = setInterval(() => {
            if (this.isTracking) {
                this.trackBrightness();
            }
        }, 50); // 20 FPS
    }

    processThresholdImage(sourceImageData) {
        if (!this.tempCanvas || !this.thresholdCanvas) return;
        
        // Clone the image data for processing
        const imageData = new ImageData(
            new Uint8ClampedArray(sourceImageData.data),
            sourceImageData.width,
            sourceImageData.height
        );
        const data = imageData.data;
        
        // Process pixels - keep only those below brightness threshold
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate brightness (0-100)
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100;
            
            if (brightness >= this.brightnessThreshold) {
                // Make pixels above threshold transparent/white
                data[i] = 255;     // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 0;   // A (transparent)
            } else {
                // Keep dark pixels, make them black
                data[i] = 0;       // R
                data[i + 1] = 0;   // G
                data[i + 2] = 0;   // B
                data[i + 3] = 255; // A (opaque)
            }
        }
        
        // Put processed image to temp canvas
        this.tempCtx.putImageData(imageData, 0, 0);
        
        // Draw to display canvas (only resize display canvas if needed)
        const brightnessBlock = document.getElementById('brightnessBlock');
        const blockRect = brightnessBlock.getBoundingClientRect();
        
        if (this.thresholdCanvas.width !== blockRect.width || this.thresholdCanvas.height !== blockRect.height) {
            this.thresholdCanvas.width = blockRect.width;
            this.thresholdCanvas.height = blockRect.height;
        }
            this.thresholdCtx.clearRect(0, 0, this.thresholdCanvas.width, this.thresholdCanvas.height);

        this.thresholdCtx.drawImage(this.tempCanvas, 0, 0, this.thresholdCanvas.width, this.thresholdCanvas.height);
    }

    trackBrightness() {
        if (!this.isTracking) return;

        // Draw video frame to canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        // Calculate average brightness
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            // Use luminance formula: 0.299*R + 0.587*G + 0.114*B
            const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (data.length / 4);
        const rawBrightnessPercent = (avgBrightness / 255) * 100;

        // Clamp and scale brightness: 5%-75% becomes 0%-100%
        const clampedRaw = Math.max(5, Math.min(75, rawBrightnessPercent));
        const brightnessPercent = ((clampedRaw - 5) / (75 - 5)) * 100;

        // Update current brightness
        this.currentBrightness = brightnessPercent;

        // Update history
        this.brightnessHistory.push(brightnessPercent);
        if (this.brightnessHistory.length > this.maxHistoryLength) {
            this.brightnessHistory.shift();
        }

        // Update UI
        this.updateUI(brightnessPercent);

        // Map brightness to frequency and update audio
        this.updateFrequency(brightnessPercent);

        // Update chart
        this.updateChart();

        // Update threshold display (pass the imageData to avoid redrawing)
        this.processThresholdImage(imageData);
    }

    updateUI(brightnessPercent) {
        // Update brightness values
        document.getElementById('brightnessValue').textContent = `${Math.round(brightnessPercent)}%`;
        
        // Update brightness color block
        const grayLevel = Math.round((brightnessPercent / 100) * 255);
        const brightnessBlock = document.getElementById('brightnessBlock');
        brightnessBlock.style.backgroundColor = `rgb(${grayLevel}, ${grayLevel}, ${grayLevel})`;
    }

    updateFrequency(brightnessPercent) {
        if (!this.oscillator || !this.isWindowActive) return;

        // Brightness is already scaled (0%-100% represents the 5%-75% raw range)
        // Map brightness (0-100%) to musical note index (0-14)
        const noteIndex = Math.floor((brightnessPercent / 100) * (this.musicalNotes.length - 1));
        const clampedIndex = Math.max(0, Math.min(this.musicalNotes.length - 1, noteIndex));
        
        const selectedNote = this.musicalNotes[clampedIndex];
        const currentTime = Date.now();
        
        // Check if note has changed
        if (this.lastPlayedNote !== selectedNote.name) {
            this.lastPlayedNote = selectedNote.name;
            this.currentNoteStartTime = currentTime;
            this.isNoteFading = false;
            // Restore full volume when note changes
            const volumeSlider = document.getElementById('volumeSlider');
            this.baseVolume = (volumeSlider.value / 100)* 0.15;
            this.gainNode.gain.setValueAtTime(this.baseVolume, this.audioContext.currentTime);
        }
        
        // Handle fade-out timing
        const noteDuration = currentTime - this.currentNoteStartTime;
        if (noteDuration > this.fadeStartDuration && noteDuration <= this.maxNoteDuration) {
            // Start gradual fade
            this.isNoteFading = true;
            const fadeProgress = (noteDuration - this.fadeStartDuration) / (this.maxNoteDuration - this.fadeStartDuration);
            const fadeVolume = this.baseVolume * (1 - fadeProgress);
            this.gainNode.gain.setValueAtTime(fadeVolume, this.audioContext.currentTime);
        } else if (noteDuration > this.maxNoteDuration) {
            // Complete silence after 3 seconds
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
        
        // Update frequency
        this.oscillator.frequency.setValueAtTime(
            selectedNote.freq, 
            this.audioContext.currentTime
        );
        
        // Update note display
        document.getElementById('currentNote').textContent = selectedNote.name;
        document.getElementById('currentFreq').textContent = selectedNote.freq.toFixed(2);
    }

    updateChart() {
        if (this.brightnessHistory.length === 0) return;

        // Get current chart dimensions
        const chartWidth = this.chart.width;
        const chartHeight = this.chart.height;

        // Clear chart
        this.chartCtx.fillStyle = 'white';
        this.chartCtx.fillRect(0, 0, chartWidth, chartHeight);
        
        // Draw grid lines
        this.chartCtx.strokeStyle = '#e0e0e0';
        this.chartCtx.lineWidth = 1;
        
        // Horizontal grid lines (25%, 50%, 75%)
        for (let i = 1; i <= 3; i++) {
            const y = (i / 4) * chartHeight;
            this.chartCtx.beginPath();
            this.chartCtx.moveTo(0, y);
            this.chartCtx.lineTo(chartWidth, y);
            this.chartCtx.stroke();
        }
        
        // Draw brightness line
        if (this.brightnessHistory.length > 1) {
            this.chartCtx.lineWidth = 2;
            this.chartCtx.beginPath();
            
            for (let i = 0; i < this.brightnessHistory.length; i++) {
                const x = (i / (this.maxHistoryLength - 1)) * chartWidth;
                const y = chartHeight - (this.brightnessHistory[i] / 100) * chartHeight;
                
                // Change color based on current note fade state
                if (i === this.brightnessHistory.length - 1) {
                    const currentTime = Date.now();
                    const noteDuration = currentTime - this.currentNoteStartTime;
                    
                    if (noteDuration > this.maxNoteDuration) {
                        this.chartCtx.strokeStyle = '#999999'; // Gray for silent
                    } else if (this.isNoteFading) {
                        this.chartCtx.strokeStyle = '#FFA500'; // Orange for fading
                    } else {
                        this.chartCtx.strokeStyle = '#2196F3'; // Blue for normal
                    }
                } else {
                    this.chartCtx.strokeStyle = '#2196F3'; // Blue for historical data
                }
                
                if (i === 0) {
                    this.chartCtx.moveTo(x, y);
                } else {
                    this.chartCtx.lineTo(x, y);
                }
                
                // Stroke each segment to apply color changes
                if (i > 0) {
                    this.chartCtx.stroke();
                    if (i < this.brightnessHistory.length - 1) {
                        this.chartCtx.beginPath();
                        this.chartCtx.moveTo(x, y);
                    }
                }
            }
            
            this.chartCtx.stroke();
        }
        
        // Draw current point
        if (this.brightnessHistory.length > 0) {
            const lastIndex = this.brightnessHistory.length - 1;
            const x = (lastIndex / (this.maxHistoryLength - 1)) * chartWidth;
            const y = chartHeight - (this.brightnessHistory[lastIndex] / 100) * chartHeight;
            
            // Color the current point based on fade state
            const currentTime = Date.now();
            const noteDuration = currentTime - this.currentNoteStartTime;
            
            if (noteDuration > this.maxNoteDuration) {
                this.chartCtx.fillStyle = '#666666'; // Dark gray for silent
            } else if (this.isNoteFading) {
                this.chartCtx.fillStyle = '#FF8C00'; // Dark orange for fading
            } else {
                this.chartCtx.fillStyle = '#FF4444'; // Red for normal
            }
            
            this.chartCtx.beginPath();
            this.chartCtx.arc(x, y, 4, 0, 2 * Math.PI);
            this.chartCtx.fill();
        }
    }

    updateVolume(value) {
        document.getElementById('volumeValue').textContent = `${value}%`;
        
        // Update baseVolume for consistency across the app
        this.baseVolume = (value / 100)* 0.15;
        
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(this.baseVolume, this.audioContext.currentTime);
        }
    }

    changeScale(scaleKey) {
        this.currentScale = scaleKey;
        this.musicalNotes = this.scales[scaleKey].notes;
        // Reset note timing when scale changes
        this.lastPlayedNote = null;
        this.currentNoteStartTime = Date.now();
    }

    changeOscillatorType(waveType) {
        if (this.oscillator) {
            this.oscillator.type = waveType;
        }
    }
    
    updateReverb(value) {
        document.getElementById('reverbValue').textContent = `${value}%`;
        
        if (this.dryGainNode && this.wetGainNode) {
            const wetAmount = value / 100;
            const dryAmount = 1 - wetAmount;
            
            this.dryGainNode.gain.setValueAtTime(dryAmount, this.audioContext.currentTime);
            this.wetGainNode.gain.setValueAtTime(wetAmount, this.audioContext.currentTime);
        }
    }

    stop() {
        this.isTracking = false;
        if (this._trackingInterval) {
            clearInterval(this._trackingInterval);
            this._trackingInterval = null;
        }
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        if (this.video && this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Initialize when page loads
let theremin;
document.addEventListener('DOMContentLoaded', () => {
    theremin = new WebcamTheremin();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (theremin) {
        theremin.stop();
    }
});