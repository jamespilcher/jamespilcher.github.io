// Old code from university project...
// Ignore the spaghetti...


var posts = document.getElementById("posts").getElementsByTagName("a");
const num_posts = posts.length;
colours = [];

/* Get list of colours */
for (i = 0; i < num_posts; i++) {
    colours.push(getColorAtIndex(i));
}

/* Randomize colours in-place using Durstenfeld shuffle algorithm */
shuffleArray(colours);

/* Set colours */
for (i = 0; i < num_posts; i++) {
    posts.item(i).style.color = colours[i];
}

/* https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/* Get the colour at its index around the colour wheel */
function getColorAtIndex(x) {
    const step = 360 / num_posts;
    const hue = x * step;
    const saturation = 100;
    const lightness = 40;
    const rgb = hslToRgb(hue, saturation, lightness);
    return rgb;
}

/* inline styles doesn't seem to work with hsl (floating points?), convert it to RGB instead */
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
        g = Math.round(hue2rgb(p, q, h) * 255);
        b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    }
    return `rgb(${r}, ${g}, ${b})`;
}
