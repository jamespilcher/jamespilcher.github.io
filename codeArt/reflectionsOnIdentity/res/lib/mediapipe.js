// MediaPipe's hand and face tracking, loaded from its JS packages.
//
// The packages hand results to a callback. process() waits for that callback so a scene
// gets the results of a frame back from the call, as it does in Python.

const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe";

const solutions = [];

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Could not load ${src}`));
        document.head.append(script);
    });
}

class Solution {
    constructor(packageName, version, className, options) {
        this.baseUrl = `${CDN}/${packageName}@${version}`;
        this.scriptName = `${packageName}.js`;
        this.className = className;
        this.options = options;
        this.solution = null;
        this.results = null;
        this.loading = null;
        solutions.push(this);
    }

    load() {
        if (this.loading === null) {
            this.loading = this._load();
        }
        return this.loading;
    }

    async _load() {
        if (window[this.className] === undefined) {
            await loadScript(`${this.baseUrl}/${this.scriptName}`);
        }
        this.solution = new window[this.className]({
            locateFile: (file) => `${this.baseUrl}/${file}`,
        });
        this.solution.setOptions(this.options);
        this.solution.onResults((results) => {
            this.results = results;
        });
        await this.solution.initialize();

        // The first frame is slow while the model starts up, so an empty one is sent now.
        await this.solution.send({ image: document.createElement("canvas") });
    }

    async process(image) {
        await this.load();
        await this.solution.send({ image });
        return this.results;
    }
}

export class Hands extends Solution {
    constructor(options) {
        super("hands", "0.4.1675469240", "Hands", options);
    }
}

export class FaceMesh extends Solution {
    constructor(options) {
        super("face_mesh", "0.4.1633559619", "FaceMesh", options);
    }
}

// Loads every model made so far, one at a time. The packages share global loader
// names, so loading two at once can hand one model the other's files.
export async function loadModels() {
    for (const solution of solutions) {
        await solution.load();
    }
}
