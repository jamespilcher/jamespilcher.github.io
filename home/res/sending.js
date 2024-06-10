
const form = document.getElementById('email-form');

function areRequiredValid() {
    // Get all text/input fields in the form
    var formFields = document.querySelectorAll('#email-form input, #email-form textarea');

    // Initialize a boolean variable to check if all fields are filled
    // Initialize a boolean variable to check if all fields are valid
    var allFieldsValid = true;

    // Check each field
    formFields.forEach(function(field) {
      if (!field.checkValidity()) {
        allFieldsValid = false;
      }
    });
    return allFieldsValid;
}


function sending(){
    if (!areRequiredValid()) {
        return;
        }
    var originalHeight = form.offsetHeight;
    var computedStyle = getComputedStyle(form);
    var originalBackgroundColor = computedStyle.backgroundColor;
// Hide the element
    form.style.display = 'none';

    var replacementElement = document.createElement('div');
    replacementElement.style.height = originalHeight + 'px';
    replacementElement.style.width = '100%';
    replacementElement.style.backgroundColor = originalBackgroundColor;
    replacementElement.style.textAlign = 'center';
    replacementElement.style.verticalAlign = 'middle';
    replacementElement.style.fontSize = "15px";
    replacementElement.style.fontFamily = "Courier New";
    replacementElement.style.lineHeight = replacementElement.style.height;

    replacementElement.textContent = 'please wait'; // You can customize content
    // Insert the new element after the original element
    form.parentNode.insertBefore(replacementElement, form.nextSibling);

    // Append dots with a timeout
    var dots = 0;
    var dotInterval = setInterval(function () {
        dots = (dots + 1) % 4;
        replacementElement.textContent = 'please wait' + '.'.repeat(dots);
    }, 500); // Adjust the interval duration (in milliseconds) as needed

    // Set a timeout to stop appending dots and remove the replacement element after a certain duration
    setTimeout(function () {
        clearInterval(dotInterval);
        form.parentNode.removeChild(replacementElement);
        form.style.display = ''; // Show the original form again
    }, 10000); // Adjust the total duration (in milliseconds) as needed

}


window.onload = function() {

    // Get all input and textarea elements within the form
    const formElements = form.querySelectorAll('input, textarea');

    // Create a div to display the styled characters
    const displayDiv = document.createElement('div');
    form.appendChild(displayDiv);

    // Add input event listener to each form element
    formElements.forEach(function(element, index, elements) {
        element.addEventListener('keydown', function(event) {
            changeColor(event, element, index, elements);
        });
        element.addEventListener('blur', function(event) {
            changeColor(event, element, index, elements);
        });
    });

    function changeColor(event, element, index, elements) {
        if (event.keyCode === 13) {
            // Prevent the default behavior of the Enter key (form submission)
            if (element.tagName.toLowerCase() === 'textarea' || index === elements.length - 1){
                return;
            }
            event.preventDefault();
            // If it's the last input field, update the display
            // Move to the next input field
            elements[index + 1].focus();
            }
        // Generate a random color for the character
        const randomColor = getRandomColor();

        // Display the styled characters in the div using innerHTML
        element.style.color = randomColor;
    }
    // Function to generate a random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
};