




const fontSize = 20;
const symbolSquareElement = document.getElementById('symbolSquare');
const startButton = document.getElementById('startButton');
const userInput = document.getElementById('messageInput');
const inputBox = document.getElementById('inputBox');

function show() {
  // fade in bodge
  startButton.style.display = 'none';
  symbolSquareElement.hidden = false;
  inputBox.hidden = false;
  main();
}

function main() {

  symbolSquareElement.style.fontSize = fontSize + 'px';
  const squareSize = Math.round(document.body.clientWidth / (fontSize * .8));
  const symbolSquare = new SymbolSquare(squareSize * .5, squareSize, symbolSquareElement);

  const elizaBot = new ElizaBot();
  
  userInput.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
      initiate(userInput.value);
      userInput.value = "";
    }
  });

  // main.js
  function initiate(userText) {
    symbolSquare.populateWorldWithSentence(userText, "color: blue; font-weight: bold;");
    const aiResponse = elizaBot.processInput(userText);
    console.log("AI Response:", aiResponse);
    speak(aiResponse);
  }
  function startSpeechRecognition() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = function () {
      console.log("Speech recognition started");
    };

    recognition.onresult = function (event) {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript.trim();
      const confidence = result[0].confidence;

      console.log("Transcript:", transcript);
      console.log("Confidence:", confidence);

      if (confidence > 0.5) {
        initiate(transcript);
      }
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = function () {
      console.log("Speech recognition ended, restarting");
      recognition.start();
    };

    recognition.start();
  }

  const voiceSettings = {
    voice: null,
    volume: 0.8,
    rate: getRandomNumber(0.95, 1.02),
    pitch: getRandomNumber(0.3, 1.00),
  };

  const synth = window.speechSynthesis

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (synth.speaking) {
      synth.cancel();
    }
    function initializeSpeech() {
      const voices = synth.getVoices();

      if (voices.length > 0) {
        if (voiceSettings.voice === null) {
          voiceSettings.voice = voices[Math.floor(Math.random() * voices.length)];
        }

        utterance.voice = voiceSettings.voice;
        utterance.volume = voiceSettings.volume;
        utterance.rate = voiceSettings.rate;
        utterance.pitch = voiceSettings.pitch;

        synth.speak(utterance);
        setTimeout(() => { symbolSquare.populateWorldWithSentence(text, "color: red; font-weight: bold;") }, 500);
      }
    }

    // Check if there are voices available immediately
    initializeSpeech();

    // If not, wait for the voiceschanged event before initializing
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = initializeSpeech;
    }
  }

  startSpeechRecognition();

}