
projectLinks = document.querySelectorAll('.project a')

function redirect(){
    randomLink = projectLinks[Math.floor(Math.random() * projectLinks.length)];
    window.location.href = randomLink;
}