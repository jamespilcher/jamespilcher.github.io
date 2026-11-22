import * as random from "../../../lib/random.js";

const DETERMINERS = ["a", "an", "the"];
const PREPOSITIONS = ["about", "above", "across", "after", "against", "along", "with", "without", "to"];
const CONJUNCTIONS = [
    "and",
    "but",
    "or",
    "so",
    "for",
    "nor",
    "yet",
    "after",
    "although",
    "as",
    "because",
    "before",
    "even",
    "if",
    "once",
    "since",
    "though",
    "unless",
    "until",
    "when",
    "where",
    "while",
];
const OTHER_WORDS = ["i", "like", "as", "don't", "that's", "doesn't", "does"];
const LINE_END_BLOCKLIST = new Set([...DETERMINERS, ...PREPOSITIONS, ...CONJUNCTIONS, ...OTHER_WORDS]);
const COMPUTER_LINES = [
    "this feels unfamiliar",
    "heard before",
    "we don't understand",
    "we hear this often",
    "we understand",
    "we comfort",
    "this is familiar",
    "we miss",
    "we remember",
    "we don't remember",
    "we lose",
    "we find",
    "we don't find",
    "we thought",
    "we don't think",
];
const SPECIAL_CHARACTERS = ["—", "!", "..."];

export class PoemGenerator {
    constructor() {
        this.usedLines = new Set();
    }

    // A line is valid if it is new and does not end on a blocklisted word.
    isValidLine(line) {
        const lastWord = line.split(/\s+/).filter(Boolean).at(-1).toLowerCase();
        return !LINE_END_BLOCKLIST.has(lastWord) && !this.usedLines.has(line);
    }

    // A run of 2 to 5 words from the input. Tries 10 times for a valid line.
    generateRandomLine() {
        let line;
        for (let attempt = 0; attempt < 10; attempt++) {
            const startIndex = random.randint(0, this.words.length - 2);
            const numWords = random.randint(2, 5);
            const endIndex = Math.min(startIndex + numWords, this.words.length);
            line = this.words.slice(startIndex, endIndex).join(" ");
            if (this.isValidLine(line) && !this.usedLines.has(line)) {
                this.usedLines.add(line);
                return line;
            }
        }
        // After 10 tries, return the last generated line even if it's invalid
        this.usedLines.add(line);
        return line;
    }

    // Indexes of the lines with text in them, leaving out the first and last line.
    _middleLineIndexes(poemLines) {
        const nonEmptyLines = [];
        poemLines.forEach((line, i) => {
            if (line.trim()) {
                nonEmptyLines.push(i);
            }
        });
        return nonEmptyLines.filter((i) => i > 0 && i < poemLines.length - 1);
    }

    insertSpecialCharacter(poemLines) {
        const validLines = this._middleLineIndexes(poemLines);
        if (validLines.length > 0) {
            const randomLineIndex = random.choice(validLines);
            if (poemLines[randomLineIndex].endsWith(".")) {
                poemLines[randomLineIndex] =
                    poemLines[randomLineIndex].slice(0, -1) + random.choice(SPECIAL_CHARACTERS);
            } else {
                poemLines[randomLineIndex] += random.choice(SPECIAL_CHARACTERS);
            }
        }
    }

    capitalizeRandomLine(poemLines) {
        const validLines = this._middleLineIndexes(poemLines);
        if (validLines.length > 0) {
            const randomLineIndex = random.choice(validLines);
            poemLines[randomLineIndex] = poemLines[randomLineIndex].toUpperCase();
        }
    }

    generateVerse(startingSentence, computerLine = null, isFirstTwoVerses = false) {
        const verse = [];

        if (isFirstTwoVerses) {
            verse.push(startingSentence);
        }

        const numLines = random.randint(2, 3);
        for (let i = 0; i < numLines; i++) {
            verse.push(this.generateRandomLine());
        }

        if (computerLine) {
            const insertPosition = random.randint(1, verse.length - 2);
            verse.splice(insertPosition, 0, computerLine);
        }

        verse[verse.length - 1] += ".";

        return verse.join("\n");
    }

    generatePoem(inputText) {
        this.words = inputText.split(/\s+/).filter(Boolean);
        if (this.words.length < 2) {
            return "Why are you so quiet?";
        }
        const startingSentence = this.generateRandomLine();
        const endingSentence = startingSentence + ".";

        const computerLine = random.choice(COMPUTER_LINES);
        const verses = [
            this.generateVerse(startingSentence, null, true),
            this.generateVerse(startingSentence, computerLine, true),
            this.generateVerse(startingSentence),
        ];

        verses[verses.length - 1] = verses[verses.length - 1].slice(0, -1);

        const poem = verses.join("\n\n") + `\n${endingSentence}`;

        const poemLines = poem.split("\n");
        this.insertSpecialCharacter(poemLines);
        this.capitalizeRandomLine(poemLines);

        return "''\n" + poemLines.join("\n") + "\n''\n - You";
    }
}
