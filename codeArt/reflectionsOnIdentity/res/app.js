import * as cv from "./lib/cv.js";
import * as keyboard from "./lib/keyboard.js";
import * as mediapipe from "./lib/mediapipe.js";
import { VideoCapture } from "./lib/videoCapture.js";

import { SceneDontBlink } from "./core/scenes/dontBlink/sceneDontBlink.js";
import { SceneOutro } from "./core/scenes/outro/sceneOutro.js";
import { SceneShowMeANumber } from "./core/scenes/showMeANumber/sceneShowMeANumber.js";
import { SceneIntro } from "./core/scenes/intro/sceneIntro.js";
import { SceneManager } from "./core/sceneManager.js";
import { SceneFaceComments } from "./core/scenes/faceComments/sceneFaceComments.js";
import { SceneTellMeAboutYourHobbies } from "./core/scenes/tellMeAboutYourHobbies/sceneTellMeAboutYourHobbies.js";
import { createTextFrame } from "./core/scenes/utils.js";

import { SystemClock } from "./resources/systemClock.js";
import { Transcriber } from "./resources/transcriber.js";

import { DIMENSIONS, FEED_NAME } from "./core/constants.js";

const feed = document.getElementById("feed");

function showMessage(text) {
    cv.recycleFrames();
    cv.imshow(FEED_NAME, createTextFrame({ text: text }));
}

function initializeResources(camera, clock, transcriber) {
    if (!camera.isOpened()) {
        showMessage("Could not access the camera.");
        throw new Error("Error: Could not access the camera.");
    }

    keyboard.pressElementAsKey(feed, "space");

    // Browsers only go fullscreen from a key press, so F switches it on and off.
    window.addEventListener("keydown", (event) => {
        if ((event.key ?? "").toLowerCase() !== "f") {
            return;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (feed.requestFullscreen) {
            feed.requestFullscreen();
        }
    });

    return { camera: camera, clock: clock, transcriber: transcriber };
}

// Releases the camera and stops the transcriber.
function cleanup(resources) {
    if ("camera" in resources && resources.camera.isOpened()) {
        resources.camera.release();
    }

    Transcriber.stopAllRecordings();

    cv.destroyAllWindows();
}

function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function runApp(resources) {
    const sceneIntro = new SceneIntro(resources);
    const sceneFaceComments = new SceneFaceComments(resources);
    const sceneTellMeAboutYourHobbies = new SceneTellMeAboutYourHobbies(resources);

    const sceneShowMeANumber = new SceneShowMeANumber(resources);
    const sceneDontBlink = new SceneDontBlink(resources);
    const sceneOutro = new SceneOutro(resources);

    const scenes = [
        sceneIntro,
        sceneTellMeAboutYourHobbies,
        sceneShowMeANumber,
        sceneFaceComments,
        sceneDontBlink,
        sceneOutro,
    ];

    const sceneManager = new SceneManager(resources, scenes);

    try {
        await mediapipe.loadModels();
        await sceneManager.currentScene.startScene();
        while (true) {
            await sceneManager.loopHandler();
            await nextAnimationFrame();
            if (keyboard.isPressed("q")) {
                break;
            }
        }
    } finally {
        cleanup(resources);
    }
}

async function main() {
    cv.namedWindow(FEED_NAME, feed);
    showMessage("Loading");

    const camera = new VideoCapture();
    await camera.open(DIMENSIONS[0], DIMENSIONS[1]);
    const clock = new SystemClock(1.0);
    const transcriber = new Transcriber();
    const resources = initializeResources(camera, clock, transcriber);

    await runApp(resources);
}

main();
