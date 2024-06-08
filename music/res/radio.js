var muted=true
var first=true
var loaded=false
var songPaths = ["1.wav", "2.wav", "3.wav", "the_dog_eared_march.wav"]
var songs = {}
var image = document.getElementById("radioimg");
var nowplaying = document.getElementById("nowplaying")
image.classList.add("bw-filter");

let audioContext;
let gainNode;
let filename;
async function populateSongData() {
    songsFolder = "res/songs";
  
    try {
      // Use Promise.all to wait for all promises to be fulfilled
      await Promise.all(songPaths.map(async function (filename) {
        var filePath = songsFolder + '/' + filename;
  
        try {
          // Fetch the file
          const response = await fetch(filePath);
          const arrayBuffer = await response.arrayBuffer();
  
          // Decode the audio data using the Web Audio API
          const audioBuffer = await new Promise((resolve, reject) => {
            audioContext.decodeAudioData(arrayBuffer, resolve, reject);
          });
  
          // Get the duration of the audio in seconds
          var duration = audioBuffer.duration;
  
          // Populate the songs dictionary with name and length
          songs[filename] = {
            name: filename,
            length: duration
          };
  
          // Output the populated songs dictionary
          console.log(songs);
        } catch (error) {
          console.error('Error fetching or decoding file:', error);
        }
      }));
  
      // All promises have been fulfilled
      console.log('All songs processed:', songs);
    } catch (error) {
      console.error('Error processing songs:', error);
    }
  }

function getTotalDuration() {
    return songPaths.reduce((total, filename) => total + songs[filename].length, 0);
  }
  

let currentSongIndex = 0;
let remainder = 0;

function startRadio() {
  const totalDuration = getTotalDuration();
  const currentTime = Math.floor(new Date().getTime() / 1000) + remainder;

  const elapsedSeconds = currentTime % totalDuration;
  let cumulativeDuration = 0;

  // Find the current song based on elapsed time
  for (let i = 0; i < songPaths.length; i++) {
    const song = songs[songPaths[i]];
    cumulativeDuration += song.length;

    if (elapsedSeconds < cumulativeDuration) {
      currentSongIndex = i;
      remainder = elapsedSeconds - (cumulativeDuration - song.length);
      console.log(remainder);
      break;
    }
  }

  playCurrentSongAtTime(remainder);
}


async function playCurrentSongAtTime(startTime) {
    filename = songPaths[currentSongIndex];
    const filePath = `${songsFolder}/${filename}`;
    
    try {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
  
      const audioBuffer = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, resolve, reject);
      });
  
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
  
      // Connect the source node to the audio context's destination (speakers)
      sourceNode.connect(gainNode);

      // Start playing the current song at the calculated starting time
      sourceNode.start(0, startTime);
      if (!muted){
        nowplaying.innerHTML=filename;
      }
      loaded=true;
      // Wait for the song to end before playing the next one
      await new Promise(resolve => {
        sourceNode.onended = resolve;
      });
  
      // When the current song ends, play the next song
      currentSongIndex = (currentSongIndex + 1) % songPaths.length;
      await playCurrentSongAtTime(0); // Continue with the next song
    } catch (error) {
      console.error('Error fetching or playing file:', error);
    }
  }

async function mute_unmute(){
        if (first){
            first=false;
            nowplaying.innerHTML="loading..."
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            console.log(gainNode)
            await populateSongData();
            await startRadio();
            unmute();
        }
        if (!loaded){
            return;
        }
        if (muted){
            unmute();
            muted=false;
        }
        else {
            mute();
            muted=true;
        }
    }

function unmute(){
    image.classList.remove("bw-filter");
    gainNode.gain.value = "1";
    console.log(gainNode)
    if (filename){
        nowplaying.innerHTML=filename
    }
}

function mute(){
    image.classList.add("bw-filter");
    gainNode.gain.value = "0";
    console.log(gainNode)
    nowplaying.innerHTML="[click the harpist to unmute]";

}