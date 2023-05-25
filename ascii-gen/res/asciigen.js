
asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' ']

function stepFunction(x) {
  if (x < 0){
    return 0;
  }
  if (x > 255){
    return 255;
  }
  return x;
}


function generateAsciiArt(data) {  
  // THANK YOU: https://stackoverflow.com/a/37714937
  contrast = 65;
  contrast = (contrast/100) + 1;  //convert to decimal & shift range: [0..2]
  var intercept = 128 * (1 - contrast);

  pixelDataSize = 4;
  output = '';

  for (let i = 0; i < data.length; i += pixelDataSize) {
    pixelIndex = i / pixelDataSize;
    const r = data[i]*contrast + intercept;
    const g = data[i + 1]*contrast + intercept;
    const b = data[i + 2]*contrast + intercept;
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
  }
  document.getElementById('asciiOutput').innerHTML = output;
  // var win = window.open('', '_blank');
  // win.document.write('<html><body><pre style="font-size: 20px; white-space: pre-wrap;">' + output + '</pre></body></html>');
  // win.document.close();
}


const videoElement = document.getElementById('videoElement');
const  outputWidth = 192;
//create a canvas
// Access the webcam stream
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

  // Draw the image onto the canvas
  
    setInterval(() => {
      // Draw the video frame onto the canvas every second
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      // Get the image data
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      generateAsciiArt(imageData.data)
    }, 50);
  })
  .catch((error) => {
    console.error('Error accessing webcam:', error);
  });