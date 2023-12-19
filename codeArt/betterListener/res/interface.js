

const fontSize = 15;
const symbolSquareElement = document.getElementById('symbolSquare');
symbolSquareElement.style.fontSize = fontSize + 'px';
const squareSize = Math.round(document.body.clientWidth / fontSize);
const symbolSquare = new SymbolSquare(squareSize * 2/3, squareSize, symbolSquareElement);




// main.js
const elizaBot = new ElizaBot();

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
      const aiResponse = elizaBot.processInput(transcript);
      console.log("AI Response:", aiResponse);
      speak(aiResponse);
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
    rate: getRandomNumber(0.95, 1.05),
    pitch: getRandomNumber(0.1, 1.1),
  };

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();

    if (voices.length > 0) {
        // If voiceIndex is not set, randomly choose one and store the settings
        if (voiceSettings.voiceIndex === null) {
        voiceSettings.voiceIndex = Math.floor(Math.random() * voices.length);
        }

        // Apply the stored voice settings to the utterance
        utterance.voice = voices[voiceSettings.voiceIndex];
        utterance.volume = voiceSettings.volume;
        utterance.rate = voiceSettings.rate;
        utterance.pitch = voiceSettings.pitch;

        // Initiate speech synthesis
        synth.speak(utterance);
        symbolSquare.populateWorldWithSentence(text, "red");
    }
}
startSpeechRecognition();


