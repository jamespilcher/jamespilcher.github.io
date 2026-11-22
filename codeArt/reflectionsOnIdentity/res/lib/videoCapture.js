import * as cv from "./cv.js";

// The webcam, with the parts of cv2.VideoCapture the app uses.
export class VideoCapture {
    constructor() {
        this.video = document.createElement("video");
        this.video.playsInline = true;
        this.video.muted = true;
        this.stream = null;
        this.width = 0;
        this.height = 0;
    }

    // Frames from read() are width by height whatever size the webcam gives.
    // If the webcam cannot be used the capture stays closed, as cv2.VideoCapture does.
    async open(width, height) {
        this.width = width;
        this.height = height;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: width }, height: { ideal: height } },
            });
            this.video.srcObject = this.stream;
            await this.video.play();
        } catch (error) {
            this.release();
        }
    }

    isOpened() {
        return this.stream !== null && this.stream.active;
    }

    // Returns [ret, frame]. The video is scaled to fill the frame and cropped at the edges.
    read() {
        const video = this.video;
        if (!this.isOpened() || video.videoWidth === 0) {
            return [false, null];
        }
        const scale = Math.max(this.width / video.videoWidth, this.height / video.videoHeight);
        const sourceWidth = this.width / scale;
        const sourceHeight = this.height / scale;
        const left = Math.floor((video.videoWidth - sourceWidth) / 2);
        const top = Math.floor((video.videoHeight - sourceHeight) / 2);
        const source = cv.slice(video, top, top + sourceHeight, left, left + sourceWidth);
        return [true, cv.resize(source, [this.width, this.height])];
    }

    release() {
        if (this.stream !== null) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
        }
    }
}
