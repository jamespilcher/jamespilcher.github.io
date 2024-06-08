function displayMarkdown(markdownFilePath) {
    fetch(markdownFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(markdown => {
            const htmlContent = marked.parse(markdown);
            let contentDiv = document.getElementById('markdown-content');
            contentDiv.innerHTML = htmlContent;
        })
        .catch(error => console.error('Error loading markdown file:', error));
}

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
