canvas = document.getElementById("backPics");
ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 300;


resizeCanvas = document.createElement('canvas');
resizeCtx = resizeCanvas.getContext('2d');
resizeCanvas.display = 'none';
resizeCanvas.width = canvas.width;
resizeCanvas.height = canvas.height;


var imageCache = [];
var numImages = 6;
var imagesLoaded = 0;

function preloadImages() {
    
    for (var i = 0; i < numImages; i++) {
        let image = new Image();
        image.src = "res/backs/back" + i + ".jpg";
        image.onload = function () {
            // resize the image to 300x300:
            resizeCtx.drawImage(image, 0, 0, resizeCanvas.width, resizeCanvas.height);
            newImageDataURL = resizeCanvas.toDataURL();
            let resizedImage = new Image();
            resizedImage.src = newImageDataURL;
            resizedImage.onload = function () {
                imageCache.push(resizedImage);
                imagesLoaded++;
            }
        };
    }

}

function goBack() {

    var imageIndex = Math.floor(Math.random() * imageCache.length);
    var image = imageCache[imageIndex];
    // rotate and display the image
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.floor(Math.random() * 4) * Math.PI / 2);
    ctx.drawImage(image, -image.width / 2, -image.height / 2, canvas.width, canvas.height);
    ctx.restore();
}

function megaBack() {
    const button = document.getElementById("backbutton");
    button.remove();
    times = 0;
    preloadImages();
    var timer = setInterval(function () {
        if (imagesLoaded === numImages) { // annoying hack to make sure everything is loaded. TODO LEARN ASYNC AWAIT JS
            goBack();
        }
        times += 1;
    }, 75);
}