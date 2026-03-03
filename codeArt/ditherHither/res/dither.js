// Constants
const COLORS = {
    LEFT: 'lightblue',
    RIGHT: 'lightcoral',
    BOTH: 'mediumpurple'
};

const CONFIG = {
    OUTPUT_WIDTH: 500,
    FRAME_RATE: 33,
    NOISE_SAMPLE_SIZE: 10000
};

// Pattern Registry
const PATTERNS = {
    normal: () => 'normal',
    threshold25: () => 64,
    threshold50: () => 128,
    threshold75: () => 192,
    bayer2x2: () => [[0, 128], [192, 64]],
    bayer4x4: () => [
        [0, 128, 32, 160],
        [192, 64, 224, 96],
        [48, 176, 16, 144],
        [240, 112, 208, 80]
    ],
    bayer8x8: () => [
        [0, 128, 32, 160, 8, 136, 40, 168],
        [192, 64, 224, 96, 200, 72, 232, 104],
        [48, 176, 16, 144, 56, 184, 24, 152],
        [240, 112, 208, 80, 248, 120, 216, 88],
        [12, 140, 44, 172, 4, 132, 36, 164],
        [204, 76, 236, 108, 196, 68, 228, 100],
        [60, 188, 28, 156, 52, 180, 20, 148],
        [252, 124, 220, 92, 244, 116, 212, 84]
    ],
    clockwise: () => [
        [64, 32, 96],
        [128, 0, 160],
        [192, 224, 255]
    ],
    dispersedDot: () => [
        [128, 64, 192],
        [32, 255, 96],
        [224, 160, 0]
    ],
    blueNoise: () => 'blueNoise',
    randomNoise: () => 'random'
};

const PATTERN_CONFIGS = [
    { name: 'Normal', key: 'normal' },
    { name: '25% Threshold', key: 'threshold25' },
    { name: '50% Threshold', key: 'threshold50' },
    { name: '75% Threshold', key: 'threshold75' },
    { name: 'Bayer 2×2', key: 'bayer2x2' },
    { name: 'Bayer 4×4', key: 'bayer4x4' },
    { name: 'Bayer 8×8', key: 'bayer8x8' },
    { name: 'Clockwise', key: 'clockwise' },
    { name: 'Dispersed Dot', key: 'dispersedDot' },
    { name: 'Blue Noise', key: 'blueNoise' },
    { name: 'Random Noise', key: 'randomNoise' }
];

// Application State and Modules
const DitherApp = {
    state: {
        canvas: { element: null, ctx: null, output: null, outputCtx: null },
        ui: { 
            selectedSide: 'right', 
            leftButton: null, 
            rightButton: null,
            comparisonSlider: null,
            leftModeLabel: null,
            rightModeLabel: null
        },
        patterns: { left: 'normal', right: 'normal' },
        streaming: { active: false, animationId: null, videoElement: null },
        thresholdMatrix: []
    },

    // UI Management
    ui: {
        init() {
            this.createDitherPresets();
            this.setupCanvas();
            this.setupComparisonControls();
            this.showLoadingMessage();
            this.hideSlider();
        },

        showLoadingMessage() {
            const outputDiv = document.getElementById('ditherOutput');
            outputDiv.innerHTML = '<div style="text-align: center; color: #666; padding: 10px;">Loading...</div>';
        },

        hideSlider() {
            const comparisonControls = document.getElementById('comparisonControls');
            if (comparisonControls) {
                comparisonControls.style.display = 'none';
            }
        },

        showSlider() {
            const comparisonControls = document.getElementById('comparisonControls');
            if (comparisonControls) {
                comparisonControls.style.display = 'block';
            }
        },

        createDitherPresets() {
            const presetsDiv = document.getElementById('ditherPresets');
            presetsDiv.innerHTML = '';
            
            const controls = document.createElement('div');
            controls.className = 'pattern-controls';
            
            // Create side selection buttons
            const sideButtons = `
                <div style="margin-bottom: 15px;">
                    <button onclick="DitherApp.ui.setSide('left')" id="leftSideBtn">Configure Left Side</button>
                    <button onclick="DitherApp.ui.setSide('right')" id="rightSideBtn" style="background-color: ${COLORS.RIGHT};">Configure Right Side</button>
                </div>`;
            
            // Create pattern buttons
            const patternButtons = PATTERN_CONFIGS.map(pattern => 
                `<button onclick="DitherApp.ui.selectPattern(this, '${pattern.key}', DitherApp.state.ui.selectedSide)">${pattern.name}</button>`
            ).join('\n        ');
            
            controls.innerHTML = sideButtons + patternButtons;
            presetsDiv.appendChild(controls);
        },

        setupComparisonControls() {
            DitherApp.state.ui.comparisonSlider = document.getElementById('comparisonSlider');
            DitherApp.state.ui.leftModeLabel = document.getElementById('leftMode');
            DitherApp.state.ui.rightModeLabel = document.getElementById('rightMode');
            
            DitherApp.state.ui.comparisonSlider.addEventListener('input', function() {
                // Slider value is read during rendering
            });
        },

        setSide(side) {
            DitherApp.state.ui.selectedSide = side;
            
            const leftBtn = document.getElementById('leftSideBtn');
            const rightBtn = document.getElementById('rightSideBtn');
            
            if (side === 'left') {
                leftBtn.style.backgroundColor = COLORS.LEFT;
                rightBtn.style.backgroundColor = '';
            } else {
                leftBtn.style.backgroundColor = '';
                rightBtn.style.backgroundColor = COLORS.RIGHT;
            }
        },

        selectPattern(button, patternKey, side) {
            // Update button references
            if (side === 'left') {
                DitherApp.state.ui.leftButton = button;
            } else {
                DitherApp.state.ui.rightButton = button;
            }

            // Execute pattern and update state
            const patternResult = PATTERNS[patternKey]();
            if (side === 'left') {
                DitherApp.state.patterns.left = patternResult;
                DitherApp.state.ui.leftModeLabel.textContent = button.textContent;
            } else {
                DitherApp.state.patterns.right = patternResult;
                DitherApp.state.ui.rightModeLabel.textContent = button.textContent;
            }

            this.updateButtonColors();
            this.handleNoiseControls(button.textContent);
        },

        updateButtonColors() {
            const patternButtons = document.querySelectorAll('.pattern-controls button:not([id*="SideBtn"])');
            patternButtons.forEach(btn => btn.style.backgroundColor = '');

            const leftBtn = DitherApp.state.ui.leftButton;
            const rightBtn = DitherApp.state.ui.rightButton;

            if (leftBtn && rightBtn && leftBtn === rightBtn) {
                leftBtn.style.backgroundColor = COLORS.BOTH;
            } else {
                if (leftBtn) leftBtn.style.backgroundColor = COLORS.LEFT;
                if (rightBtn) rightBtn.style.backgroundColor = COLORS.RIGHT;
            }
        },

        handleNoiseControls(patternName) {
            const noiseControls = document.getElementById('noiseControls');
            if (noiseControls) {
                const isNoise = patternName.includes('Blue Noise') || patternName.includes('Random Noise');
                noiseControls.style.display = isNoise ? 'block' : 'none';
            }
        },

        setupCanvas() {
            DitherApp.state.canvas.element = document.createElement('canvas');
            DitherApp.state.canvas.ctx = DitherApp.state.canvas.element.getContext('2d');
            DitherApp.state.canvas.element.style.display = 'none';
            document.body.appendChild(DitherApp.state.canvas.element);
        },

        setupOutputCanvas(width, height) {
            if (DitherApp.state.canvas.output) {
                DitherApp.state.canvas.output.remove();
            }
            
            const outputDiv = document.getElementById('ditherOutput');
            outputDiv.innerHTML = '';
            
            DitherApp.state.canvas.output = document.createElement('canvas');
            DitherApp.state.canvas.outputCtx = DitherApp.state.canvas.output.getContext('2d');
            DitherApp.state.canvas.output.width = width;
            DitherApp.state.canvas.output.height = height;
            DitherApp.state.canvas.output.style.border = '2px solid #333';
            DitherApp.state.canvas.output.style.maxWidth = '100%';
            DitherApp.state.canvas.output.style.width = '100%';
            DitherApp.state.canvas.output.style.height = 'auto';
            DitherApp.state.canvas.output.style.imageRendering = 'pixelated';
            
            outputDiv.appendChild(DitherApp.state.canvas.output);
        },

        initializeDefaultPattern() {
            setTimeout(() => {
                const normalButton = document.querySelector('.pattern-controls button[onclick*="normal"]');
                if (normalButton) {
                    this.selectPattern(normalButton, 'normal', 'left');
                    this.selectPattern(normalButton, 'normal', 'right');
                    DitherApp.state.ui.selectedSide = 'right';
                    this.setSide('right');
                }
            }, 0);
        }
    },

    // Video and Processing
    video: {
        async start() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                DitherApp.state.streaming.videoElement = document.getElementById('videoElement');
                DitherApp.state.streaming.videoElement.srcObject = stream;
                
                DitherApp.state.streaming.videoElement.onloadedmetadata = () => {
                    const aspectRatio = DitherApp.state.streaming.videoElement.videoHeight / DitherApp.state.streaming.videoElement.videoWidth;
                    const outputHeight = Math.round(CONFIG.OUTPUT_WIDTH * aspectRatio);
                    
                    DitherApp.state.canvas.element.width = CONFIG.OUTPUT_WIDTH;
                    DitherApp.state.canvas.element.height = outputHeight;
                    
                    DitherApp.ui.setupOutputCanvas(CONFIG.OUTPUT_WIDTH, outputHeight);
                    DitherApp.ui.showSlider();
                    
                    DitherApp.state.streaming.videoElement.play();
                    this.startProcessing();
                };
                
            } catch (error) {
                console.error('Error accessing webcam:', error);
                const outputDiv = document.getElementById('ditherOutput');
                outputDiv.innerHTML = '<div style="text-align: center; color: red;">Error accessing webcam. Please ensure you have granted camera permissions.</div>';
            }
        },

        startProcessing() {
            DitherApp.state.streaming.active = true;
            this.processFrame();
        },

        processFrame() {
            if (!DitherApp.state.streaming.active) return;
            
            const canvas = DitherApp.state.canvas;
            // Flip image horizontally
            canvas.ctx.save();
            canvas.ctx.translate(canvas.element.width, 0);
            canvas.ctx.scale(-1, 1);
            canvas.ctx.drawImage(DitherApp.state.streaming.videoElement, 0, 0, canvas.element.width, canvas.element.height);
            canvas.ctx.restore();

            const imageData = canvas.ctx.getImageData(0, 0, canvas.element.width, canvas.element.height);
            const ditheredData = DitherApp.processing.applyDithering(imageData);

            if (ditheredData.length > 0) {
                DitherApp.processing.displayDitheredFrame(ditheredData, canvas.element.width, canvas.element.height);
            }

            setTimeout(() => {
                DitherApp.state.streaming.animationId = requestAnimationFrame(() => this.processFrame());
            }, CONFIG.FRAME_RATE);
        }
    },
    // Processing
    processing: {
        applyDithering(imageData) {
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;
            const result = [];
            
            const splitRatio = DitherApp.state.ui.comparisonSlider.value / 100;
            const splitX = Math.floor(width * splitRatio);
            
            // Handle noise generation
            if (DitherApp.state.patterns.left === 'blueNoise') {
                this.showLoadingMessage('Generating Left Blue Noise...');
                setTimeout(() => {
                    DitherApp.state.patterns.left = this.generateBlueNoise(width, height);
                }, 50);
                return [];
            } else if (DitherApp.state.patterns.left === 'random') {
                this.showLoadingMessage('Generating Left Random Noise...');
                setTimeout(() => {
                    DitherApp.state.patterns.left = this.generateRandomNoise(width, height);
                }, 50);
                return [];
            }
            
            if (DitherApp.state.patterns.right === 'blueNoise') {
                this.showLoadingMessage('Generating Right Blue Noise...');
                setTimeout(() => {
                    DitherApp.state.patterns.right = this.generateBlueNoise(width, height);
                }, 50);
                return [];
            } else if (DitherApp.state.patterns.right === 'random') {
                this.showLoadingMessage('Generating Right Random Noise...');
                setTimeout(() => {
                    DitherApp.state.patterns.right = this.generateRandomNoise(width, height);
                }, 50);
                return [];
            }
            
            for (let y = 0; y < height; y++) {
                result[y] = [];
                for (let x = 0; x < width; x++) {
                    const pixelIndex = (y * width + x) * 4;
                    
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    const grayscale = Math.round((r + g + b) / 3);
                    
                    const currentMatrix = x < splitX ? DitherApp.state.patterns.left : DitherApp.state.patterns.right;
                    
                    if (currentMatrix === 'normal') {
                        result[y][x] = grayscale;
                        continue;
                    }
                    
                    let threshold;
                    if (typeof currentMatrix === 'number') {
                        threshold = currentMatrix;
                    } else if (Array.isArray(currentMatrix)) {
                        const matrixHeight = currentMatrix.length;
                        const matrixWidth = currentMatrix[0].length;
                        threshold = currentMatrix[y % matrixHeight][x % matrixWidth];
                    } else {
                        threshold = 128;
                    }
                    
                    result[y][x] = grayscale > threshold ? 1 : 0;
                }
            }
            
            return result;
        },

        displayDitheredFrame(ditheredData, width, height) {
            const outputCtx = DitherApp.state.canvas.outputCtx;
            const imageData = outputCtx.createImageData(width, height);
            const data = imageData.data;
            
            const splitRatio = DitherApp.state.ui.comparisonSlider.value / 100;
            const splitX = Math.floor(width * splitRatio);
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const currentMatrix = x < splitX ? DitherApp.state.patterns.left : DitherApp.state.patterns.right;
                    
                    let value;
                    if (currentMatrix === 'normal') {
                        value = ditheredData[y][x];
                    } else {
                        value = ditheredData[y][x] * 255;
                    }
                    
                    data[index] = value;
                    data[index + 1] = value;
                    data[index + 2] = value;
                    data[index + 3] = 255;
                }
            }
            
            outputCtx.putImageData(imageData, 0, 0);
            
            // Draw split line
            outputCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            outputCtx.lineWidth = 2;
            outputCtx.beginPath();
            outputCtx.moveTo(splitX, 0);
            outputCtx.lineTo(splitX, height);
            outputCtx.stroke();
        },

        showLoadingMessage(message) {
            const outputCtx = DitherApp.state.canvas.outputCtx;
            outputCtx.fillStyle = 'red';
            outputCtx.font = 'bold 24px Arial';
            outputCtx.textAlign = 'center';
            outputCtx.textBaseline = 'middle';
            outputCtx.fillText(message, DitherApp.state.canvas.output.width / 2, DitherApp.state.canvas.output.height / 2);
        },

        generateBlueNoise(width, height) {
            const matrix = [];
            
            for (let i = 0; i < height; i++) {
                matrix[i] = [];
                for (let j = 0; j < width; j++) {
                    matrix[i][j] = 0;
                }
            }
            
            const totalPoints = width * height;
            const points = [];
            const sampleSize = Math.min(totalPoints, CONFIG.NOISE_SAMPLE_SIZE);
            
            for (let n = 0; n < sampleSize; n++) {
                let bestCandidate = null;
                let bestDistance = 0;
                
                for (let c = 0; c < 10; c++) {
                    const candidate = {
                        x: Math.random() * width,
                        y: Math.random() * height
                    };
                    
                    let minDistance = Infinity;
                    for (const point of points) {
                        const dx = candidate.x - point.x;
                        const dy = candidate.y - point.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        minDistance = Math.min(minDistance, distance);
                    }
                    
                    if (minDistance > bestDistance) {
                        bestDistance = minDistance;
                        bestCandidate = candidate;
                    }
                }
                
                if (bestCandidate) {
                    points.push(bestCandidate);
                    const gridX = Math.min(Math.floor(bestCandidate.x), width - 1);
                    const gridY = Math.min(Math.floor(bestCandidate.y), height - 1);
                    matrix[gridY][gridX] = Math.floor((n / sampleSize) * 255);
                }
            }
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (matrix[y][x] === 0 && Math.random() > 0.5) {
                        matrix[y][x] = Math.floor(Math.random() * 128) + 64;
                    }
                }
            }
            
            return matrix;
        },

        generateRandomNoise(width, height) {
            const matrix = [];
            for (let i = 0; i < height; i++) {
                matrix[i] = [];
                for (let j = 0; j < width; j++) {
                    matrix[i][j] = Math.floor(Math.random() * 256);
                }
            }
            return matrix;
        }
    }
};

// Initialize application
window.onload = function() {
    DitherApp.ui.init();
    DitherApp.video.start();
    DitherApp.ui.initializeDefaultPattern();
};