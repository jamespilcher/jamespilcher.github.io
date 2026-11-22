import * as cv from "../../../lib/cv.js";
import * as random from "../../../lib/random.js";
import { SCENE_RUNTIME_SECS } from "../../constants.js";
import { BaseScene } from "../baseScene.js";
import { PoemGenerator } from "./poemGenerator.js";
import { createTextFrame } from "../utils.js";

const SHOW_POEM_FOR_SECS = 18;
const INTRO_DURATION_SECS = 3;
const FADE_DURATION_SECS = 3; // The poem's own fade in
const GRACE_PERIOD_SECS = 3; // Time before words start appearing
const WORD_PROBABILITY = 0.1; // Chance of adding a new word in a fixed update
const WORD_LIFETIME_SECS = 2;
const NOT_TRANSCRIPT_TEXT = ["Why didn't you say anything?"];

export class SceneTellMeAboutYourHobbies extends BaseScene {
    constructor(resources) {
        super(resources);
        this.poemGenerator = new PoemGenerator();
    }

    async startScene() {
        await super.startScene();
        this.resources.transcriber.startRecording();
        this.poemText = null;
        this.finalTranscript = null;
        this.poemStartTime = null;
        this.activeWords = [];
    }

    // Removes words that have run out of time and sometimes adds a new one.
    async fixedUpdate() {
        await super.fixedUpdate();

        const currentTime = this.resources.clock.time();

        this.activeWords = this.activeWords.filter((word) => word.expirationTime > currentTime);

        if (random.random() < WORD_PROBABILITY) {
            const transcript = this.resources.transcriber.getTranscript();
            const words = transcript.split(/\s+/).filter(Boolean);
            if (words.length > 0) {
                const newWord = {
                    text: random.choice(words),
                    position: [random.randint(0, 640), random.randint(0, 480)],
                    font: random.choice([cv.FONT_HERSHEY_SIMPLEX, cv.FONT_HERSHEY_COMPLEX]),
                    fontScale: random.uniform(0.3, 0.8),
                    color: [255, 255, 255],
                    expirationTime: currentTime + WORD_LIFETIME_SECS,
                };
                this.activeWords.push(newWord);
            }
        }
    }

    async customFrameStep(frame) {
        const elapsedTime = this.getElapsedTime();

        if (elapsedTime <= INTRO_DURATION_SECS) {
            return createTextFrame({ text: "Speak about your hobbies." });
        }

        if (elapsedTime <= GRACE_PERIOD_SECS) {
            return frame;
        }

        for (const word of this.activeWords) {
            cv.putText(frame, word.text, word.position, word.font, word.fontScale, word.color, 1);
        }

        // The poem is made once and shown for the last part of the scene
        if (elapsedTime >= SCENE_RUNTIME_SECS - SHOW_POEM_FOR_SECS) {
            if (this.finalTranscript === null) {
                this.finalTranscript = this.resources.transcriber.getTranscript();
            }

            if (this.finalTranscript) {
                if (!this.poemText) {
                    this.poemStartTime = this.resources.clock.time();
                    this.poemText = this.poemGenerator.generatePoem(this.finalTranscript);
                }
                return this._fadeInText(frame, this.poemText);
            } else {
                if (!this.poemText) {
                    this.poemStartTime = this.resources.clock.time();
                    this.poemText = random.choice(NOT_TRANSCRIPT_TEXT);
                }
                return createTextFrame({ text: this.poemText });
            }
        }

        return frame;
    }

    _fadeInText(frame, text) {
        const elapsedTime = this.resources.clock.time() - this.poemStartTime;
        const alpha = Math.min(1.0, elapsedTime / FADE_DURATION_SECS);

        const overlay = cv.zerosLike(frame);
        const lines = text.split("\n");
        const numLines = lines.length;

        const frameHeight = overlay.height;
        const frameWidth = overlay.width;

        // The font scale and line spacing fit the lines into 80% of the frame height
        const maxTextHeight = frameHeight * 0.8;
        const lineSpacing = maxTextHeight / numLines;
        const fontScale = lineSpacing / 40;
        const fontThickness = Math.max(1, Math.trunc(fontScale * 2));

        const totalTextHeight = numLines * lineSpacing;
        const startY = Math.floor((frameHeight - totalTextHeight) / 2);

        // Every line starts 10% in from the left edge
        const textX = Math.trunc(frameWidth * 0.1);

        lines.forEach((line, i) => {
            const textSize = cv.getTextSize(line, cv.FONT_HERSHEY_SIMPLEX, fontScale, fontThickness)[0];
            const textY = Math.trunc(startY + i * lineSpacing + textSize[1]);
            cv.putText(overlay, line, [textX, textY], cv.FONT_HERSHEY_SIMPLEX, fontScale, [255, 255, 255], fontThickness);
        });

        return cv.addWeighted(overlay, alpha, frame, 1 - alpha);
    }

    async endScene() {
        await super.endScene();
        this.resources.transcriber.stopRecording();
    }
}
