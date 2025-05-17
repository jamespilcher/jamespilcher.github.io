import { divideLettersFairlyWithVowels } from './letter_divider.js';
import { loadValidWords } from './valid_words.js';
let validWords; // Declare validWords globally

// Load valid words asynchronously
loadValidWords().then((wordsSet) => {
    validWords = wordsSet; // Assign the resolved Set to validWords
    console.log("Valid words loaded:", validWords);
});


const letterResult = divideLettersFairlyWithVowels();
const player1Letters = new Set(letterResult.player1);
const player2Letters = new Set(letterResult.player2);

console.log("Player 1 Letters:", [...player1Letters]);
console.log("Player 2 Letters:", [...player2Letters]);

// Game state
let player1Stack = ""; // Stack for Player 1
let player2Stack = ""; // Stack for Player 2
let player1Words = []; // Valid words for Player 1
let player2Words = []; // Valid words for Player 2

// Function to handle continual input
function handleContinualInput(input) {
    const letter = input.toUpperCase(); // Convert input to uppercase

    // Determine which player owns the letter
    if (player1Letters.has(letter)) {
        player1Stack += letter;
        console.log(`Player 1 Stack: "${player1Stack}"`);
        if (validWords.has(player1Stack.toLowerCase())) {
            player1Words.push(player1Stack.toLowerCase());
            console.log(`Player 1 scores with "${player1Stack}"!`);
            player1Stack = ""; // Flush the stack
        }
    } else if (player2Letters.has(letter)) {
        player2Stack += letter;
        console.log(`Player 2 Stack: "${player2Stack}"`);
        if (validWords.has(player2Stack.toLowerCase())) {
            player2Words.push(player2Stack.toLowerCase());
            console.log(`Player 2 scores with "${player2Stack}"!`);
            player2Stack = ""; // Flush the stack
        }
    } else {
        console.log(`"${letter}" does not belong to any player.`);
    }
}



document.addEventListener("keydown", (event) => {
    const input = event.key; // Get the key that was pressed

    if (input == "1") {
        player1Stack = ""; // Clear Player 1's stack
    }
    if (input == "0") {
        player2Stack = ""; // Clear Player 2's stack
    }

    // Only process single alphabetic characters
    if (input.length === 1 && /^[a-zA-Z]$/.test(input)) {
        handleContinualInput(input); // Call your function with the input
    } else {
        console.log(`"${input}" is not a valid letter.`);
    }
});



