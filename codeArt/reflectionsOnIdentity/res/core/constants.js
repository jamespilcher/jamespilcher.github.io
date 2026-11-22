import * as cv from "../lib/cv.js";

// Font settings for text rendering
export const DEFAULT_FONT = cv.FONT_HERSHEY_SIMPLEX;
export const DEFAULT_FONT_SCALE = 1;
export const DEFAULT_FONT_THICKNESS = 2;
export const DEFAULT_TEXT_COLOR = [255, 255, 255];

// Scene timing and transitions
export const SCENE_RUNTIME_SECS = 45;
export const SCENE_TRANSITION_DURATION_SECS = 4;
export const FADE_DURATION_SECS = 0.3;
export const FIXED_UPDATE_INTERVAL_SECS = 1 / 20;

// Camera and display settings
export const DIMENSIONS = [640, 480];
export const FEED_NAME = "Reflections on Identity";

// Scale factor for resizing frames before face tracking
export const SCALE_TO_SMALLER_FRAME = 0.3;
