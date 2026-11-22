import * as cv from "../../lib/cv.js";
import {
    DIMENSIONS,
    DEFAULT_FONT,
    DEFAULT_FONT_SCALE,
    DEFAULT_FONT_THICKNESS,
    DEFAULT_TEXT_COLOR,
} from "../constants.js";

// A frame with the text wrapped into lines and centred.
export function createTextFrame({
    text,
    frameSize = DIMENSIONS,
    font = DEFAULT_FONT,
    fontScale = DEFAULT_FONT_SCALE,
    fontThickness = DEFAULT_FONT_THICKNESS,
    textColor = DEFAULT_TEXT_COLOR,
    backgroundColor = [0, 0, 0],
    lineSpacing = 1.5,
}) {
    const frame = cv.full(frameSize[0], frameSize[1], backgroundColor);

    const words = text.split(/\s+/).filter((word) => word !== "");
    const lines = [];
    let currentLine = "";

    const maxWidth = frameSize[0];

    for (const word of words) {
        const testLine = `${currentLine} ${word}`.trim();
        const textSize = cv.getTextSize(testLine, font, fontScale, fontThickness)[0];
        if (textSize[0] <= maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }

    const textHeight = cv.getTextSize("Test", font, fontScale, fontThickness)[0][1];
    const totalTextHeight = Math.trunc(lines.length * textHeight * lineSpacing);

    let yOffset = Math.floor((frameSize[1] - totalTextHeight) / 2);

    for (const line of lines) {
        const textSize = cv.getTextSize(line, font, fontScale, fontThickness)[0];
        const textX = Math.floor((frameSize[0] - textSize[0]) / 2);
        const textY = yOffset + textSize[1];
        cv.putText(frame, line, [textX, textY], font, fontScale, textColor, fontThickness);
        yOffset += Math.trunc(textHeight * lineSpacing);
    }

    return frame;
}
