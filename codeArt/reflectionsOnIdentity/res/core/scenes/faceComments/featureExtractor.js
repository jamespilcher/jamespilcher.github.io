import { FEATURES } from "./features.js";

export class FeatureExtractor {
    constructor(faceLandmarks, frame) {
        this.faceLandmarks = faceLandmarks;
        this.frame = frame;
        this.frameHeight = frame.height;
        this.frameWidth = frame.width;
    }

    // The bounding box [xMin, xMax, yMin, yMax] of a feature such as "left_eye", or null.
    extractFeatureRegion(featureName) {
        const featureIndices = FEATURES[featureName]?.points ?? [];
        if (featureIndices.length === 0) {
            return null;
        }

        if (featureIndices.some((i) => this.faceLandmarks[i] === undefined)) {
            return null;
        }

        const xCoords = featureIndices.map((i) => Math.trunc(this.faceLandmarks[i].x * this.frameWidth));
        const yCoords = featureIndices.map((i) => Math.trunc(this.faceLandmarks[i].y * this.frameHeight));

        return this._calculateBoundingBox(xCoords, yCoords);
    }

    _calculateBoundingBox(xCoords, yCoords) {
        let xMin = Math.min(...xCoords);
        let xMax = Math.max(...xCoords);
        let yMin = Math.min(...yCoords);
        let yMax = Math.max(...yCoords);

        // The margin grows with the feature, up to 15 pixels
        const featureSize = Math.max(xMax - xMin, yMax - yMin);
        const margin = Math.min(Math.trunc(featureSize * 0.5), 15);

        xMin = Math.max(0, xMin - margin);
        xMax = Math.min(this.frameWidth, xMax + margin);
        yMin = Math.max(0, yMin - margin);
        yMax = Math.min(this.frameHeight, yMax + margin);

        return [xMin, xMax, yMin, yMax];
    }
}
