
function show() {
  // fade in bodge
  startButton.style.display = 'none';
  asciiCam.hidden = false;
  videoElement.play();
  main();
}

function main() {

  asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' ']
  //asciiCharsReversed = asciiChars.reverse()

  fontSize = 4;

  const videoElement = document.getElementById('videoElement');
  const asciiOutput = document.getElementById('asciiOutput');
  asciiOutput.style.fontSize = fontSize + 'px';
  const outputWidth = Math.round(document.body.clientWidth / fontSize);

  function stepFunction(x) {
    if (x < 0) {
      return 0;
    }
    if (x > 255) {
      return 255;
    }
    return x;
  }


  function generateAsciiArt(data) {
    // THANK YOU: https://stackoverflow.com/a/37714937 for contrast code
    contrast = 65;
    contrast = (contrast / 100) + 1;  //convert to decimal & shift range: [0..2]
    var intercept = 128 * (1 - contrast);

    pixelDataSize = 4;
    output = '';

    charIndexCount = 0;

    for (let i = 0; i < data.length; i += pixelDataSize) {
      pixelIndex = i / pixelDataSize;
      const r = data[i] * contrast + intercept;
      const g = data[i + 1] * contrast + intercept;
      const b = data[i + 2] * contrast + intercept;
      grayscale = Math.round((r + g + b) / 3);
      grayscale = stepFunction(grayscale);
      // Map the grayscale value to an ASCII character
      const index = Math.round((grayscale / 255) * (asciiChars.length - 1));
      const asciiChar = asciiChars[index];
      // new line
      if (pixelIndex % outputWidth == 0 && pixelIndex != 0) {
        // New line reached, perform the desired action
        output += '\n';
      }
      output += asciiChar;
      charIndexCount += index;
    }
    asciiOutput.innerHTML = output;
    averageChar = charIndexCount / (data.length / pixelDataSize);

    return averageChar;
    // var win = window.open('', '_blank');
    // win.document.write('<html><body><pre style="font-size: 20px; white-space: pre-wrap;">' + output + '</pre></body></html>');
    // win.document.close();
  }


  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 440;
  gainNode = audioContext.createGain();
  gainNode.gain.value = 0.04;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  //create a canvas
  // Access the webcam stream

  function createSaveHTMLButton(){
      // Draw the image onto the canvas
      var asciiContainer = document.querySelector('.asciiContainer');
      var copyButton = document.createElement('button');
      copyButton.id = 'copyButton';
      copyButton.textContent = 'Save as HTML';
      asciiContainer.appendChild(document.createElement('br'));
      asciiContainer.appendChild(copyButton);
      copyButton.addEventListener('click', function() {
        var asciiOutput = document.getElementById('asciiOutput');
        var originalLetterSpacing = window.getComputedStyle(asciiOutput).letterSpacing; // Save the original letter-spacing
        asciiOutput.style.letterSpacing = '0.06rem'; // Change to the desired spacing
        var html = asciiOutput.outerHTML;
        var blob = new Blob([html], {type: 'text/html'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'ascii-art.html';
        link.click();
        asciiOutput.style.letterSpacing = originalLetterSpacing; // Restore the original letter-spacing
    });
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.style.display = 'none';

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.display = 'none';

      // keep aspect ratio
      //outputHeight = videoElement.videoHeight / videoElement.videoWidth * outputWidth
      outputHeight = outputWidth;
      // Set the canvas dimensions to match the image dimensions
      canvas.width = outputWidth
      // divide by two to fix stretching
      canvas.height = Math.round(outputHeight / 2.2)

      createSaveHTMLButton();
      setInterval(() => {
        // Draw the video frame onto the canvas every second
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        // Get the image data
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        averageChar = generateAsciiArt(imageData.data)
        targetFreq = averageChar / asciiChars.length * 880 + 220
        currentTime = audioContext.currentTime;
        oscillator.frequency.linearRampToValueAtTime(targetFreq, currentTime + 0.05);
      }, 50);
    })
    .catch((error) => {
      console.error('Error accessing webcam:', error);
      asciiOutput.innerHTML = 'Error accessing webcam';
    });

    copyButton = document.getElementById('copyButton')

    

}