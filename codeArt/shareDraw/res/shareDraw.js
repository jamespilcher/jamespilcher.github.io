// 64x64 drawable grid with URL hash/compression (step 1: grid + draw logic)
const GRID_SIZE = 64;

const gridElem = document.getElementById('grid');
const shareUrlElem = document.getElementById('share-url');
const colourPicker = document.getElementById('colour-picker');
const eraserBtn = document.getElementById('eraser-btn');
const thicknessSlider = document.getElementById('thickness-slider');
const thicknessValue = document.getElementById('thickness-value');
const clearBtn = document.getElementById('clear-btn');
const bgColourPicker = document.getElementById('bg-colour-picker');
const shareBtn = document.getElementById('share-btn');
let grid = Array(GRID_SIZE * GRID_SIZE).fill(0); // 0: white, 1: coloured
let drawColour = '#000000';
let eraserMode = false;
thicknessSlider.value = 4;
let lineThickness = 4;
let mouseDown = false;
let lastDrawIdx = null;
let bgColour = bgColourPicker.value;

colourPicker.addEventListener('input', e => {
	drawColour = e.target.value;
	renderGrid();
	debouncedUpdateShareUrl();
});

bgColourPicker.addEventListener('input', e => {
    bgColour = e.target.value;
    renderGrid();
    debouncedUpdateShareUrl();
});

eraserBtn.addEventListener('click', () => {
	eraserMode = !eraserMode;
	eraserBtn.classList.toggle('active', eraserMode);
	eraserBtn.textContent = eraserMode ? 'Eraser (on)' : 'Eraser (off)';
});

thicknessSlider.addEventListener('input', e => {
	lineThickness = parseInt(e.target.value, 10);
	thicknessValue.textContent = lineThickness;
});
thicknessValue.textContent = thicknessSlider.value;

clearBtn.addEventListener('click', () => {
	grid = Array(GRID_SIZE * GRID_SIZE).fill(0);
	renderGrid();
	debouncedUpdateShareUrl();
});

bgColourPicker.addEventListener('input', e => {
	bgColour = e.target.value;
	debouncedUpdateShareUrl();
});

// --- Efficient grid rendering ---
// On load/clear, call renderGrid() to build the DOM. On draw, update only changed cells.

function renderGrid() {
  gridElem.innerHTML = '';
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.idx = i;
    cell.style.background = grid[i] ? drawColour : bgColour;
    cell.addEventListener('mouseenter', handleCellDrag);
    cell.addEventListener('mousedown', handleCellClick);
    gridElem.appendChild(cell);
  }
}

function updateCell(idx) {
  const cell = gridElem.children[idx];
  if (cell) {
    cell.style.background = grid[idx] ? drawColour : bgColour;
  }
}

// Update mouse/touch handlers to only update changed cells
function handleCellClick(e) {
  if (e.cancelable) e.preventDefault(); // Prevent scrolling only if possible
  const idx = +e.target.dataset.idx;
  drawValue = eraserMode ? 0 : 1;
  mouseDown = true; // Set mouseDown on click for drag
  lastDrawIdx = idx;
  drawAt(idx, drawValue, lineThickness);
}

function handleCellDrag(e) {
  if (e.cancelable) e.preventDefault(); // Prevent scrolling only if possible
  if (!mouseDown || (e.buttons !== undefined && (e.buttons & 1) === 0)) return;
  const idx = +e.target.dataset.idx;
  if (lastDrawIdx !== null && lastDrawIdx !== idx) {
    // Interpolate between lastDrawIdx and idx
    const x0 = lastDrawIdx % GRID_SIZE;
    const y0 = Math.floor(lastDrawIdx / GRID_SIZE);
    const x1 = idx % GRID_SIZE;
    const y1 = Math.floor(idx / GRID_SIZE);
    // Bresenham's line algorithm
    let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, e2;
    let x = x0, y = y0;
    while (true) {
      const i = y * GRID_SIZE + x;
      drawAt(i, drawValue, lineThickness);
      if (x === x1 && y === y1) break;
      e2 = 2 * err;
      if (e2 >= dy) { err += dy; x += sx; }
      if (e2 <= dx) { err += dx; y += sy; }
    }
  } else {
    drawAt(idx, drawValue, lineThickness);
  }
  lastDrawIdx = idx;
}

function handleCellTouch(e) {
  if (e.cancelable) e.preventDefault(); // Prevent scrolling only if possible
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!target || !target.classList.contains('grid-cell')) return;
  const idx = +target.dataset.idx;
  drawValue = eraserMode ? 0 : 1;
  if (lastDrawIdx !== null && lastDrawIdx !== idx) {
    // Interpolate between lastDrawIdx and idx (Bresenham)
    const x0 = lastDrawIdx % GRID_SIZE;
    const y0 = Math.floor(lastDrawIdx / GRID_SIZE);
    const x1 = idx % GRID_SIZE;
    const y1 = Math.floor(idx / GRID_SIZE);
    let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, e2;
    let x = x0, y = y0;
    while (true) {
      const i = y * GRID_SIZE + x;
      drawAt(i, drawValue, lineThickness);
      if (x === x1 && y === y1) break;
      e2 = 2 * err;
      if (e2 >= dy) { err += dy; x += sx; }
      if (e2 <= dx) { err += dx; y += sy; }
    }
  } else {
    drawAt(idx, drawValue, lineThickness);
  }
  lastDrawIdx = idx;
}

// Debounce helper
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedUpdateShareUrl = debounce(updateShareUrl, 250);

// Draw a circle and update only changed cells if updateDom=true
function drawAt(idx, value, thickness) {
  const x0 = idx % GRID_SIZE;
  const y0 = Math.floor(idx / GRID_SIZE);
  const r = thickness / 2;
  for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) {
    for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
      const x = x0 + dx;
      const y = y0 + dy;
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        if (Math.sqrt(dx*dx + dy*dy) <= r) {
          const i = y * GRID_SIZE + x;
          if (grid[i] !== value) {
            grid[i] = value;
            updateCell(i);
          }
        }
      }
    }
  }
  debouncedUpdateShareUrl();
}

// --- URL-safe base64 helpers ---
function toUrlSafeBase64(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromUrlSafeBase64(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return b64;
}

// Binary encode grid (1 bit per cell), then URL-safe base64
function gridToBase64() {
  const bytes = new Uint8Array(512); // 4096 bits = 512 bytes
  for (let i = 0; i < grid.length; i++) {
    const byteIdx = (i / 8) | 0;
    const bitIdx = i % 8;
    if (grid[i]) bytes[byteIdx] |= (1 << bitIdx);
  }
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return toUrlSafeBase64(btoa(bin));
}

function base64ToGrid(b64) {
  try {
    const bin = atob(fromUrlSafeBase64(b64));
    if (bin.length !== 512) return false;
    const arr = Array(GRID_SIZE * GRID_SIZE).fill(0);
    for (let i = 0; i < arr.length; i++) {
      const byteIdx = (i / 8) | 0;
      const bitIdx = i % 8;
      arr[i] = (bin.charCodeAt(byteIdx) >> bitIdx) & 1;
    }
    return arr;
  } catch (e) { return false; }
}

// --- updateShareUrl: store colours as 6 hex digits (no #) ---
function updateShareUrl() {
  const colour = colourPicker.value.replace(/^#/, '');
  const bg = bgColourPicker.value.replace(/^#/, '');
  const hash = colour + bg + gridToBase64();
  const url = location.origin + location.pathname + '#' + hash;
  shareUrlElem.value = url;
  if (location.hash !== '#' + hash) {
    history.replaceState(null, '', '#' + hash);
  }
}

// --- loadFromHash: parse colours as 6 hex digits and add # for input values ---
function loadFromHash() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash) return;
  if (hash.length > 12) {
    const colour = '#' + hash.slice(0, 6);
    const bg = '#' + hash.slice(6, 12);
    if (/^#[0-9a-fA-F]{6}$/.test(colour) && /^#[0-9a-fA-F]{6}$/.test(bg)) {
      colourPicker.value = colour;
      drawColour = colour;
      bgColourPicker.value = bg;
      bgColour = bg;
      const arr = base64ToGrid(hash.slice(12));
      if (arr) { grid = arr; return; }
    }
  }
  // Fallback: old format
  if (hash.length > 6) {
    const colour = '#' + hash.slice(0, 6);
    if (/^#[0-9a-fA-F]{6}$/.test(colour)) {
      colourPicker.value = colour;
      drawColour = colour;
      const arr = base64ToGrid(hash.slice(6));
      if (arr) { grid = arr; return; }
    }
  }
  const arr = base64ToGrid(hash);
  if (arr) { grid = arr; return; }
}

function handleHashChange() {
	loadFromHash();
	renderGrid();
}


// Update renderGrid and updateCell to use bgColour
const originalRenderGrid = renderGrid;
renderGrid = function() {
  gridElem.innerHTML = '';
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.idx = i;
    cell.style.background = grid[i] ? drawColour : bgColour;
    cell.addEventListener('mouseenter', handleCellDrag);
    cell.addEventListener('mousedown', handleCellClick);
    cell.addEventListener('touchstart', handleCellClick, { passive: false });
    cell.addEventListener('touchmove', handleCellTouch, { passive: false });
    gridElem.appendChild(cell);
  }
};

// Prevent all zooming and scrolling on the grid (single or multi-touch)
function addTouchPrevention() {
  for (let i = 0; i < gridElem.children.length; i++) {
    gridElem.children[i].addEventListener('touchstart', function(e) {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    gridElem.children[i].addEventListener('touchmove', function(e) {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
  }
}

// Call after renderGrid
const originalRenderGrid2 = renderGrid;
renderGrid = function() {
  originalRenderGrid2.apply(this, arguments);
  addTouchPrevention();
};

window.addEventListener('hashchange', handleHashChange);

window.addEventListener('mouseup', () => { mouseDown = false; lastDrawIdx = null; });
window.addEventListener('touchend', () => { lastDrawIdx = null; });

shareBtn.addEventListener('click', async () => {
    console.log(shareUrlElem.value);
  let url = shareUrlElem.value;
  if (navigator.share) {
    try {
      await navigator.share({ url, title: 'I shareDrew something for you <3'});
    } catch (e) {
      // User cancelled or error
    }
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    shareBtn.textContent = 'Copied!';
    setTimeout(() => { shareBtn.textContent = 'Share'; }, 1200);
  } else {
    shareUrlElem.select();
    document.execCommand('copy');
    shareBtn.textContent = 'Copied!';
    setTimeout(() => { shareBtn.textContent = 'Share'; }, 1200);
  }
});

loadFromHash();
renderGrid();
updateShareUrl();
