import * as cv from "../../../lib/cv.js";
import { BaseScene } from "../baseScene.js";
import { DIMENSIONS } from "../../constants.js";

const OUTRO_SCENE_DURATION_SECS = 8;

export class SceneOutro extends BaseScene {
    // Shows "The End" straight away and "(Please Leave)" after half the scene time.
    async templateFrame(frame) {
        const blackFrame = cv.zeros(DIMENSIONS[0], DIMENSIONS[1]);

        if (!this.complete) {
            const elapsedTime = this.getElapsedTime();

            const font = cv.FONT_HERSHEY_SIMPLEX;
            const fontScale = 1;
            const fontThickness = 2;
            const textColor = [255, 255, 255];

            const text1 = "The End";
            const text1Size = cv.getTextSize(text1, font, fontScale, fontThickness)[0];
            const text1X = Math.floor((DIMENSIONS[0] - text1Size[0]) / 2);
            const text1Y = Math.floor(DIMENSIONS[1] / 2) - 20;
            cv.putText(blackFrame, text1, [text1X, text1Y], font, fontScale, textColor, fontThickness);

            if (elapsedTime >= OUTRO_SCENE_DURATION_SECS / 2) {
                const text2 = "(Please Leave)";
                const text2Size = cv.getTextSize(text2, font, fontScale * 0.7, fontThickness)[0];
                const text2X = Math.floor((DIMENSIONS[0] - text2Size[0]) / 2);
                const text2Y = Math.floor(DIMENSIONS[1] / 2) + 40;
                cv.putText(blackFrame, text2, [text2X, text2Y], font, fontScale * 0.7, textColor, fontThickness);
            }

            if (elapsedTime >= OUTRO_SCENE_DURATION_SECS) {
                await this.endScene();
            }
        }

        return blackFrame;
    }
}
