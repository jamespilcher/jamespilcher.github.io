const letterDistribution = {
    A: 8.17,
    B: 1.49,
    C: 2.78,
    D: 4.25,
    E: 12.70,
    F: 2.23,
    G: 2.02,
    H: 6.09,
    I: 6.97,
    J: 0.15,
    K: 0.77,
    L: 4.03,
    M: 2.41,
    N: 6.75,
    O: 7.51,
    P: 1.93,
    Q: 0.10,
    R: 5.99,
    S: 6.33,
    T: 9.06,
    U: 2.76,
    V: 0.98,
    W: 2.36,
    X: 0.15,
    Y: 1.97,
    Z: 0.07
};
export function divideLettersFairlyWithVowels() {
    const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
    const letters = Object.keys(letterDistribution);

    // Shuffle letters randomly
    const shuffledLetters = letters.sort(() => Math.random() - 0.5);

    let player1Set = [];
    let player2Set = [];
    let player1Total = 0;
    let player2Total = 0;
    let player1Vowels = 0;
    let player2Vowels = 0;

    // Distribute letters fairly based on their frequencies and vowel count
    for (const letter of shuffledLetters) {
        const frequency = letterDistribution[letter];
        const isVowel = vowels.has(letter);

        // Ensure the max difference of 2 characters between players
        if (
            player1Set.length < player2Set.length + 2 && // Player 1 can take a letter
            (player1Total <= player2Total || (isVowel && player1Vowels <= player2Vowels))
        ) {
            player1Set.push(letter);
            player1Total += frequency;
            if (isVowel) player1Vowels++;
        } else if (player2Set.length < player1Set.length + 2) { // Player 2 can take a letter
            player2Set.push(letter);
            player2Total += frequency;
            if (isVowel) player2Vowels++;
        }
    }

    // Ensure each player has at least 10 letters
    while (player1Set.length < 10 || player2Set.length < 10) {
        const remainingLetters = shuffledLetters.filter(
            (letter) => !player1Set.includes(letter) && !player2Set.includes(letter)
        );

        for (const letter of remainingLetters) {
            if (player1Set.length < 10) {
                player1Set.push(letter);
            } else if (player2Set.length < 10) {
                player2Set.push(letter);
            }
        }
    }

    return {
        player1: player1Set,
        player2: player2Set,
        player1Total: player1Total.toFixed(2),
        player2Total: player2Total.toFixed(2),
        player1Vowels,
        player2Vowels
    };
}