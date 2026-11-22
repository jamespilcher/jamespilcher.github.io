import * as random from "../../../lib/random.js";
import { FEATURES } from "./features.js";

// Hands out each feature's comments without repeating one until all have been used.
export class CommentBank {
    constructor() {
        this.availableComments = {};
        for (const [feature, data] of Object.entries(FEATURES)) {
            this.availableComments[feature] = [...data.comments];
        }
    }

    reset() {
        this.availableComments = {};
        for (const [feature, data] of Object.entries(FEATURES)) {
            this.availableComments[feature] = [...data.comments];
        }
        for (const feature in this.availableComments) {
            random.shuffle(this.availableComments[feature]);
        }
    }

    getComment(feature) {
        if (!(feature in this.availableComments)) {
            return null;
        }

        if (this.availableComments[feature].length === 0) {
            this.availableComments[feature] = [...FEATURES[feature].comments];
            random.shuffle(this.availableComments[feature]);
        }

        return this.availableComments[feature].pop();
    }

    // The features that still have comments left.
    getAvailableFeatures() {
        return Object.keys(this.availableComments).filter(
            (feature) => this.availableComments[feature].length > 0
        );
    }
}
