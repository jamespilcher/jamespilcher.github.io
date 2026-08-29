import {
  PoseLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

// Pose landmark indices (standard 33-point MediaPipe pose model)
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_ELBOW = 13;
const RIGHT_ELBOW = 14;
const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;

const REST_ANGLE = 0; // wings hanging down (matches the source photo pose)
const RAISED_ANGLE = (165 * Math.PI) / 180; // wings swung up above the handle
const SMOOTHING = 0.15; // exponential smoothing factor per frame
const ARM_MOUNT_TILT = (30 * Math.PI) / 180; // corrects the arm sprites' mounted angle at the body hinges
const ARM_SCALE = 1.2;
const MISSING_LANDMARKS_HOLD_FRAMES = 10; // ride out brief tracking dropouts before decaying to rest

// Sprite rig, all in the 500x500 coordinate space the assets were authored in.
const SPRITE_SIZE = 500;
const ARM_PIVOT = { x: 250, y: 250 }; // local pivot inside each arm sprite
const BODY_HINGES = {
  left: { x: 208, y: 200 },
  right: { x: 296, y: 200 },
};
const SPINE_MAX_LIFT = 50; // px the spine travels upward as wings raise
const CORKSCREW_Y_OFFSET = 30; // px, shifts the whole rig down relative to the background

class CorkscrewSimulator {
  constructor() {
    this.video = document.getElementById("videoElement");
    this.mainCanvas = document.getElementById("corkscrewCanvas");
    this.mainCtx = this.mainCanvas.getContext("2d");
    this.previewCanvas = document.getElementById("webcamPreview");
    this.previewCtx = this.previewCanvas.getContext("2d");

    this.poseLandmarker = null;
    this.isRunning = false;
    this.rafId = null;
    this.lastLandmarks = null;

    this.wingAngle = REST_ANGLE; // current smoothed drive value, in [0,1]
    this.missingLandmarkFrames = 0;

    this.sprites = {};
    this.spritesLoaded = false;
    this.loadSprites().then(() => {
      this.spritesLoaded = true;
      this.drawCorkscrew(this.wingAngle);
    });

    // Nothing else touches the preview canvas until the camera/pose model
    // finish loading and loop() takes over, so draw the loading text once
    // up front rather than leaving the canvas blank during that wait.
    this.previewStatus = "Loading...";
    this.drawPreview(null);

    this.start();
  }

  loadSprites() {
    const files = {
      body: "res/assets/corkscrew_body.png",
      leftArm: "res/assets/corkscrew_left_arm.png",
      rightArm: "res/assets/corkscrew_right_arm.png",
      spine: "res/assets/corkscrew_spine.png",
    };
    const entries = Object.entries(files).map(
      ([key, src]) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            this.sprites[key] = img;
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        })
    );
    return Promise.all(entries);
  }

  async start() {
    this.previewStatus = "Requesting camera";
    this.drawPreview(null);
    try {
      await this.setupCamera();
    } catch (error) {
      console.error("Error accessing webcam:", error);
      this.previewStatus = "Camera access failed";
      this.drawPreview(null);
      return;
    }

    this.previewStatus = "Loading...";
    this.drawPreview(null);
    try {
      await this.setupPoseLandmarker();
    } catch (error) {
      console.error("Error loading pose tracking:", error);
      alert("Could not load pose tracking.");
      return;
    }

    this.isRunning = true;
    this.loop();
  }

  async setupPoseLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  }

  async setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    this.video.srcObject = stream;
    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();
        resolve();
      };
    });
  }

  loop() {
    if (!this.isRunning) return;

    if (this.video.readyState >= 2) {
      const result = this.poseLandmarker.detectForVideo(
        this.video,
        performance.now()
      );
      const detected =
        result.landmarks && result.landmarks.length > 0
          ? result.landmarks[0]
          : null;

      if (detected) {
        this.missingLandmarkFrames = 0;
        this.lastLandmarks = detected;
      } else if (this.missingLandmarkFrames < MISSING_LANDMARKS_HOLD_FRAMES) {
        // Brief tracking dropouts shouldn't snap the pose (or the preview
        // skeleton) back to rest - hold the last good landmarks for a few
        // frames instead of flickering.
        this.missingLandmarkFrames++;
      } else {
        this.lastLandmarks = null;
      }

      this.updateWingAngle(this.lastLandmarks);
    }

    this.drawPreview(this.lastLandmarks);
    this.drawCorkscrew(this.wingAngle);

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  // Per-arm "flap" amount in [0,1]: how far the wrist has risen above the
  // hip, normalized by torso length so it's independent of distance from
  // the camera. Measured from the hip (not the shoulder) so the signal
  // ramps up continuously all the way from arm-at-side through horizontal,
  // instead of sitting dead at 0 until the wrist clears shoulder height.
  armFlap(landmarks, shoulderIdx, wristIdx, hipIdx) {
    const shoulder = landmarks[shoulderIdx];
    const wrist = landmarks[wristIdx];
    const hip = landmarks[hipIdx];
    if (!shoulder || !wrist || !hip) return 0;

    const torsoLength = Math.abs(hip.y - shoulder.y) || 0.0001;
    const raw = (hip.y - wrist.y) / torsoLength; // ~0 at side, ~1 at horizontal, higher above
    const normalized = raw / 1.9; // roughly full arm-raise distance
    return Math.max(0, Math.min(1, normalized));
  }

  updateWingAngle(landmarks) {
    let target = 0;
    if (landmarks) {
      const leftFlap = this.armFlap(
        landmarks,
        LEFT_SHOULDER,
        LEFT_WRIST,
        LEFT_HIP
      );
      const rightFlap = this.armFlap(
        landmarks,
        RIGHT_SHOULDER,
        RIGHT_WRIST,
        RIGHT_HIP
      );
      // Both arms must be raised together - a single raised arm does nothing.
      target = Math.min(leftFlap, rightFlap);
    }
    this.wingAngle += (target - this.wingAngle) * SMOOTHING;
  }

  drawPreview(landmarks) {
    const ctx = this.previewCtx;
    const w = this.previewCanvas.width;
    const h = this.previewCanvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    if (this.isRunning && this.video.videoWidth) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.video, 0, 0, w, h);
    } else {
      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.previewStatus, w / 2, h / 2);
    }
    ctx.restore();

    if (!landmarks) return;

    const toX = (nx) => w - nx * w; // mirrored
    const toY = (ny) => ny * h;

    const bones = [
      [LEFT_SHOULDER, LEFT_ELBOW],
      [LEFT_ELBOW, LEFT_WRIST],
      [RIGHT_SHOULDER, RIGHT_ELBOW],
      [RIGHT_ELBOW, RIGHT_WRIST],
      [LEFT_SHOULDER, RIGHT_SHOULDER],
    ];

    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    bones.forEach(([a, b]) => {
      const pa = landmarks[a];
      const pb = landmarks[b];
      if (!pa || !pb) return;
      ctx.beginPath();
      ctx.moveTo(toX(pa.x), toY(pa.y));
      ctx.lineTo(toX(pb.x), toY(pb.y));
      ctx.stroke();
    });

    ctx.fillStyle = "#ff3366";
    [LEFT_SHOULDER, RIGHT_SHOULDER, LEFT_ELBOW, RIGHT_ELBOW, LEFT_WRIST, RIGHT_WRIST].forEach(
      (idx) => {
        const p = landmarks[idx];
        if (!p) return;
        ctx.beginPath();
        ctx.arc(toX(p.x), toY(p.y), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    );
  }

  drawCorkscrew(wingAngleAmount) {
    const ctx = this.mainCtx;
    const W = this.mainCanvas.width;
    const H = this.mainCanvas.height;

    ctx.clearRect(0, 0, W, H);
    if (!this.spritesLoaded) return;

    // Arm sprites are authored in the wings-up pose at zero rotation; wings
    // up corresponds to wingAngleAmount = 1 (arms raised), so the swing away
    // from that pose grows as wingAngleAmount drops toward 0 (arms down).
    const swing = (1 - wingAngleAmount) * (RAISED_ANGLE - REST_ANGLE);
    // wingAngleAmount 1 (wings up) = screw driven all the way down (no lift).
    // wingAngleAmount 0 (wings down) = spine pulled up by its full travel.
    const spineLift = (1 - wingAngleAmount) * SPINE_MAX_LIFT;

    const scale = W / SPRITE_SIZE;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(0, ((H / scale) - SPRITE_SIZE) / 2 + CORKSCREW_Y_OFFSET / scale);

    ctx.drawImage(this.sprites.spine, 0, -spineLift, SPRITE_SIZE, SPRITE_SIZE);
    this.drawArm(ctx, this.sprites.rightArm, BODY_HINGES.right, swing - ARM_MOUNT_TILT);
    this.drawArm(ctx, this.sprites.leftArm, BODY_HINGES.left, -swing + ARM_MOUNT_TILT);
    ctx.drawImage(this.sprites.body, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
    // rightArm/leftArm are viewer's-left/right (screen-left = BODY_HINGES.left),
    // not the corkscrew's own anatomical left/right.

    ctx.restore();
  }

  drawArm(ctx, img, hinge, angle) {
    ctx.save();
    ctx.translate(hinge.x, hinge.y);
    ctx.rotate(angle);
    const size = SPRITE_SIZE * ARM_SCALE;
    ctx.drawImage(img, -ARM_PIVOT.x * ARM_SCALE, -ARM_PIVOT.y * ARM_SCALE, size, size);
    ctx.restore();
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.video && this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  }
}

let simulator;
document.addEventListener("DOMContentLoaded", () => {
  simulator = new CorkscrewSimulator();
});

window.addEventListener("beforeunload", () => {
  if (simulator) simulator.stop();
});
