<?php
    session_start();
    $_SESSION["errRegMessage"] = "";

    if (empty($_SESSION["user"])){ 
        ?>
        <meta http-equiv="Refresh" content="0; url='index.php'" />
        <?php
    }
    else{
?>
<!DOCTYPE html>
<html>
<head>
    <title>Play Tetris</title>
    <link rel="stylesheet" type="text/css" href="res\style.css">
</head>
<body>
    <ul>
        <li name="home" style="float:left"><a href="index.php">Home</a></li>
        <li name="tetris" style="float:right"><a class="active" href="tetris.php">Play Tetris</a></li>
        <li name="leaderboard" style="float:right"><a href="leaderboard.php">Leaderboard</a></li>
    </ul>
    
    <div class="main">
        <div class="greydiv">
            <h2 id="tetrisTitle">Tetris</h1>
            <h2 id="gameOver"></h1>
            <p id="score"></p>
            <div id="load-bg">
            </div>

            <div id="tetris-pressplay">
                <form action="/tetris.php" method="post">
                        <input type="submit" class="playbtn" name="play" value = "Play">
                </form>
            </div>
            <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (isset($_POST['play'])) {
            ?>
            <script>
                document.getElementById('load-bg').innerHTML = "<div id='tetris-bg'> </div>"
                document.getElementById('tetris-pressplay').innerHTML = "<audio autoplay='true' loop src='res/ocean-man.mp3'></audio>";
                var score = 0;
                var world = [

                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                ]

                function drawWorld() {
                    document.getElementById('tetris-bg').innerHTML = "";
                    for(var y=0; y<20; y++) {
                        for(var x=0; x<10; x++) {
                            if(world[y][x] == 0){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block'></div>";
                            } else if(world[y][x] == 1 || world[y][x] == -1 || world[y][x]=== 11){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block' id='lightBlue'></div>";
                            } else if(world[y][x]=== 2 || world[y][x] == -2 || world[y][x]=== 12){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block' id='orange'></div>";
                            } else if(world[y][x]=== 3 || world[y][x] == -3 || world[y][x]=== 13){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block' id='blue'></div>";
                            } else if(world[y][x]=== 4 || world[y][x] == -4 || world[y][x]=== 14){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block' id='yellow'></div>";
                            } else if(world[y][x]=== 5 || world[y][x] == -5 || world[y][x]=== 15){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block' id='green'></div>";
                            } else if(world[y][x]=== 6 || world[y][x] == -6 || world[y][x]=== 16){
                                document.getElementById('tetris-bg').innerHTML += "<div class='block' id='purple'></div>";
                            } else if(world[y][x]=== 7 || world[y][x] == -7 || world[y][x]=== 17){
                               document.getElementById('tetris-bg').innerHTML += "<div class='block' id='red'></div>";
                            }
                        }
                        document.getElementById('tetris-bg').innerHTML += "<br>";

                    }
                    if (!endLoop){
                        setTimeout(drawWorld, 50);
                    }
                }


                function spawnPiece(){
                    var randomIndex = Math.floor(Math.random() * gamePieces.length);
                    var canSpawn = true;
                    currentPiece = gamePieces[randomIndex];
                    currentIndex = 0;
                    var piece = currentPiece[0];
                    console.log(piece);
                    for (var k = 0; k < 4; k++){
                        for (var i = 0; i < 4; i++){
                            if ( (world[k][3 + i] != 0) && (piece[k][i] != 0)){
                                canSpawn = false;
                                endLoop = true;
                                return;
                            }
                        }
                    }
                    if (canSpawn){
                        for (var k = 0; k < 4; k++){
                            for (var i = 0; i < 4; i++){
                                if (piece[k][i] != 0){
                                    world[k][3 + i] = piece[k][i];
                                }
                            }
                        }
                        score += 1;
                        document.getElementById('score').innerHTML = "Score: ";
                        document.getElementById('score').innerHTML += score;
                    }

                }

                function checkForAce(){
                    for(var y=world.length-1; y>=0; y--) {
                        ace = true;
                        for(var x=0; x<world[y].length; x++) {
                            if(world[y][x] < 10) {
                                ace = false;
                            }
                        }
                        if (ace) {
                            world.splice(y, 1);
                            world.splice(0, 0, [0,0,0,0,0,0,0,0])
                            y++;
                        }
                    }
                }
                function freeze(){
                    for(var y=0; y<20; y++) {
                        for(var x=0; x<10; x++) {
                            if(world[y][x] < 10){
                                if(world[y][x]<0){
                                    world[y][x] *=-1; 
                                }
                                if(world[y][x] != 0){
                                    world[y][x] += 10;
                                }
                            }
                        }
                    }
                    checkForAce();       
                    spawnPiece();
                    //add new element
                    //check for ace!
                }

                function rotatePiece(){
                    var yValue = 0;
                    var xValue = 0;
                    var nextIndex;
                    if (currentIndex == 3){
                        nextIndex = 0;
                    } else{
                        nextIndex = currentIndex + 1;
                    }
                    console.log(nextIndex);
                    var nextShape = currentPiece[nextIndex];
                    for(var y=0; y<20; y++) {
                        for(var x=0; x<10; x++) {
                            if(world[y][x] < 0){
                                    yValue = y;
                                    xValue = x;
                            }
                        }
                    }
                    var canRotate = true;
                    var yDiff = yValue-1;
                    var xDiff = xValue-2;
                    for (var k=0; k<4; k++){
                        for (var i=0; i<4; i++){
                            if ( (nextShape[k][i] < 10) && (nextShape[k][i] != 0) ){
                                if ( (k+yDiff > 19) || (i+xDiff < 0) || (i+xDiff > 9) || (world[k+yDiff][i+xDiff] > 10)){
                                canRotate = false;
                                }
                            }

                        }
                    }
                    console.log(canRotate)
                    if (canRotate){
                        for(var y=0; y<20; y++) {
                            for(var x=0; x<10; x++) {
                                if(world[y][x] < 10 ){
                                        world[y][x] = 0;
                                }
                            }
                        }


                        for (var k=0; k<4; k++){
                            for (var i=0; i<4; i++){
                                if ( (nextShape[k][i] < 10) && (nextShape[k][i] != 0) ){
                                    world[k+yDiff][i+xDiff] = nextShape[k][i];
                                }
                            }
                        }
                        currentIndex = nextIndex;
                    }

                }

                function movePiecesLeft(){
                    var canMove = true;
                    for(var y=19; y>=0; y--) {
                        for(var x=0; x<10; x++) {
                            if((world[y][x] != 0) && (world[y][x] < 10) ){
                                if (x == 0 ||  world[y][x-1] > 10){
                                    canMove = false;
                                } 
                            }
                        }
                    }
                    if(canMove){
                    for(var y=19; y>=0; y--) {
                        for(var x=0; x<10; x++) {
                            if((world[y][x] != 0) && (world[y][x] < 10) ){
                                    world[y][x-1] =  world[y][x];
                                    world[y][x] = 0;
                                }
                            }
                        }
                    }

                }

                function movePiecesRight(){
                    var canMove = true;
                    for(var y=19; y>=0; y--) {
                        for(var x=0; x< 10; x++){
                            if((world[y][x] != 0) && (world[y][x] < 10) ){
                                if (x == 9 ||  world[y][x+1] > 10){
                                    canMove = false;
                                } 
                            }
                        }
                    }
                    if(canMove){
                        for(var y=19; y>=0; y--) {
                        for(var x=9; x>=0; x--){
                            if((world[y][x] != 0) && (world[y][x] < 10) ){
                                    world[y][x+1] =  world[y][x];
                                    world[y][x] = 0;
                                }
                            }
                        }
                    }

                }
                document.onkeydown = function(e){
                    e.preventDefault();
                    if(e.keyCode === 37){
                        movePiecesLeft();
                    }
                    else if(e.keyCode === 39){
                        movePiecesRight();
                    } else if(e.keyCode === 40){
                        movePiecesDown();
                    } else if(e.keyCode === 38){
                        rotatePiece();
                    }
                }

                function movePiecesDown(){
                    var frozen = false;
                    for(var y=0; y<20; y++) {
                        for(var x=0; x<10; x++) {
                            if((world[y][x] != 0) && (world[y][x] < 10) ){
                                if (y == 19 || world[y+1][x] > 10){
                                    frozen = true;
                                    freeze();
                                }
                            }
                        }
                    }
                    if (!frozen){ //if not frozen, then move down
                        for(var y=19; y>= 0; y--) {
                            for(var x=0; x<10; x++) {
                                if(world[y][x] != 0 && world[y][x] < 10 ){
                                    world[y+1][x] = world[y][x];
                                    world[y][x] = 0;
                                }                               
                            } 
                        }
                    }
                    checkForAce();
                }
                var endLoop = false;
                function gameLoop(){
                    movePiecesDown();
                    if (!endLoop){
                        setTimeout(gameLoop, 1000);
                    }
                    else{
                        document.getElementById('gameOver').innerHTML = "GAME OVER";
                        document.getElementById('load-bg').innerHTML = "<form action='/tetris.php' method='post'><input type='submit' class='playbtn' name='play' value = 'Play Again'></form>";
                        //submitscore
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", "leaderboard.php");
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhr.send("score="+score);
                    }
                }
                var I0 = [
                [0,0,0,0],
                [1,1,-1,1],
                [0,0,0,0],
                [0,0,0,0]
                ];

                var I90 = [
                [0,0,1,0],
                [0,0,-1,0],
                [0,0,1,0],
                [0,0,1,0]
                ];

                var I180 = [
                [0,0,0,0],
                [1,1,-1,1],
                [0,0,0,0],
                [0,0,0,0]
                ];

                var I270 = [
                [0,0,1,0],
                [0,0,-1,0],
                [0,0,1,0],
                [0,0,1,0]
                ];

                var I = [I0, I90, I180, I270];


                var L0 = [
                [0,0,0,2],        //L90, L180, L270, go up or down in the list...Array
                [0,2,-2,2],        // L = L0 L90, L180, L270..
                [0,0,0,0],
                [0,0,0,0]
                ];

                var L90 = [
                [0,0,2,0],          //make [3][2] the centre of every
                [0,0,-2,0],        //L90, L180, L270, go up or down in the list...Array
                [0,0,2,2],        // L = L0 L90, L180, L270..
                [0,0,0,0]
                ];

                var L180 = [
                [0,0,0,0],          //make [3][2] the centre of every
                [0,2,-2,2],        //L90, L180, L270, go up or down in the list...Array
                [0,2,0,0],        // L = L0 L90, L180, L270..
                [0,0,0,0]
                ];

                
                var L270 = [
                [0,2,2,0],          //make [3][2] the centre of every
                [0,0,-2,0],        //L90, L180, L270, go up or down in the list...Array
                [0,0,2,0],        // L = L0 L90, L180, L270..
                [0,0,0,0]
                ];

                var L = [L0, L90, L180, L270];

                var J0 = [
                [0,3,0,0],
                [0,3,-3,3],
                [0,0,0,0],
                [0,0,0,0]
                ];

                
                var J90 = [
                [0,0,3,3],
                [0,0,-3,0],
                [0,0,3,0],
                [0,0,0,0]
                ];

                var J180 = [
                [0,0,0,0],
                [0,3,-3,3],
                [0,0,0,3],
                [0,0,0,0]
                ];

                var J270 = [
                [0,0,3,0],
                [0,0,-3,0],
                [0,3,3,0],
                [0,0,0,0]
                ];

                var J = [J0, J90, J180, J270];

                var O0 = [
                [0,0,0,0],
                [0,4,-4,0],
                [0,4,4,0],
                [0,0,0,0]
                ];

                var O90 = [
                [0,0,0,0],
                [0,4,-4,0],
                [0,4,4,0],
                [0,0,0,0]
                ];

                var O180 = [
                [0,0,0,0],
                [0,4,-4,0],
                [0,4,4,0],
                [0,0,0,0]
                ];

                var O270 = [
                [0,0,0,0],
                [0,4,-4,0],
                [0,4,4,0],
                [0,0,0,0]
                ];

                var O = [O0, O90, O180, O270];


                var S0 = [
                [0,0,0,0],
                [0,0,-5,5],
                [0,5,5,0],
                [0,0,0,0]
                ];

                var S90 = [
                [0,5,0,0],
                [0,5,-5,0],
                [0,0,5,0],
                [0,0,0,0]
                ];

                var S180 = [
                [0,0,0,0],
                [0,0,-5,5],
                [0,5,5,0],
                [0,0,0,0]
                ];

                var S270 = [
                [0,5,0,0],
                [0,5,-5,0],
                [0,0,5,0],
                [0,0,0,0]
                ];

                var S = [S0, S90, S180, S270];


                var T0 = [
                [0,0,6,0],
                [0,6,-6,6],
                [0,0,0,0],
                [0,0,0,0]
                ];

                var T90 = [
                [0,0,6,0],
                [0,0,-6,6],
                [0,0,6,0],
                [0,0,0,0]
                ];

                var T180 = [
                [0,0,0,0],
                [0,6,-6,6],
                [0,0,6,0],
                [0,0,0,0]
                ];
                var T270 = [
                [0,0,6,0],
                [0,6,-6,0],
                [0,0,6,0],
                [0,0,0,0]
                ];

                var T = [T0, T90, T180, T270];


                var Z0 = [
                [0,0,0,0],
                [0,7,-7,0],
                [0,0,7,7],
                [0,0,0,0]
                ];

                var Z90 = [
                [0,0,7,0],
                [0,7,-7,0],
                [0,7,0,0],
                [0,0,0,0]
                ];
                var Z180 = [
                [0,0,0,0],
                [0,7,-7,0],
                [0,0,7,7],
                [0,0,0,0]
                ];
                var Z270 = [
                [0,0,7,0],
                [0,7,-7,0],
                [0,7,0,0],
                [0,0,0,0]
                ];

                var Z=[Z0, Z90, Z180, Z270];
                const gamePieces = [I,L,J,O,S,T,Z];
                var currentPiece;
                var currentIndex;
                spawnPiece();

                drawWorld();

                gameLoop();

            </script>
            <?php  
                }
            }
        }
        ?>


        </div>
    </div>
</body>
</html>