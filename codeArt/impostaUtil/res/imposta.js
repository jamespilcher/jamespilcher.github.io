export async function loadValidWords() {
    const filePath = 'res/words.txt'; // Adjust the path if necessary
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load file: ${response.status}`);
        }
        const text = await response.text();
        const words = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        const validWordsSet = new Set(words);
        console.log("Valid words loaded:", validWordsSet);
        return validWordsSet;
    } catch (error) {
        console.error("Error loading valid words:", error);
        return new Set(); // Return an empty Set on failure
    }
}

loadValidWords().then(validWordsSet => {
    // Store the valid words in a global variable or use them as needed
    window.wordList = Array.from(validWordsSet);
});

document.getElementById("startGame").addEventListener("click", function() {
  const playerCount = parseInt(document.getElementById("playerCount").value, 10);
  if (isNaN(playerCount) || playerCount < 2 || playerCount > 20) {
    alert("Please enter a valid number of players (2-20).");
    return;
  }

  // Pick a random word
  const chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
  // Pick a random imposta
  const impostaIndex = Math.floor(Math.random() * playerCount);

  let currentPlayer = 0;
  const impostaDiv = document.getElementById("imposta");
  impostaDiv.innerHTML = "<p>Player 1, click below to see the secret word </p><button id='showWord'>Show Word</button>";

  document.getElementById("showWord").addEventListener("click", function showNext() {
    let message;
    if (currentPlayer === impostaIndex) {
      message = "<p><b>YOU ARE THE IMPOSTA</b>. The word remains hidden.</p>";
    } else {
      message = `<p>The word is <b>${chosenWord}</b></p>`;
    }
    // message += `<p><i>Player ${currentPlayer + 1} of ${playerCount}</i></p>`;
    if (currentPlayer < playerCount - 1) {
      message += `<button id='nextPlayer'>Next Player</button>`;
    } else {
      message += `<button id='restartGame'>Again</button>`;
    }
    impostaDiv.innerHTML = message;

    if (currentPlayer < playerCount - 1) {
      document.getElementById("nextPlayer").addEventListener("click", function() {
        currentPlayer++;
        impostaDiv.innerHTML = `<p>Player ${currentPlayer + 1}, click below to see the secret word <p><button id='showWord'>Show Word</button>`;
        document.getElementById("showWord").addEventListener("click", showNext);
      });
    } else {
      document.getElementById("restartGame").addEventListener("click", function() {
        location.reload();
      });
    }
  });
});