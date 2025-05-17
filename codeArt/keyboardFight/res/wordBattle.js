import { divideLettersFairlyWithVowels } from './letter_divider.js';
import { loadValidWords } from './valid_words.js';

const TIMER_DURATION = 60; // Duration in seconds
let timerStartTime;
let timerAnimationFrame;

function startTimer() {
    const timerBar = document.getElementById("timerBar");
    timerStartTime = Date.now();

    function updateTimer() {
        const elapsedTime = (Date.now() - timerStartTime) / 1000; // Time elapsed in seconds
        const timeLeft = TIMER_DURATION - elapsedTime;
        const percentage = (timeLeft / TIMER_DURATION) * 100;

        if (timeLeft > 0) {
            timerBar.style.width = `${percentage}%`;
            timerAnimationFrame = requestAnimationFrame(updateTimer); // Continue updating
        } else {
            timerBar.style.width = "0%";
            console.log("Time's up!");
            endGame(); // Call a function to handle the end of the game
        }
    }

    timerAnimationFrame = requestAnimationFrame(updateTimer); // Start the animation
}

// Function to handle the end of the game
let gameActive = false; // Track if the game is active

// Function to start the game
function startGame() {
    document.getElementById("startContainer").style.display = "none"; // Hide start button
    document.getElementById("gameContainer").style.display = "block"; // Show game elements
    gameActive = true; // Enable game input
    startTimer(); // Start the timer
}

// Function to handle the end of the game
function endGame() {
    cancelAnimationFrame(timerAnimationFrame); // Stop the timer animation
    gameActive = false; // Disable game input
    let player1wordcheck = document.getElementById("player1wordcheck"); // Get Player 1's wordcheck div
    let player2wordcheck = document.getElementById("player2wordcheck"); // Get Player 2's wordcheck div

    let winner = player1Score > player2Score ? "Player 1" : player2Score > player1Score ? "Player 2" : "Tie";
    if (winner === "Player 1") {
        player1wordcheck.textContent = "Winner :)"; // Update div with success message
        player1wordcheck.style.color = "green"; // Set text color to green

        player2wordcheck.textContent = "Loser :("; // Update div with error message
        player2wordcheck.style.color = "red"; // Set text color to red
    }
    if (winner === "Player 2") {
        player2wordcheck.textContent = "Winner :)"; // Update div with success message
        player2wordcheck.style.color = "green"; // Set text color to green

        player1wordcheck.textContent = "Loser :("; // Update div with error message
        player1wordcheck.style.color = "red"; // Set text color to red
    }
    if (winner === "Tie") {
        player1wordcheck.textContent = "Tie..."; // Update div with success message
        player1wordcheck.style.color = "orange"; // Set text color to orange

        player2wordcheck.textContent = "Tie..."; // Update div with error message
        player2wordcheck.style.color = "orange"; // Set text color to orange
    }

    console.log(`Game Over! ${winner} wins!`);

    

}

let validWords; // Declare validWords globally

// Load valid words asynchronously
loadValidWords().then((wordsSet) => {
    validWords = wordsSet; // Assign the resolved Set to validWords
    console.log("Valid words loaded:", validWords);
});

const MAXSTACK_LENGTH = 17; // Maximum length of the stack

// Divide letters between players
const letterResult = divideLettersFairlyWithVowels();
const player1Letters = new Set(letterResult.player1);
const player2Letters = new Set(letterResult.player2);

// Update UI with player letters
document.getElementById("player1Letters").textContent = [...player1Letters].join(" ");
document.getElementById("player2Letters").textContent = [...player2Letters].join(" ");

// Game state
let player1Stack = ""; // Stack for Player 1
let player2Stack = ""; // Stack for Player 2
let player1Words = []; // Valid words for Player 1
let player2Words = []; // Valid words for Player 2
let player1Score = 0; // Score for Player 1
let player2Score = 0; // Score for Player 2

// Function to update the UI
function updateUI() {
    document.getElementById("player1Words").textContent = player1Words.join(", ");
    document.getElementById("player2Words").textContent = player2Words.join(", ");
    document.getElementById("player1CurrentWord").textContent = player1Stack;
    document.getElementById("player2CurrentWord").textContent = player2Stack;
    document.getElementById("player1Score").textContent = `Score: ${player1Score}`;
    document.getElementById("player2Score").textContent = `Score: ${player2Score}`;
}


// Function to handle continual input
function handleContinualInput(input) {
    if (!validWords) {
        console.log("Valid words are not loaded yet.");
        return;
    }

    const letter = input.toUpperCase(); // Convert input to uppercase

    // Determine which player owns the letter
    if ( (player1Letters.has(letter)) && (player1Stack.length < MAXSTACK_LENGTH)) {
        player1Stack += letter;
        console.log(`Player 1 Stack: "${player1Stack}"`);
    } else if ( (player2Letters.has(letter))  && (player2Stack.length < MAXSTACK_LENGTH)){
        player2Stack += letter;
        console.log(`Player 2 Stack: "${player2Stack}"`);
    } else {
        console.log(`"${letter}" does not belong to any player.`);
    }

    // Update the UI after processing input
}

// Add event listener for keydown

// Add event listener for the start button
document.getElementById("startButton").addEventListener("click", startGame);

// Add event listener for keydown
document.addEventListener("keydown", (event) => {
    if (!gameActive) return; // Ignore input if the game is not active

    const input = event.key; // Get the key that was pressed

    // Handle left shift (submit Player 1's stack)
    if (event.code === "ShiftLeft") {
        const wordCheckDiv = document.getElementById("player1wordcheck"); // Get Player 1's wordcheck div
        if (player1Stack) {
            console.log(`Player 1 submits: "${player1Stack}"`);
            const lowerCaseWord = player1Stack.toLowerCase();
            if (validWords.has(lowerCaseWord)) {
                if (!player1Words.includes(lowerCaseWord)) {
                    player1Words.push(lowerCaseWord);
                    player1Score += lowerCaseWord.length * 100 + (lowerCaseWord.length^2)*5; // Update Player 1's score
                    console.log(`Player 1 scores with "${player1Stack}"!`);
                    wordCheckDiv.textContent = "Valid word!"; // Update div with success message
                    wordCheckDiv.style.color = "green"; // Set text color to green
                } else {
                    console.log(`"${player1Stack}" has already been submitted.`);
                    wordCheckDiv.textContent = "Word already submitted!"; // Update div with error message
                    wordCheckDiv.style.color = "orange"; // Set text color to orange
                }
            } else {
                console.log(`"${player1Stack}" is not a valid word.`);
                wordCheckDiv.textContent = "Invalid word!"; // Update div with error message
                wordCheckDiv.style.color = "red"; // Set text color to red
            }
            player1Stack = ""; // Clear Player 1's stack
        }
    }

    // Handle right shift (submit Player 2's stack)
    if (event.code === "ShiftRight") {
        const wordCheckDiv = document.getElementById("player2wordcheck"); // Get Player 2's wordcheck div
        if (player2Stack) {
            console.log(`Player 2 submits: "${player2Stack}"`);
            const lowerCaseWord = player2Stack.toLowerCase();
            if (validWords.has(lowerCaseWord)) {
                if (!player2Words.includes(lowerCaseWord)) {
                    player2Words.push(lowerCaseWord);
                    console.log(`Player 2 scores with "${player2Stack}"!`);
                    player2Score += lowerCaseWord.length * 100; // Update Player 2's score
                    wordCheckDiv.textContent = "Valid word!"; // Update div with success message
                    wordCheckDiv.style.color = "green"; // Set text color to green
                } else {
                    console.log(`"${player2Stack}" has already been submitted.`);
                    wordCheckDiv.textContent = "Word already submitted!"; // Update div with error message
                    wordCheckDiv.style.color = "orange"; // Set text color to orange
                }
            } else {
                console.log(`"${player2Stack}" is not a valid word.`);
                wordCheckDiv.textContent = "Invalid word!"; // Update div with error message
                wordCheckDiv.style.color = "red"; // Set text color to red
            }
            player2Stack = ""; // Clear Player 2's stack
        }
    }

    // Only process single alphabetic characters
    if (input.length === 1 && /^[a-zA-Z]$/.test(input)) {
        handleContinualInput(input); // Call your function with the input
    } else if (event.code !== "ShiftLeft" && event.code !== "ShiftRight") {
        console.log(`"${input}" is not a valid letter.`);
    }
    updateUI();
});