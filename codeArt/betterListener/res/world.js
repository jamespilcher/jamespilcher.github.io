
class Symbol {
    current_symbol = '';
    next_symbol = '';
    next_symbol_update_time = 0;

    getRandomSymbol() {
        const symbols = ['!', '@', '#', '$', '%', '^', '&', '*'];
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    constructor() {
        this.current_symbol = this.getRandomSymbol();
        this.next_symbol = this.getRandomSymbol();
        this.current_colour = "black";
        this.next_colour = "black";
        this.start();
    }
    update() {
        this.current_symbol = this.next_symbol;
        this.current_colour = this.next_colour;
        this.next_symbol = this.getRandomSymbol();
        this.next_colour = "black"; // go back to black!
        this.next_symbol_update_time = getRandomNumber(1000, 3000);
        this.start();
    }
    start() {
        // set time out function
        setTimeout(() => this.update(), this.next_symbol_update_time);
    }
}

class SymbolSquare {
    generateSymbolSquare(height, width) {
        const symbolsArray = [];

        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(new Symbol());
            }
            symbolsArray.push(row);
        }
        return symbolsArray;
    }

    constructor(height, width, squareElement) {
        this.symbolSquareElement = squareElement;
        this.height = height;
        this.width = width;
        this.content = this.generateSymbolSquare(height, width);
        this.startDrawing();
    }


    render() {
        this.symbolSquareElement.innerHTML = this.content
            .map(row =>
                row
                    .map(symbol =>
                        `<span style="color: ${symbol.current_colour}">${symbol.current_symbol}</span>`
                    )
                    .join('')
            )
            .join('<br>');
    }
    
    startDrawing() {
        setInterval(() => {
            this.render();
        }, 50)
    }

    setSymbol(x, y, symbol, colour) {
        console.log("setting symbol", x, y, symbol);
        this.content[y][x].current_symbol = symbol;
        this.content[y][x].next_symbol = symbol;
        this.content[y][x].current_colour = colour;
        this.content[y][x].next_colour = colour;
    }

    populateWorldWithSentence(sentence, colour) {
        sentence = sentence.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        // pick random stanting x, y. Ensure y is not too close to the bottom. make them ints
        const x = Math.floor(Math.random() * this.width - sentence.length / 2);
        const y = Math.floor(Math.random() * (this.height - 2));
        // for each letter in the sentence, add it to the world, at the right index. if hit the end of the line, go to the next line
        let currentX = x;
        let currentY = y;
        for (let i = 0; i < sentence.length; i++) {
            if (currentX >= this.width) {
                currentY++;
                currentX = Math.floor(Math.random() * (this.width - sentence.length / 4));
            }
            if (currentY >= this.height) {
                break;
            }
            this.setSymbol(currentX, currentY, sentence[i], colour);
            currentX++;
        }
        console.log(sentence);
    }
}

