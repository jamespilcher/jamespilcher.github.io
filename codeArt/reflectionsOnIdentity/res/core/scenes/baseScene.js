import * as cv from "../../lib/cv.js";
import { FIXED_UPDATE_INTERVAL_SECS, SCENE_RUNTIME_SECS, FADE_DURATION_SECS } from "../constants.js";

export class BaseScene {
    constructor(resources) {
        this.resources = resources;
        this.startTime = null;
        this.complete = false;
        this.lastFixedUpdateTime = this.resources.clock.time();
    }

    async startScene() {
        this.startTime = this.resources.clock.time();
        this.complete = false;
    }

    // Runs at most every FIXED_UPDATE_INTERVAL_SECS. Scenes override it.
    async fixedUpdate() {}

    async templateFrame(frame) {
        if (this.resources.clock.time() - this.startTime >= SCENE_RUNTIME_SECS) {
            await this.endScene();
        }

        if (this.resources.clock.time() - this.lastFixedUpdateTime >= FIXED_UPDATE_INTERVAL_SECS) {
            this.lastFixedUpdateTime = this.resources.clock.time();
            await this.fixedUpdate();
        }

        if (this.complete) {
            return cv.zerosLike(frame);
        }

        frame = await this.customFrameStep(frame);

        frame = this.postProcessFrame(frame);

        return frame;
    }

    // Scenes override this with their own frame processing.
    async customFrameStep(frame) {
        return frame;
    }

    postProcessFrame(frame) {
        const elapsedTime = this.getElapsedTime();

        if (elapsedTime <= FADE_DURATION_SECS) {
            frame = this.fadeIn(frame);
        }

        if (SCENE_RUNTIME_SECS - elapsedTime <= FADE_DURATION_SECS) {
            frame = this.fadeOut(frame);
        }

        return frame;
    }

    fadeIn(frame) {
        const alpha = Math.min(1.0, this.getElapsedTime() / FADE_DURATION_SECS);
        const blackFrame = cv.zerosLike(frame);
        return cv.addWeighted(frame, alpha, blackFrame, 1 - alpha);
    }

    fadeOut(frame) {
        const elapsedTime = this.getElapsedTime();
        const alpha = Math.max(
            0.0,
            1.0 - (elapsedTime - (SCENE_RUNTIME_SECS - FADE_DURATION_SECS)) / FADE_DURATION_SECS
        );
        const blackFrame = cv.zerosLike(frame);
        return cv.addWeighted(frame, alpha, blackFrame, 1 - alpha);
    }

    getElapsedTime() {
        const currentTime = this.resources.clock.time();
        if (this.startTime === null) {
            this.startTime = currentTime;
        }
        return currentTime - this.startTime;
    }

    async endScene() {
        this.startTime = null;
        this.complete = true;
    }
}
