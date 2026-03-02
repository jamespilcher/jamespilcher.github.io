let thresholdMatrix = [];
let isStreaming = false;
let animationId = null;
let videoElement = null;
let canvas = null;
let ctx = null;
let outputCanvas = null;
let outputCtx = null;

// Initialize and start immediately
window.onload = function() {
    createDitherPresets(); // Create pattern buttons once
    setupCanvas();
    startDithering(); // Auto-start
    
    // Set default selections only on initial load
    setTimeout(() => {
        const firstPatternButton = document.querySelector('.pattern-controls button');
        if (firstPatternButton) {
            selectPattern(firstPatternButton, normalMatrix);
        }
    }, 0);
};


function createDitherPresets() {
    const presetsDiv = document.getElementById('ditherPresets');
    presetsDiv.innerHTML = '';
    
    const controls = document.createElement('div');
    controls.className = 'pattern-controls';
    controls.innerHTML = `
        <button onclick="selectPattern(this, normalMatrix)">Normal</button>
        <button onclick="selectPattern(this, threshold25Matrix)">25% Threshold</button>
        <button onclick="selectPattern(this, threshold50Matrix)">50% Threshold</button>
        <button onclick="selectPattern(this, threshold75Matrix)">75% Threshold</button>
        <button onclick="selectPattern(this, bayer2x2Matrix)">Bayer 2×2</button>
        <button onclick="selectPattern(this, bayer4x4Matrix)">Bayer 4×4</button>
        <button onclick="selectPattern(this, bayer8x8Matrix)">Bayer 8×8</button>
        <button onclick="selectPattern(this, blueNoiseMatrix)">Blue Noise</button>
        <button onclick="selectPattern(this, clockwiseMatrix)">Clockwise</button>
        <button onclick="selectPattern(this, dispersedDotMatrix)">Dispersed Dot</button>
        <button onclick="selectPattern(this, verticalLineMatrix)">Vertical Lines</button>
        <button onclick="selectPattern(this, horizontalLineMatrix)">Horizontal Lines</button>
        <button onclick="selectPattern(this, randomMatrix)">Random Noise</button>
    `;
    presetsDiv.appendChild(controls);
}

function selectPattern(button, patternFunction) {
    // Remove green background from all buttons
    const allButtons = document.querySelectorAll('.pattern-controls button');
    allButtons.forEach(btn => btn.style.backgroundColor = '');
    
    // Set green background for selected button
    button.style.backgroundColor = 'green';
    
    // Execute the pattern function
    patternFunction();
    
    // Show/hide recalculate noise button based on pattern type
    const noiseControls = document.getElementById('noiseControls');
    const buttonText = button.textContent;
    if (buttonText.includes('Blue Noise') || buttonText.includes('Random Noise')) {
        noiseControls.style.display = 'block';
    } else {
        noiseControls.style.display = 'none';
    }
}

function recalculateNoise() {
    // Find currently selected pattern
    const selectedButton = document.querySelector('.pattern-controls button[style*="green"]');
    if (selectedButton) {
        const buttonText = selectedButton.textContent;
        if (buttonText.includes('Blue Noise')) {
            thresholdMatrix = 'blueNoise'; // Reset to flag for regeneration
        } else if (buttonText.includes('Random Noise')) {
            thresholdMatrix = 'random'; // Reset to flag for regeneration
        }
    }
}

function normalMatrix() {
    thresholdMatrix = 'normal'; // Special flag for no dithering
}

function threshold25Matrix() {
    thresholdMatrix = 64; // Single value for uniform threshold
}

function threshold50Matrix() {
    thresholdMatrix = 128; // Single value for uniform threshold
}

function threshold75Matrix() {
    thresholdMatrix = 192; // Single value for uniform threshold
}

function bayer2x2Matrix() {
    thresholdMatrix = [
        [0, 128],
        [192, 64]
    ];
}

function bayer4x4Matrix() {
    thresholdMatrix = [
        [0, 128, 32, 160],
        [192, 64, 224, 96],
        [48, 176, 16, 144],
        [240, 112, 208, 80]
    ];
}

function bayer8x8Matrix() {
    thresholdMatrix = [
        [0, 128, 32, 160, 8, 136, 40, 168],
        [192, 64, 224, 96, 200, 72, 232, 104],
        [48, 176, 16, 144, 56, 184, 24, 152],
        [240, 112, 208, 80, 248, 120, 216, 88],
        [12, 140, 44, 172, 4, 132, 36, 164],
        [204, 76, 236, 108, 196, 68, 228, 100],
        [60, 188, 28, 156, 52, 180, 20, 148],
        [252, 124, 220, 92, 244, 116, 212, 84]
    ];
}

function clockwiseMatrix() {
    thresholdMatrix = [
        [64, 32, 96],
        [128, 0, 160],
        [192, 224, 255]
    ];
}

function dispersedDotMatrix() {
    thresholdMatrix = [
        [128, 64, 192],
        [32, 255, 96],
        [224, 160, 0]
    ];
}

function verticalLineMatrix() {
    thresholdMatrix = [
        [0, 255, 0],
        [0, 255, 0],
        [0, 255, 0]
    ];
}

function horizontalLineMatrix() {
    thresholdMatrix = [
        [0, 0, 0],
        [255, 255, 255],
        [0, 0, 0]
    ];
}

function blueNoiseMatrix() {
    // Flag for full-image blue noise generation
    thresholdMatrix = 'blueNoise';
}

function randomMatrix() {
    // Flag for full-image random generation
    thresholdMatrix = 'random';
}



function setupCanvas() {
    // Create hidden canvas for image processing
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
}

function setupOutputCanvas(width, height) {
    // Remove existing output canvas if any
    if (outputCanvas) {
        outputCanvas.remove();
    }
    
    // Create display canvas for dither output
    outputCanvas = document.createElement('canvas');
    outputCtx = outputCanvas.getContext('2d');
    outputCanvas.width = width;
    outputCanvas.height = height;
    outputCanvas.style.border = '2px solid #333';
    outputCanvas.style.maxWidth = '100%';
    outputCanvas.style.width = '100%';
    outputCanvas.style.height = 'auto';
    outputCanvas.style.imageRendering = 'pixelated'; // Keep sharp pixels when scaling
    
    // Add to output div
    const outputDiv = document.getElementById('ditherOutput');
    outputDiv.appendChild(outputCanvas);
}

async function startDithering() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement = document.getElementById('videoElement');
        videoElement.srcObject = stream;
        
        videoElement.onloadedmetadata = () => {
            // Set canvas dimensions based on desired output resolution
            const outputWidth = 500; // Fixed resolution
            const aspectRatio = videoElement.videoHeight / videoElement.videoWidth;
            const outputHeight = Math.round(outputWidth * aspectRatio);
            
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            
            // Create output canvas for display
            setupOutputCanvas(outputWidth, outputHeight);
            
            videoElement.play();
            startProcessing();
        };
        
    } catch (error) {
        console.error('Error accessing webcam:', error);
        const outputDiv = document.getElementById('ditherOutput');
        outputDiv.innerHTML = '<div style="text-align: center; color: red;">Error accessing webcam. Please ensure you have granted camera permissions.</div>';
    }
}


function startProcessing() {
    isStreaming = true;
    processFrame();
}

function processFrame() {
    if (!isStreaming) return;
    
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply dithering
    const ditheredData = applyDithering(imageData);
    
    // Only display if we have valid dithered data (not empty during loading)
    if (ditheredData.length > 0) {
        displayDitheredFrame(ditheredData, canvas.width, canvas.height);
    }
    
    // Continue processing at ~30fps for better performance
    setTimeout(() => {
        animationId = requestAnimationFrame(processFrame);
    }, 33);
}
    
function applyDithering(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const result = [];
    
    // Handle normal (no dithering) mode
    if (thresholdMatrix === 'normal') {
        for (let y = 0; y < height; y++) {
            result[y] = [];
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                
                // Convert to grayscale and keep original values (0-255)
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                result[y][x] = Math.round((r + g + b) / 3);
            }
        }
        return result;
    }
    
    // Generate full-image noise patterns on first use
    if (thresholdMatrix === 'blueNoise') {
        showCanvasLoadingMessage('Generating Blue Noise...');
        console.log('Generating blue noise for', width, 'x', height, 'image...');
        // Use setTimeout to allow the loading message to render
        setTimeout(() => {
            thresholdMatrix = generateBlueNoise(width, height);
        }, 50);
        // Return early this frame, will continue next frame with generated matrix
        return [];
    } else if (thresholdMatrix === 'random') {
        showCanvasLoadingMessage('Generating Random Noise...');
        console.log('Generating random noise for', width, 'x', height, 'image...');
        setTimeout(() => {
            thresholdMatrix = generateRandomNoise(width, height);
        }, 50);
        return [];
    }
    
    for (let y = 0; y < height; y++) {
        result[y] = [];
        for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4;
            
            // Convert to grayscale
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            const grayscale = Math.round((r + g + b) / 3);
            
            // Get threshold based on pattern type
            let threshold;
            if (typeof thresholdMatrix === 'number') {
                // Uniform threshold (25%, 50%, 75%)
                threshold = thresholdMatrix;
            } else if (Array.isArray(thresholdMatrix)) {
                // Matrix pattern (including full-image noise)
                const matrixHeight = thresholdMatrix.length;
                const matrixWidth = thresholdMatrix[0].length;
                threshold = thresholdMatrix[y % matrixHeight][x % matrixWidth];
            } else {
                threshold = 128; // Default
            }
            
            // Apply threshold
            result[y][x] = grayscale > threshold ? 1 : 0;
        }
    }
    
    return result;
}

function generateBlueNoise(width, height) {
    const matrix = [];
    
    // Initialize with zeros
    for (let i = 0; i < height; i++) {
        matrix[i] = [];
        for (let j = 0; j < width; j++) {
            matrix[i][j] = 0;
        }
    }
    
    // Generate blue noise-like distribution using Mitchell's algorithm
    const totalPoints = width * height;
    const points = [];
    
    // Use a sampling approach for large images to avoid performance issues
    const sampleSize = Math.min(totalPoints, 10000); // Limit for performance
    
    for (let n = 0; n < sampleSize; n++) {
        let bestCandidate = null;
        let bestDistance = 0;
        
        // Try multiple candidates
        for (let c = 0; c < 10; c++) {
            const candidate = {
                x: Math.random() * width,
                y: Math.random() * height
            };
            
            // Find minimum distance to existing points
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
    
    // Fill remaining pixels with interpolated values
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (matrix[y][x] === 0 && Math.random() > 0.5) {
                matrix[y][x] = Math.floor(Math.random() * 128) + 64; // Mid-range values
            }
        }
    }
    
    return matrix;
}

function generateRandomNoise(width, height) {
    const matrix = [];
    for (let i = 0; i < height; i++) {
        matrix[i] = [];
        for (let j = 0; j < width; j++) {
            matrix[i][j] = Math.floor(Math.random() * 256);
        }
    }
    return matrix;
}

function displayDitheredFrame(ditheredData, width, height) {
    // Create ImageData for fast canvas rendering
    const imageData = outputCtx.createImageData(width, height);
    const data = imageData.data;
    
    // Check if this is normal mode (grayscale values) or dithered mode (0/1 values)
    const isNormalMode = thresholdMatrix === 'normal';
    
    // Fill ImageData with pixels
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            let value;
            
            if (isNormalMode) {
                // Normal mode: use grayscale value directly (0-255)
                value = ditheredData[y][x];
            } else {
                // Dithered mode: convert 0/1 to 0/255
                value = ditheredData[y][x] * 255;
            }
            
            data[index] = value;     // R
            data[index + 1] = value; // G
            data[index + 2] = value; // B
            data[index + 3] = 255;   // A
        }
    }
    
    // Draw to canvas in one operation
    outputCtx.putImageData(imageData, 0, 0);
}

function showCanvasLoadingMessage(message) {
    // Clear canvas and draw loading message

    
    // Set up text style
    outputCtx.fillStyle = 'red';
    outputCtx.font = 'bold 24px Arial';
    outputCtx.textAlign = 'center';
    outputCtx.textBaseline = 'middle';
    
    // Draw loading message in center
    outputCtx.fillText(message, outputCanvas.width / 2, outputCanvas.height / 2);
}