function getRandomNumber(lower, upper){
    randomNum = ((Math.random() * (upper - lower + 1)) + lower).toFixed(2);
    return randomNum
}