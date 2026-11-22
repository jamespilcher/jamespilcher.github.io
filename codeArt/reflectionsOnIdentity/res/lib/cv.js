import { BASE_LINE, CAP_LINE, SIMPLEX, COMPLEX } from "./hersheyFonts.js";

// The cv2 and numpy calls the scenes use, drawn with canvas.
//
// A frame is a canvas. Frames made here come from a pool that is reused on every loop,
// so a frame only lasts until the next recycleFrames(). keep() makes a copy that lasts.
// Colours are [red, green, blue].

export const FONT_HERSHEY_SIMPLEX = 0;
export const FONT_HERSHEY_COMPLEX = 3;

const FONTS = {
    [FONT_HERSHEY_SIMPLEX]: SIMPLEX,
    [FONT_HERSHEY_COMPLEX]: COMPLEX,
};

const pool = [];
let poolUsed = 0;
const windows = new Map();

export function recycleFrames() {
    poolUsed = 0;
}

function context(frame) {
    return frame.getContext("2d");
}

function rgb(color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function newFrame(width, height, color = [0, 0, 0]) {
    if (poolUsed === pool.length) {
        pool.push(document.createElement("canvas"));
    }
    const frame = pool[poolUsed++];
    if (frame.width !== width || frame.height !== height) {
        frame.width = width;
        frame.height = height;
    }
    const ctx = context(frame);
    ctx.fillStyle = rgb(color);
    ctx.fillRect(0, 0, width, height);
    return frame;
}

export function full(width, height, color) {
    return newFrame(width, height, color);
}

export function zeros(width, height) {
    return newFrame(width, height);
}

export function zerosLike(frame) {
    return newFrame(frame.width, frame.height);
}

export function keep(frame, reuse = null) {
    const kept = reuse ?? document.createElement("canvas");
    if (kept.width !== frame.width || kept.height !== frame.height) {
        kept.width = frame.width;
        kept.height = frame.height;
    }
    context(kept).drawImage(frame, 0, 0);
    return kept;
}

// Part of a frame, like the numpy slice frame[y0:y1, x0:x1].
export function slice(frame, y0, y1, x0, x1) {
    const width = frame.videoWidth ?? frame.width;
    const height = frame.videoHeight ?? frame.height;
    const left = Math.min(Math.max(x0, 0), width);
    const top = Math.min(Math.max(y0, 0), height);
    const right = Math.min(Math.max(x1, left), width);
    const bottom = Math.min(Math.max(y1, top), height);
    return {
        image: frame.image ?? frame,
        x: (frame.x ?? 0) + left,
        y: (frame.y ?? 0) + top,
        width: right - left,
        height: bottom - top,
    };
}

function asSlice(frame) {
    return frame.image ? frame : slice(frame, 0, frame.height, 0, frame.width);
}

// Copies src onto dst with its top left corner at (x, y), like dst[y:y+h, x:x+w] = src.
export function paste(dst, x, y, src) {
    const part = asSlice(src);
    if (part.width === 0 || part.height === 0) {
        return;
    }
    context(dst).drawImage(part.image, part.x, part.y, part.width, part.height, x, y, part.width, part.height);
}

export function resize(src, dsize, fx = 0, fy = 0) {
    const part = asSlice(src);
    let [width, height] = dsize;
    if (width === 0 && height === 0) {
        width = Math.round(part.width * fx);
        height = Math.round(part.height * fy);
    }
    const frame = newFrame(width, height);
    context(frame).drawImage(part.image, part.x, part.y, part.width, part.height, 0, 0, width, height);
    return frame;
}

// src1 * alpha + src2 * beta
export function addWeighted(src1, alpha, src2, beta) {
    const frame = newFrame(src1.width, src1.height);
    const ctx = context(frame);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha;
    ctx.drawImage(src1, 0, 0);
    ctx.globalAlpha = beta;
    ctx.drawImage(src2, 0, 0);
    ctx.restore();
    return frame;
}

function cvRound(value) {
    const rounded = Math.round(value);
    const isHalf = Math.abs(value % 1) === 0.5;
    return isHalf && rounded % 2 !== 0 ? rounded - 1 : rounded;
}

// OpenCV reads text as UTF-8 bytes and draws "?" for anything outside printable ASCII.
// The simplex font draws one "?" per byte, the complex font one "?" per character.
function glyphsOf(text, fontFace) {
    const font = FONTS[fontFace];
    const bytes = new TextEncoder().encode(text);
    const glyphs = [];
    for (let i = 0; i < bytes.length; i++) {
        let c = bytes[i];
        if (c >= 0x80 && fontFace === FONT_HERSHEY_COMPLEX) {
            for (const leadByte of [0xc0, 0xe0, 0xf0, 0xf8, 0xfc]) {
                if (c >= leadByte && i + 1 < bytes.length) {
                    i++;
                }
            }
            c = 63;
        }
        if (c >= 127 || c < 32) {
            c = 63;
        }
        const glyph = font[c - 32];
        glyphs.push({
            left: glyph.charCodeAt(0) - 82,
            right: glyph.charCodeAt(1) - 82,
            strokes: glyph.slice(2).split(" "),
        });
    }
    return glyphs;
}

// Returns [[width, height], baseLine].
export function getTextSize(text, fontFace, fontScale, thickness) {
    const height = cvRound((CAP_LINE + BASE_LINE) * fontScale + Math.trunc((thickness + 1) / 2));
    let viewX = 0;
    for (const glyph of glyphsOf(text, fontFace)) {
        viewX += (glyph.right - glyph.left) * fontScale;
    }
    const width = cvRound(viewX + thickness);
    return [[width, height], cvRound(BASE_LINE * fontScale + thickness * 0.5)];
}

// OpenCV draws heavier lines than canvas does at the same width. These widths match its weight.
function lineWidth(thickness) {
    return thickness <= 1 ? 1.3 : thickness + 1.4;
}

// org is the bottom left corner of the text.
export function putText(frame, text, org, fontFace, fontScale, color, thickness = 1) {
    const ctx = context(frame);
    ctx.save();
    ctx.strokeStyle = rgb(color);
    ctx.lineWidth = lineWidth(thickness);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // OpenCV puts whole-number coordinates at pixel centres, canvas puts them at pixel corners.
    ctx.translate(0.5, 0.5);

    let viewX = org[0];
    const viewY = org[1] - BASE_LINE * fontScale;
    for (const glyph of glyphsOf(text, fontFace)) {
        viewX -= glyph.left * fontScale;
        for (const stroke of glyph.strokes) {
            if (stroke.length < 4) {
                continue;
            }
            ctx.beginPath();
            for (let i = 0; i < stroke.length; i += 2) {
                const x = (stroke.charCodeAt(i) - 82) * fontScale + viewX;
                const y = (stroke.charCodeAt(i + 1) - 82) * fontScale + viewY;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        viewX += glyph.right * fontScale;
    }
    ctx.restore();
}

export function namedWindow(name, canvas) {
    windows.set(name, canvas);
}

export function imshow(name, frame) {
    const canvas = windows.get(name);
    context(canvas).drawImage(frame, 0, 0, canvas.width, canvas.height);
}

export function destroyAllWindows() {
    for (const canvas of windows.values()) {
        context(canvas).clearRect(0, 0, canvas.width, canvas.height);
    }
    windows.clear();
}
