import * as cv from "../../../lib/cv.js";
import * as keyboard from "../../../lib/keyboard.js";
import { BaseScene } from "../baseScene.js";
import { DIMENSIONS } from "../../constants.js";

export class SceneIntro extends BaseScene {
    async templateFrame(frame) {
        if (!this.complete) {
            const smallFrame = cv.resize(frame, [Math.floor(DIMENSIONS[0] / 4), Math.floor(DIMENSIONS[1] / 4)]);

            const background = cv.zeros(DIMENSIONS[0], DIMENSIONS[1]);

            const xOffset = Math.floor((DIMENSIONS[0] - smallFrame.width) / 2);
            const yOffset = Math.floor((DIMENSIONS[1] - smallFrame.height) / 2);
            cv.paste(background, xOffset, yOffset, smallFrame);
            frame = background;

            const font = cv.FONT_HERSHEY_SIMPLEX;
            const text = "Press SPACE to begin";
            const fontScale = 1;
            const fontColor = [255, 255, 255];
            const thickness = 2;

            const textSize = cv.getTextSize(text, font, fontScale, thickness)[0];
            const textX = Math.floor((DIMENSIONS[0] - textSize[0]) / 2);
            const textY = yOffset + smallFrame.height + textSize[1] + 10;

            cv.putText(frame, text, [textX, textY], font, fontScale, fontColor, thickness);

            if (keyboard.isPressed("space")) {
                await this.endScene();
            }
        }

        return frame;
    }
}
