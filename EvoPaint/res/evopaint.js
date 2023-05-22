const attemptCanvas = document.getElementById('attempt');
const attemptCtx = attemptCanvas.getContext('2d');


const imageCanvas = document.getElementById('image');
const imageCtx = imageCanvas.getContext('2d');

const fileInput = document.getElementById('image-upload');



// Listen for the 'change' event on the input element
fileInput.addEventListener('change', () => {
  // Get the selected file
  const file = fileInput.files[0];

  // Create a new FileReader instance
  const reader = new FileReader();

  // Listen for the 'load' event on the FileReader instance
  reader.addEventListener('load', () => {
    // Create a new Image instance
    const image = new Image();

    // Set the 'src' property of the Image instance to the data URL
    image.src = reader.result;

    // Listen for the 'load' event on the Image instance
    image.addEventListener('load', () => {
      // Get the current width and height of the image
      const { width, height } = image;

      // Determine the new width and height based on the maximum dimensions
      let newHeight = attemptCanvas.width*height/width;


      // Create a new canvas element and set its dimensions
      imageCanvas.height = newHeight;
      attemptCanvas.height = newHeight

      // Draw the image onto the canvas at the new size
      imageCtx.drawImage(image, 0, 0, imageCanvas.width, newHeight);

      // Get the data URL of the resized image
      const resizedDataUrl = canvas.toDataURL();

      // Do something with the resized image data URL, for example:
      const resizedImage = new Image();
      resizedImage.src = resizedDataUrl;
      document.body.appendChild(resizedImage);
    });
  });

  // Read the selected file as a data URL
  reader.readAsDataURL(file);
});