
projectLinks = document.querySelectorAll('.project a')

function redirect(){
    // play chicken sound
    audio = new Audio('chicken.mp3');
    audio.play();
    // play once audio finishes
    audio.onended = function() {
        randomLink = projectLinks[Math.floor(Math.random() * projectLinks.length)];
        window.location.href = randomLink;
    };

}