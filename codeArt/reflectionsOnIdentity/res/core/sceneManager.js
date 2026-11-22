import * as cv from "../lib/cv.js";
import { DIMENSIONS, FEED_NAME, SCENE_TRANSITION_DURATION_SECS } from "./constants.js";

export class SceneManager {
    constructor(resources, scenes, startAtSceneIndex = 0) {
        this.resources = resources;
        this.currentSceneIndex = startAtSceneIndex;
        this.currentScene = scenes[startAtSceneIndex];
        this.scenes = scenes;

        this.frame = cv.keep(cv.zeros(DIMENSIONS[0], DIMENSIONS[1]));

        this.TRANSITION_FRAME = cv.keep(cv.zeros(DIMENSIONS[0], DIMENSIONS[1]));
        this.transitionActive = false;
        this.transitionStartTime = null;
    }

    async setScene(scene) {
        this.currentScene = scene;
        await this.currentScene.startScene();
    }

    async handleTransition() {
        if (this.resources.clock.time() - this.transitionStartTime >= SCENE_TRANSITION_DURATION_SECS) {
            await this.switchToNextScene();
            this.transitionActive = false;
        }
        this.frame = this.TRANSITION_FRAME;
    }

    async handleCurrentScene() {
        const currentScene = this.scenes[this.currentSceneIndex];

        if (currentScene.complete) {
            this.startTransition();
        } else {
            const camera = this.resources.camera;
            const [ret, frame] = camera.read();
            if (!ret) {
                throw new Error("Error reading from camera");
            }
            this.frame = await this.currentScene.templateFrame(frame);
        }
    }

    startTransition() {
        this.transitionActive = true;
        this.transitionStartTime = this.resources.clock.time();
        this.frame = this.TRANSITION_FRAME;
    }

    async loopHandler() {
        cv.recycleFrames();

        if (this.transitionActive) {
            await this.handleTransition();
        } else {
            await this.handleCurrentScene();
        }

        const frame = cv.resize(this.frame, DIMENSIONS);

        cv.imshow(FEED_NAME, frame);
    }

    async switchToNextScene() {
        const nextIndex = (this.currentSceneIndex + 1) % this.scenes.length;
        this.currentSceneIndex = nextIndex;
        await this.setScene(this.scenes[nextIndex]);
    }
}
