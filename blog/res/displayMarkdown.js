function displayMarkdown(markdownFilePath) {
    // Fetch the markdown file
    fetch(markdownFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(markdown => {
            // Convert markdown to HTML using marked library
            const htmlContent = marked.parse(markdown);
            // Create a div to hold the markdown content if not exists
            let contentDiv = document.getElementById('markdown-content');
            if (!contentDiv) {
                contentDiv = document.createElement('div');
                contentDiv.id = 'markdown-content';
                document.body.appendChild(contentDiv);
            }
            // Insert the HTML content into the div
            contentDiv.innerHTML = htmlContent;
        })
        .catch(error => console.error('Error loading markdown file:', error));
}

// Check if the script is called with a path argument
document.addEventListener("DOMContentLoaded", function() {
    const scriptTags = document.getElementsByTagName('script');
    for (let script of scriptTags) {
        if (script.src.includes('displayMarkdown.js')) {
            const markdownFilePath = script.getAttribute('data-markdown');
            if (markdownFilePath) {
                displayMarkdown(markdownFilePath);
            }
        }
    }
});
