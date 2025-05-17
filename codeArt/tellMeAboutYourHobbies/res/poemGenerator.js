const DETERMINERS = new Set(["a", "an", "the"]);
const PREPOSITIONS = new Set([
  "about", "above", "across", "after", "against", "along",
  "with", "without", "to"
]);
const CONJUNCTIONS = new Set([
  "and", "but", "or", "so", "for", "nor", "yet", "after", "although",
  "as", "because", "before", "even", "if", "once", "since",
  "though", "unless", "until", "when", "where", "while"
]);
const OTHER_WORDS = new Set(["i", "like", "as", "don't", "that's", "doesn't", "does"]);
const COMPUTER_LINES = [
  "this feels unfamiliar", "heard before", "we don't understand",
  "we hear this often", "we understand", "we comfort",
  "this is familiar", "we miss", "we remember", "we don't remember",
  "we lose", "we find", "we don't find", "we thought", "we don't think"
];
const SPECIAL_CHARACTERS = ["—", "!", "..."];

const MIN_NUM_WORDS = 30;

let usedLines = new Set();
let words = [];

let outText = document.getElementById("poemText");
let dashes = "-".repeat(MIN_NUM_WORDS - words.length);
outText.innerHTML = `0/${MIN_NUM_WORDS}\n${dashes}!`;

function isValidLine(line) {
  const lastWord = line.trim().split(/\s+/).slice(-1)[0]?.toLowerCase();
  return (
    lastWord &&
    !DETERMINERS.has(lastWord) &&
    !PREPOSITIONS.has(lastWord) &&
    !CONJUNCTIONS.has(lastWord) &&
    !OTHER_WORDS.has(lastWord) &&
    !usedLines.has(line)
  );
}

function generateRandomLine() {
  let line = "";
  for (let i = 0; i < 10; i++) {
    const start = Math.floor(Math.random() * (words.length - 1));
    const numWords = Math.floor(Math.random() * 4) + 2;
    const end = Math.min(start + numWords, words.length);
    line = words.slice(start, end).join(" ");
    if (isValidLine(line)) {
      usedLines.add(line);
      return line;
    }
  }
  usedLines.add(line);
  return line;
}

function insertSpecialCharacter(poemLines) {
  const validIndices = poemLines
    .map((line, i) => i)
    .filter(i => i > 0 && i < poemLines.length - 1 && poemLines[i].trim());

  if (validIndices.length > 0) {
    const idx = validIndices[Math.floor(Math.random() * validIndices.length)];
    const char = SPECIAL_CHARACTERS[Math.floor(Math.random() * SPECIAL_CHARACTERS.length)];
    poemLines[idx] = poemLines[idx].endsWith(".")
      ? poemLines[idx].slice(0, -1) + char
      : poemLines[idx] + char;
  }
}

function capitalizeRandomLine(poemLines) {
  const validIndices = poemLines
    .map((line, i) => i)
    .filter(i => i > 0 && i < poemLines.length - 1 && poemLines[i].trim());

  if (validIndices.length > 0) {
    const idx = validIndices[Math.floor(Math.random() * validIndices.length)];
    poemLines[idx] = poemLines[idx].toUpperCase();
  }
}

function generateVerse(startingSentence, computerLine = null, isFirstTwoVerses = false) {
  const verse = [];

  if (isFirstTwoVerses) {
    verse.push(startingSentence);
  }

  const linesToGenerate = Math.floor(Math.random() * 2) + 2; // 2 or 3
  for (let i = 0; i < linesToGenerate; i++) {
    verse.push(generateRandomLine());
  }

  if (computerLine) {
    const insertIndex = Math.floor(Math.random() * (verse.length - 1)) + 1;
    verse.splice(insertIndex, 0, computerLine);
  }

  verse[verse.length - 1] += ".";

  return verse.join("\n");
}


function generatePoem(inputText) {
  console.log("generatePoem called with:", inputText);

  usedLines = new Set(); // reset
  inputText = inputText.replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");  
  // convert to lowercase
  inputText = inputText.toLowerCase();
  if (inputText === "") {
    words = [];
  } else {
    words = inputText.split(/\s+/);
  }
  if (words.length < MIN_NUM_WORDS) {
    console.log("Not enough words to generate a poem.");


    let starts = "*".repeat(words.length);
    let dashes = "-".repeat(MIN_NUM_WORDS - words.length);

    outText.innerHTML = `${words.length}/${MIN_NUM_WORDS}\n${starts}${dashes}!`;
    return `More must be said...`;
  }
  

  const startingSentence = generateRandomLine();
  const endingSentence = startingSentence + ".";
  const computerLine = COMPUTER_LINES[Math.floor(Math.random() * COMPUTER_LINES.length)];

  const verses = [
    generateVerse(startingSentence, null, true),
    generateVerse(startingSentence, computerLine, true),
    generateVerse(startingSentence)
  ];

  verses[2] = verses[2].slice(0, -1); // Remove period
  let poem = verses.join("\n\n") + `\n${endingSentence}`;

  // Add special character and capitalize random lines
  const poemLines = poem.split("\n");
  insertSpecialCharacter(poemLines);
  capitalizeRandomLine(poemLines);

  console.log(`''\n${poemLines.join("\n")}\n''\n - You`);

  outText.innerHTML = `''\n${poemLines.join("\n")}\n''\n - You`;

  return `''\n${poemLines.join("\n")}\n''\n - You`;
}
