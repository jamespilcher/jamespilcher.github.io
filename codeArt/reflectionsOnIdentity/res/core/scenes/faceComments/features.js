// Face mesh landmark indexes for each feature, and the comments made about it.
export const FEATURES = {
    face_outline: {
        points: [
            10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
            397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
            172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
        ],
        comments: [
            "Tension beneath your skin.",
            "You look easy to draw.",
            "You look like a painting.",
            "What's wrong?",
            "Are you okay?",
        ],
    },
    brow: {
        points: [70, 65, 105, 66, 107, 336, 296, 334, 283, 300, 8, 9],
        comments: [
            "You should take better care of these",
            "What were you thinking?",
            "Anger.",
            "Sadness.",
            "Surprise.",
            "Confusion.",
        ],
    },
    left_eye: {
        points: [
            33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158,
            159, 160, 161, 246,
        ],
        comments: [
            "This eye is kind.",
            "More expressive than the other one.",
            "Seems tired.",
            "What did you last see?",
        ],
    },
    right_eye: {
        points: [
            263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385,
            386, 387, 388, 466,
        ],
        comments: [
            "Twinkleless and dull.",
            "Does this one blink first?",
            "You watch closely.",
        ],
    },
    nostrils: {
        points: [97, 239, 2, 326, 327],
        comments: [
            "Have they flared recently?",
            "Don't sneeze at me, please.",
            "People can hear you breathe.",
            "Don't turn your nose up.",
        ],
    },
    mouth: {
        points: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
        comments: [
            "You're too loud.",
            "You're too quiet.",
            "Do lies come from here?",
            "Is there something unsaid?",
            "Stop talking.",
            "You look like you're about to say something.",
        ],
    },
    chin: {
        points: [152, 199, 176, 400],
        comments: [
            "Chin up.",
            "There are hairs on your chinny chin chin.",
        ],
    },
};
