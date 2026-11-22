// Which keys are held down, with the one call the app uses from Python's keyboard package.

const down = new Set();

function keyName(event) {
    return event.code === "Space" ? "space" : (event.key ?? "").toLowerCase();
}

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
    }
    down.add(keyName(event));
});

window.addEventListener("keyup", (event) => {
    down.delete(keyName(event));
});

window.addEventListener("blur", () => {
    down.clear();
});

export function isPressed(key) {
    return down.has(key);
}

// A press on the element counts as holding the key, for screens with no keyboard.
export function pressElementAsKey(element, key) {
    element.addEventListener("pointerdown", () => down.add(key));
    for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
        element.addEventListener(type, () => down.delete(key));
    }
}
