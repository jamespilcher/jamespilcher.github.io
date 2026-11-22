import * as cv from "../../../lib/cv.js";
import * as files from "../../../lib/files.js";
import * as random from "../../../lib/random.js";
import { FaceMesh } from "../../../lib/mediapipe.js";
import { BaseScene } from "../baseScene.js";
import { SCENE_RUNTIME_SECS } from "../../constants.js";
import { createTextFrame } from "../utils.js";

const MAX_NUM_FACES = 1;
const REFINE_LANDMARKS = true;
const MIN_DETECTION_CONFIDENCE = 0.5;
const BLINK_THRESHOLD = 0.17; // Eye aspect ratio (EAR) below which an eye counts as closed
const INTRO_DURATION_SECS = 5;
const BLINK_IMAGE_DISPLAY_DURATION_SECS = 1;
const LAST_SECONDS_TO_SHOW_USER_IMAGES = 10;
const MAX_IMAGES_TO_SAVE = 10;
const LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const BLINK_IMAGES_FOLDER = "dontBlink/blinkImages";

export class SceneDontBlink extends BaseScene {
    constructor(resources) {
        super(resources);

        this.faceMesh = new FaceMesh({
            maxNumFaces: MAX_NUM_FACES,
            refineLandmarks: REFINE_LANDMARKS,
            minDetectionConfidence: MIN_DETECTION_CONFIDENCE,
            minTrackingConfidence: 0.5,
        });
    }

    async startScene() {
        await super.startScene();

        this.blinkCounter = 0;

        this.blinkImageFrame = null; // Frame shown when a blink is detected
        this.blinkShowing = false;
        this.blinkStartTime = null;

        this.blinkImages = files.listdir(BLINK_IMAGES_FOLDER);
        random.shuffle(this.blinkImages);
        this.blinkImageIndex = 0;

        this.eyesClosed = false;

        this.userBlinkImages = [];
    }

    async customFrameStep(frame) {
        if (!this.complete) {
            const elapsedTime = this.getElapsedTime();

            if (elapsedTime <= INTRO_DURATION_SECS) {
                return createTextFrame({ text: "Don't blink." });
            }

            if (this.blinkShowing) {
                if (this.resources.clock.time() - this.blinkStartTime < BLINK_IMAGE_DISPLAY_DURATION_SECS) {
                    return this.blinkImageFrame;
                } else {
                    this.blinkShowing = false;
                }
            }

            const results = await this.faceMesh.process(frame);

            if (results.multiFaceLandmarks) {
                for (const faceLandmarks of results.multiFaceLandmarks) {
                    const landmarks = faceLandmarks.map((lm) => [lm.x * frame.width, lm.y * frame.height]);

                    const leftEAR = this.calculateEAR(landmarks, LEFT_EYE_INDICES);
                    const rightEAR = this.calculateEAR(landmarks, RIGHT_EYE_INDICES);

                    // A blink starts when both eyes close
                    if (leftEAR < BLINK_THRESHOLD && rightEAR < BLINK_THRESHOLD) {
                        if (!this.eyesClosed) {
                            this.eyesClosed = true;
                            await this._handleBlink(frame);
                        }
                    } else {
                        if (this.eyesClosed) {
                            this.eyesClosed = false;
                        }
                    }
                }
            }
        }

        return frame;
    }

    // Eye aspect ratio: the eye's height over its width.
    calculateEAR(landmarks, eyeIndices) {
        const [p1, p2, p3, p4, p5, p6] = eyeIndices.map((i) => landmarks[i]);

        const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

        const vertical1 = distance(p2, p6);
        const vertical2 = distance(p3, p5);

        const horizontal = distance(p1, p4);

        return (vertical1 + vertical2) / (2.0 * horizontal);
    }

    async _handleBlink(frame) {
        this.blinkCounter += 1;

        this.userBlinkImages.push(cv.keep(frame));

        // In the last seconds of the scene the visitor sees their own blinks.
        // They also do when there are no stored blink images to show.
        const elapsedTime = this.getElapsedTime();
        if (
            SCENE_RUNTIME_SECS - elapsedTime <= LAST_SECONDS_TO_SHOW_USER_IMAGES ||
            this.blinkImages.length === 0
        ) {
            const randomUserBlinkImage = random.choice(this.userBlinkImages);
            this.blinkImageFrame = cv.keep(
                cv.resize(randomUserBlinkImage, [frame.width, frame.height]),
                this.blinkImageFrame
            );
        } else {
            await this._showRandomBlinkImage(frame);
        }

        this.blinkShowing = true;
        this.blinkStartTime = this.resources.clock.time();
    }

    // Shows the next stored blink image. The order is shuffled once per scene.
    async _showRandomBlinkImage(frame) {
        if (this.blinkImages.length > 0) {
            const imagePath = files.join(BLINK_IMAGES_FOLDER, this.blinkImages[this.blinkImageIndex]);
            const randomImage = await files.imread(imagePath);
            if (randomImage !== null) {
                this.blinkImageFrame = cv.keep(
                    cv.resize(randomImage, [frame.width, frame.height]),
                    this.blinkImageFrame
                );
            }

            this.blinkImageIndex = (this.blinkImageIndex + 1) % this.blinkImages.length;
        }
    }

    // Saves up to MAX_IMAGES_TO_SAVE of the visitor's blink images.
    async endScene() {
        await super.endScene();
        const imagesToSave = random.sample(
            this.userBlinkImages,
            Math.min(this.userBlinkImages.length, MAX_IMAGES_TO_SAVE)
        );

        // The index keeps the names apart when the clock has not moved on between two saves.
        for (const [index, image] of imagesToSave.entries()) {
            const savePath = files.join(BLINK_IMAGES_FOLDER, `${this.resources.clock.time()}_${index}.jpg`);
            await files.imwrite(savePath, image);
        }
    }
}
