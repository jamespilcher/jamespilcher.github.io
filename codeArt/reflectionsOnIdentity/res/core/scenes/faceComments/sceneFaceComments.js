import * as cv from "../../../lib/cv.js";
import * as random from "../../../lib/random.js";
import { FaceMesh } from "../../../lib/mediapipe.js";
import { BaseScene } from "../baseScene.js";
import { SCALE_TO_SMALLER_FRAME } from "../../constants.js";
import { CommentBank } from "./commentBank.js";
import { FeatureExtractor } from "./featureExtractor.js";

const FRAME_WIDTH = 640;
const FRAME_HEIGHT = 480;
const GRID_SIZE = 60; // Spacing of the positions a feature can be placed at
const MASKED_DURATION_MIN = 7;
const MASKED_DURATION_MAX = 9;
const UNMASKED_DURATION = 2;
const TEXT_FONT = cv.FONT_HERSHEY_SIMPLEX;
const TEXT_SCALE = 0.5;
const TEXT_THICKNESS = 1;
const TEXT_COLOR = [255, 255, 255];
const TEXT_MARGIN = 10;
const MAX_COMMENT_ATTEMPTS = 10;
const NUM_FEATURES_MIN = 3;
const NUM_FEATURES_MAX = 5;

export class SceneFaceComments extends BaseScene {
    constructor(resources) {
        super(resources);
        this.faceMesh = new FaceMesh({
            maxNumFaces: 1,
            refineLandmarks: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        this.commentBank = new CommentBank();
        this.featurePositions = []; // The selected features and where they are placed
    }

    async startScene() {
        await super.startScene();
        this.validPositions = [];
        for (let x = GRID_SIZE; x < FRAME_WIDTH - GRID_SIZE; x += GRID_SIZE) {
            for (let y = GRID_SIZE; y < FRAME_HEIGHT - GRID_SIZE; y += GRID_SIZE) {
                this.validPositions.push([x, y]);
            }
        }
        this.lastSwitchTime = this.resources.clock.time();
        this.isMasked = false;
        this.maskedDuration = random.uniform(MASKED_DURATION_MIN, MASKED_DURATION_MAX);
        this.unmaskedDuration = UNMASKED_DURATION;
        this.commentBank.reset();
    }

    // Switches between the masked and unmasked states.
    async fixedUpdate() {
        const currentTime = this.resources.clock.time();
        const duration = this.isMasked ? this.maskedDuration : this.unmaskedDuration;

        if (currentTime - this.lastSwitchTime > duration) {
            this.isMasked = !this.isMasked;
            this.lastSwitchTime = currentTime;

            if (this.isMasked) {
                this.unmaskedDuration = UNMASKED_DURATION;
                this._selectFeatures();
            } else {
                this.maskedDuration = random.uniform(MASKED_DURATION_MIN, MASKED_DURATION_MAX);
            }
        }
    }

    // Picks a random set of features and gives each a comment and a position.
    _selectFeatures() {
        let availableFeatures = this.commentBank.getAvailableFeatures();

        if (availableFeatures.length < NUM_FEATURES_MIN) {
            this.commentBank.reset();
            availableFeatures = this.commentBank.getAvailableFeatures();
        }

        const numFeatures = Math.min(
            random.randint(NUM_FEATURES_MIN, NUM_FEATURES_MAX),
            availableFeatures.length
        );
        const selectedFeatures = random.sample(availableFeatures, numFeatures);

        random.shuffle(this.validPositions);

        this.featurePositions = [];
        const usedPositions = new Set();

        for (const feature of selectedFeatures) {
            const comment = this.commentBank.getComment(feature);
            if (!comment) {
                continue;
            }

            for (const pos of this.validPositions) {
                if (!usedPositions.has(pos)) {
                    usedPositions.add(pos);
                    this.featurePositions.push({
                        feature: feature,
                        x: pos[0],
                        y: pos[1],
                        comment: comment,
                    });
                    break;
                }
            }
        }
    }

    async customFrameStep(frame) {
        if (!this.isMasked) {
            return frame;
        }

        const mask = cv.zerosLike(frame);
        const smallFrame = cv.resize(frame, [0, 0], SCALE_TO_SMALLER_FRAME, SCALE_TO_SMALLER_FRAME);
        const results = await this.faceMesh.process(smallFrame);

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            cv.putText(
                frame,
                "Don't hide",
                [Math.trunc(FRAME_WIDTH / 2), Math.trunc(FRAME_HEIGHT / 2)],
                TEXT_FONT,
                TEXT_SCALE * 2,
                TEXT_COLOR,
                TEXT_THICKNESS * 2
            );
            return frame;
        }

        const faceLandmarks = results.multiFaceLandmarks[0];
        const extractor = new FeatureExtractor(faceLandmarks, frame);

        // First pass: cut out each feature and place it on the mask
        for (const position of this.featurePositions) {
            const featureName = position.feature;
            const regionBounds = extractor.extractFeatureRegion(featureName);

            if (regionBounds) {
                const [xMin, xMax, yMin, yMax] = regionBounds;
                const featureRegion = cv.slice(frame, yMin, yMax, xMin, xMax);
                Object.assign(position, this._placeFeature(featureRegion, position.x, position.y, mask));
            }
        }

        // Second pass: add the comment below each feature
        const placedTextBoxes = [];
        for (const position of this.featurePositions) {
            if (!("startX" in position)) {
                continue;
            }

            const textBox = this._placeComment(
                position.comment,
                position.startX,
                position.endY + TEXT_MARGIN,
                mask,
                placedTextBoxes
            );

            if (textBox) {
                placedTextBoxes.push(textBox);
            }
        }

        return mask;
    }

    // Draws the feature on the mask and returns where it went, or {} if it does not fit.
    _placeFeature(featureRegion, x, y, mask) {
        const height = featureRegion.height;
        const width = featureRegion.width;

        const startX = Math.max(0, x);
        const startY = Math.max(0, y);
        const endX = Math.min(startX + width, mask.width);
        const endY = Math.min(startY + height, mask.height);

        const adjustedWidth = endX - startX;
        const adjustedHeight = endY - startY;

        if (adjustedWidth <= 0 || adjustedHeight <= 0) {
            return {};
        }

        const adjustedFeature = cv.slice(featureRegion, 0, adjustedHeight, 0, adjustedWidth);

        cv.paste(mask, startX, startY, adjustedFeature);

        return { startX: startX, endX: endX, startY: startY, endY: endY };
    }

    // Draws the comment, moving it down until it is clear of the other comments.
    // Returns its box as [left, top, right, bottom].
    _placeComment(comment, x, y, mask, placedTextBoxes, maxAttempts = null) {
        if (maxAttempts === null) {
            maxAttempts = MAX_COMMENT_ATTEMPTS;
        }

        const [textWidth, textHeight] = cv.getTextSize(comment, TEXT_FONT, TEXT_SCALE, TEXT_THICKNESS)[0];

        let textX = x;
        let textY = y;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const textBox = [textX, textY - textHeight, textX + textWidth, textY];

            if (!placedTextBoxes.some((box) => this._boxesOverlap(textBox, box))) {
                if (textX + textWidth > mask.width) {
                    textX = mask.width - textWidth - TEXT_MARGIN;
                }
                if (textX < 0) {
                    textX = TEXT_MARGIN;
                }
                if (textY + textHeight > mask.height) {
                    textY = y - TEXT_MARGIN;
                }

                cv.putText(mask, comment, [textX, textY], TEXT_FONT, TEXT_SCALE, TEXT_COLOR, TEXT_THICKNESS);
                return textBox;
            }

            textY += TEXT_MARGIN;
        }

        cv.putText(mask, comment, [textX, textY], TEXT_FONT, TEXT_SCALE, TEXT_COLOR, TEXT_THICKNESS);

        return [textX, textY - textHeight, textX + textWidth, textY];
    }

    _boxesOverlap(box1, box2) {
        return !(
            box1[2] <= box2[0] || // box1 right <= box2 left
            box1[0] >= box2[2] || // box1 left >= box2 right
            box1[3] <= box2[1] || // box1 bottom <= box2 top
            box1[1] >= box2[3] // box1 top >= box2 bottom
        );
    }
}
