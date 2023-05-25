const fileInput = document.getElementById('image-upload');



// Listen for the 'change' event on the input element
fileInput.addEventListener('change', () => {
  // Get the selected file
  const file = fileInput.files[0];

  // Create a new FileReader instance
  const reader = new FileReader();

  // Listen for the 'load' event on the FileReader instance


  // Read the selected file as a data URL
  reader.readAsDataURL(file);

  reader.addEventListener('load', () => {
    // Create a new Image instance
    const image = new Image();

    // Set the 'src' property of the Image instance to the data URL
    image.src = reader.result;
    // Listen for the 'load' event on the Image instance
    image.addEventListener('load', () => {
      generateAscii(image);
      // Get the current width and height of the image
    });
  });
});

