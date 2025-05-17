export async function loadValidWords() {
    const filePath = 'res/filtered_words.txt'; // Adjust the path if necessary
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
