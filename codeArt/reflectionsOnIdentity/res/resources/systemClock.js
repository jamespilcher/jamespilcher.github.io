export class SystemClock {
    constructor(multiplier = 1.0) {
        this.multiplier = multiplier;
        this._startReal = Date.now() / 1000;
        this._startFast = this._startReal;
    }

    // Seconds, running multiplier times faster than real time.
    time() {
        const realNow = Date.now() / 1000;
        const elapsedReal = realNow - this._startReal;
        return this._startFast + elapsedReal * this.multiplier;
    }
}
