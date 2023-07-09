canvas = document.getElementById("centerCanvas");
ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 300;
const squareSize = 10;
numAnswered = 0;
numQuestions = 3;
var targX = 0;
var targY = 0;
var totalScore = 0;
endScore = document.getElementById("score");

genQuestion();

function genQuestion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    x1 = squareSize + Math.floor(Math.random() * (canvas.width/2-2*squareSize)); //within reason!
    y1 = squareSize + Math.floor(Math.random() * (canvas.width-2*squareSize)); //within reason!
    
    x2 = squareSize + Math.floor(Math.random() * (canvas.width/2-2*squareSize)) + canvas.width / 2; //within reason!
    y2 = squareSize + Math.floor(Math.random() * (canvas.width-2*squareSize)); //within reason!
    
    targX = (x1 + x2) / 2;
    targY = (y1 + y2) / 2;
    
    ctx.rect(x1-squareSize/2,y1-squareSize/2,squareSize,squareSize);
    
    ctx.rect(x2-squareSize/2,y2-squareSize/2,squareSize,squareSize);
    
    //ctx.rect(midX-squareSize/2,midY-squareSize/2,squareSize,squareSize);
    ctx.fill();
    // random x and y, adi
}

function scoreCalc(x,y) {
    xDist = Math.abs(targX - x);
    yDist = Math.abs(targY - y);
    // could draw a line to point here...
    result = xDist + yDist;
    return result;
}

canvas.addEventListener('mousedown', function (e) { // get the mouse move coordinates
    e.preventDefault();
    numAnswered += 1;
    if (numAnswered <= numQuestions) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        score = scoreCalc(x,y);
        totalScore += score;
        console.log(totalScore);
        if (numAnswered < numQuestions){
            genQuestion();
        }
        else{
            totalScore = Math.round(totalScore/numQuestions);
            endScore.innerHTML = "Average number of units away from the centre: " + totalScore;
        }
    }
    // dont do anything else
}
);

// how to

// select 