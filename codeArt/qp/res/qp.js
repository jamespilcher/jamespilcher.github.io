const players = {
    q: { charge: 0, isPressing: false }, // Player Q's charge and press state
    p: { charge: 0, isPressing: false }  // Player P's charge and press state
};

console.log("Game initialized");

const decayRate = 0.3; // Decay rate per tick
const maxCharge = 20; // Maximum charge in either direction
const barLength = 25; // Length of the bar
let gameInterval; // Declare gameInterval globally to manage start/restart


function showKeyboard() {
    const hiddenInput = document.getElementById("hiddenInput");
    hiddenInput.focus(); // Focus on the hidden input to show the keyboard
}

// Function to render the bar
function renderBar() {
    console.log(players.q.charge, players.p.charge);
    const qLength = Math.round((players.q.charge / maxCharge) * barLength);
    const pLength = Math.round((players.p.charge / maxCharge) * barLength);
    const emptySpace = barLength - qLength - pLength;

    const leftBar = "q".repeat(qLength);
    const rightBar = "p".repeat(pLength);
    const emptyBar = "-".repeat(emptySpace);

    const gameContainer = document.getElementById("gameContainer");
    const winnerText = document.getElementById("winnerText");
    gameContainer.textContent = leftBar + emptyBar + rightBar;

    if (qLength >= barLength) {
        winnerText.textContent = "Q Wins";
        endGame();
    } else if (pLength >= barLength) {
        winnerText.textContent = "P Wins";
        endGame();
    }
}


function endGame() {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    clearInterval(gameInterval); // Stop the decay interval

    // Show the restart button and hide the start button

    setTimeout(() => {
        document.getElementById("restartButton").style.display = "block";
    }, 1000);}

function startGame() {
    // Reset player states
    players.q.charge = 0;
    players.q.isPressing = false;
    players.p.charge = 0;
    players.p.isPressing = false;

    // Reset UI
    const winnerText = document.getElementById("winnerText");
    winnerText.textContent = "";
    renderBar();

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    // Hide the start button and ensure the restart button is hidden
    document.getElementById("startButton").style.display = "none";
    document.getElementById("restartButton").style.display = "none";

    // Start decay interval
    gameInterval = setInterval(applyDecay, 100);
}

// Function to handle keydown events
function handleKeyDown(event) {
    if (event.key === "q" || event.key === "Q") {
        if (!players.q.isPressing) {
            players.q.charge = Math.min(maxCharge, players.q.charge + 1); // Increase charge for Q
            players.q.isPressing = true; // Mark Q as being pressed
        }
    } else if (event.key === "p" || event.key === "P") {
        if (!players.p.isPressing) {
            players.p.charge = Math.min(maxCharge, players.p.charge + 1); // Increase charge for P
            players.p.isPressing = true; // Mark P as being pressed
        }
    }
}

// Function to handle keyup events
function handleKeyUp(event) {
    if (event.key === "q" || event.key === "Q") {
        players.q.isPressing = false; // Reset Q press state
    } else if (event.key === "p" || event.key === "P") {
        players.p.isPressing = false; // Reset P press state
    }
}

// Function to apply decay
function applyDecay() {
    // Apply decay to Q
    if (players.q.charge > 0) {
        players.q.charge = Math.max(0, players.q.charge - decayRate);
    }

    // Apply decay to P
    if (players.p.charge > 0) {
        players.p.charge = Math.max(0, players.p.charge - decayRate);
    }

    // Ensure total charge does not exceed maxCharge
    const totalCharge = players.q.charge + players.p.charge;
    if (totalCharge > maxCharge) {
        const excess = totalCharge - maxCharge;
        const halfExcess = excess / 2; // Divide the excess evenly
        players.q.charge = Math.max(0, players.q.charge - halfExcess);
        players.p.charge = Math.max(0, players.p.charge - halfExcess);
    }

    renderBar();
}

// Add buttons for start and restart
document.getElementById("startButton").addEventListener("click", () => {
    console.log("Start button clicked");
    startGame();
    showKeyboard(); // Trigger the keyboard
});

document.getElementById("restartButton").addEventListener("click", () => {
    startGame();
    showKeyboard(); // Trigger the keyboard
});
