// The folders of photos the scenes read and write, held in memory.
// Photos are stored as JPEGs and are gone when the page is closed.

const files = new Map();

export function join(...parts) {
    return parts.join("/");
}

export function listdir(folder) {
    const prefix = `${folder}/`;
    const names = [];
    for (const path of files.keys()) {
        if (path.startsWith(prefix) && !path.slice(prefix.length).includes("/")) {
            names.push(path.slice(prefix.length));
        }
    }
    return names;
}

// Returns the image, or null if there is no file at the path.
export async function imread(path) {
    const blob = files.get(path);
    return blob === undefined ? null : createImageBitmap(blob);
}

export function imwrite(path, frame) {
    return new Promise((resolve) => {
        frame.toBlob(
            (blob) => {
                files.set(path, blob);
                resolve();
            },
            "image/jpeg",
            0.95
        );
    });
}
