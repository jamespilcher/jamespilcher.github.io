import * as cv from "../../../lib/cv.js";
import * as files from "../../../lib/files.js";
import * as random from "../../../lib/random.js";
import { Hands } from "../../../lib/mediapipe.js";
import { BaseScene } from "../baseScene.js";
import { DIMENSIONS } from "../../constants.js";
import { createTextFrame } from "../utils.js";

const COLLECTION_FOLDER = "showMeANumber/numberPhotos";
const COUNTDOWN_SECS = 15;
const INTRO_SECS = 5;
const SHOW_ME_A_NUMBER_TEXT = "Show me a number between 1-5 on your hand";
const GRID_ROWS = 4;
const GRID_COLS = 5;
const GRID_CELL_SIZE = [Math.floor(DIMENSIONS[0] / GRID_COLS), Math.floor(DIMENSIONS[1] / GRID_ROWS)];
const FONT = cv.FONT_HERSHEY_SIMPLEX;

export class SceneShowMeANumber extends BaseScene {
    constructor(resources) {
        super(resources);
        this.hands = new Hands({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        this.photoCache = new Map(); // Photo file name to image
    }

    async startScene() {
        await super.startScene();
        this.userNumber = 0;
        this.currentFrame = null;
        this.inCollection = false;
        this.photos = null;
        this.gridState = [];
        this.userPhoto = null;
        this.usedPhotos = new Set();
    }

    // Counts the fingers in the current frame.
    async fixedUpdate() {
        if (this.currentFrame === null) {
            return;
        }
        const results = await this.hands.process(this.currentFrame);
        this.userNumber = this._detectNumber(results);
    }

    async customFrameStep(frame) {
        const elapsedTime = this.getElapsedTime();
        if (elapsedTime <= INTRO_SECS) {
            return createTextFrame({ text: "Show me a number between 1-5 on your hand" });
        }

        if (elapsedTime <= INTRO_SECS + COUNTDOWN_SECS) {
            const countdownTime = Math.max(0, COUNTDOWN_SECS - Math.trunc(elapsedTime - INTRO_SECS));
            this._displayWebcamFeed(frame, countdownTime);
            // Kept after the text is drawn, so the hand tracking sees the frame as it is shown.
            // The last frame of the countdown stays the current frame for the rest of the scene.
            this.currentFrame = cv.keep(frame, this.currentFrame);
            return frame;
        }

        if (!this.inCollection) {
            this._addToCollection(this.userNumber, frame);
        }

        return this._displayCollection(this.userNumber);
    }

    async _getCachedPhoto(numberFolder, photoPath) {
        if (!this.photoCache.has(photoPath)) {
            const photoFullPath = files.join(numberFolder, photoPath);
            const photo = await files.imread(photoFullPath);
            if (photo !== null) {
                this.photoCache.set(photoPath, photo);
            }
        }
        return this.photoCache.get(photoPath) ?? null;
    }

    _detectNumber(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handedness = results.multiHandedness[0].label;
            const handLandmarks = results.multiHandLandmarks[0];
            return this.countFingers(handLandmarks, this.currentFrame, handedness);
        }
        return 0;
    }

    _addToCollection(number, frame) {
        this.userPhoto = cv.keep(frame);
        this.userNumber = number;
        this.inCollection = true;
    }

    _initializeGridState() {
        this.gridState = [];
        for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
            const photo = this._getNewPhoto();
            this.gridState.push({
                photo: photo,
                endTime: this.resources.clock.time() + random.uniform(0.5, 1.5),
            });
        }
    }

    // A photo that is not on the grid at the moment. The visitor's photo comes first.
    _getNewPhoto() {
        if (!this.usedPhotos.has("user_photo")) {
            this.usedPhotos.add("user_photo");
            return "user_photo";
        }
        const availablePhotos = this.photos.filter((p) => !this.usedPhotos.has(p));
        if (availablePhotos.length > 0) {
            const newPhoto = random.choice(availablePhotos);
            this.usedPhotos.add(newPhoto);
            return newPhoto;
        }

        return null;
    }

    async _renderGrid() {
        const photoGridFrame = cv.zeros(DIMENSIONS[0], DIMENSIONS[1]);

        for (const [idx, cell] of this.gridState.entries()) {
            const row = Math.floor(idx / GRID_COLS);
            const col = idx % GRID_COLS;
            const x = col * GRID_CELL_SIZE[0];
            const y = row * GRID_CELL_SIZE[1];

            if (cell.photo !== null) {
                let photo;
                if (cell.photo === "user_photo") {
                    photo = this._cropToAspectRatio(this.userPhoto, GRID_CELL_SIZE);
                } else {
                    photo = await this._getCachedPhoto(
                        files.join(COLLECTION_FOLDER, String(this.userNumber)),
                        cell.photo
                    );
                    if (photo === null) {
                        continue;
                    }
                    photo = this._cropToAspectRatio(photo, GRID_CELL_SIZE);
                }

                cv.paste(photoGridFrame, x, y, photo);
            }
        }

        return photoGridFrame;
    }

    _cropToAspectRatio(image, targetSize) {
        const [targetWidth, targetHeight] = targetSize;
        const imgHeight = image.height;
        const imgWidth = image.width;

        const targetAspect = targetWidth / targetHeight;
        const imgAspect = imgWidth / imgHeight;

        let croppedImage;
        if (imgAspect > targetAspect) {
            const newWidth = Math.trunc(targetAspect * imgHeight);
            const offset = Math.floor((imgWidth - newWidth) / 2);
            croppedImage = cv.slice(image, 0, imgHeight, offset, offset + newWidth);
        } else {
            const newHeight = Math.trunc(imgWidth / targetAspect);
            const offset = Math.floor((imgHeight - newHeight) / 2);
            croppedImage = cv.slice(image, offset, offset + newHeight, 0, imgWidth);
        }

        return cv.resize(croppedImage, targetSize);
    }

    // The grid of photos for the number. Each cell swaps to a new photo when its time is up.
    async _displayCollection(number) {
        const numberFolder = files.join(COLLECTION_FOLDER, String(number));
        if (this.photos === null) {
            this.photos = files.listdir(numberFolder);
        }

        if (this.gridState.length === 0) {
            this._initializeGridState();
        }

        const currentTime = this.resources.clock.time();

        for (const cell of this.gridState) {
            if (currentTime >= cell.endTime) {
                const newPhoto = this._getNewPhoto();
                if (cell.photo !== null) {
                    this.usedPhotos.delete(cell.photo);
                }
                cell.photo = newPhoto;
                cell.endTime = currentTime + random.uniform(0.5, 1.5);
            }
        }

        return this._renderGrid();
    }

    _displayWebcamFeed(frame, countdownTime) {
        this._addTextToFrame(frame, SHOW_ME_A_NUMBER_TEXT, [10, frame.height - 20], 0.5);
        this._addTextToFrame(frame, `Timer: ${countdownTime}s`, [frame.width - 150, 50], 1);
        this._addTextToFrame(
            frame,
            `${this.userNumber}`,
            [Math.floor(frame.width / 2), Math.floor(frame.height / 2)],
            3,
            [0, 255, 0]
        );
        return frame;
    }

    _addTextToFrame(frame, text, position, fontScale, color = [255, 255, 255]) {
        cv.putText(frame, text, position, FONT, fontScale, color, 2);
    }

    // Saves the visitor's photo to the collection for their number.
    async endScene() {
        await super.endScene();
        if (this.userPhoto !== null) {
            const numberFolder = files.join(COLLECTION_FOLDER, String(this.userNumber));
            const filename = files.join(numberFolder, `${this.resources.clock.time()}.jpg`);
            await files.imwrite(filename, this.userPhoto);
            this.userPhoto = null;
        }
    }

    countFingers(handLandmarks, frameShape, handedness) {
        // MediaPipe landmark indexes for the fingertips and the joints below them
        const fingertips = [4, 8, 12, 16, 20];
        const basePoints = [3, 6, 10, 14, 18];

        const landmarks = handLandmarks;
        const { height, width } = frameShape;

        const normalizedLandmarks = landmarks.map((lm) => [lm.x * width, lm.y * height]);

        // Which way the palm faces, from the handedness and the knuckle positions
        const pinkyMcpX = landmarks[17].x;
        const indexMcpX = landmarks[5].x;

        let palmFacingCamera;
        if (handedness === "Left") {
            palmFacingCamera = pinkyMcpX < indexMcpX;
        } else {
            palmFacingCamera = pinkyMcpX > indexMcpX;
        }

        // Rotate the landmarks to make the hand vertical
        const wrist = normalizedLandmarks[0];
        const middleFingerMcp = normalizedLandmarks[9];
        const angle = Math.atan2(middleFingerMcp[1] - wrist[1], middleFingerMcp[0] - wrist[0]) + Math.PI / 2;

        function rotatePoint(point, center, angle) {
            const [x, y] = point;
            const [cx, cy] = center;
            const cosTheta = Math.cos(-angle);
            const sinTheta = Math.sin(-angle);
            const xNew = cosTheta * (x - cx) - sinTheta * (y - cy) + cx;
            const yNew = sinTheta * (x - cx) + cosTheta * (y - cy) + cy;
            return [xNew, yNew];
        }

        this.rotatedLandmarks = normalizedLandmarks.map((point) => rotatePoint(point, wrist, angle));

        let fingerCount = 0;

        // The thumb is raised if its tip is outside the index knuckle
        const thumbTip = landmarks[4];
        const indexMcp = landmarks[5];

        let thumbRaised;
        if (palmFacingCamera) {
            if (handedness === "Left") {
                thumbRaised = thumbTip.x > indexMcp.x;
            } else {
                thumbRaised = thumbTip.x < indexMcp.x;
            }
        } else {
            if (handedness === "Left") {
                thumbRaised = thumbTip.x < indexMcp.x;
            } else {
                thumbRaised = thumbTip.x > indexMcp.x;
            }
        }

        if (thumbRaised) {
            fingerCount += 1;
        }

        // The other four fingers are raised if the tip is above the joint below it
        for (let i = 1; i < fingertips.length; i++) {
            const tipY = this.rotatedLandmarks[fingertips[i]][1];
            const baseY = this.rotatedLandmarks[basePoints[i]][1];

            if (tipY < baseY) {
                fingerCount += 1;
            }
        }

        return fingerCount;
    }
}
