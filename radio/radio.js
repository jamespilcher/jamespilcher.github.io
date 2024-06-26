var currentUrl = window.location.href;
root = currentUrl.split("/").slice(0, 3).join("/");

var radioButton = document.getElementById("radioPlayer")
var radioEmoji = document.getElementById("radioEmoji")

var currentSong = "";

var muted=true
var first=true
var loaded=false
var songsDataJson = `${root}/radio/song_data.json`;
var songData;
var songs;
let audioContext;
let gainNode;

let currentSongIndex;
let secondsThroughSong = 0;

let currentSeed;

function seeder(str) {
    str = String(str);
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function splitmix32(a) {
    return function() {
      a |= 0;
      a = a + 0x9e3779b9 | 0;
      let t = a ^ a >>> 16;
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ t >>> 15;
      t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
     }
   }

async function fetchSongData() {
    try {
        const response = await fetch(songsDataJson);
        songData = await response.json();

        // shuffle songs based on day
        const now = new Date();
        var seed = seeder(now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate());
        var rand = splitmix32(seed[0]);
        let randomNumbers = Array.from({length: songData.songs.length}, (_, i) => rand());
        const shuffledSongs = songData.songs.sort((a, b) => randomNumbers[songData.songs.indexOf(a)] - randomNumbers[songData.songs.indexOf(b)]);

        songData.songs = shuffledSongs;
        console.log(songData.songs);
        // You can now use song_data in your code
    } catch (error) {
        console.error('Error:', error);
    }
}



async function setUpSongData(){
    await fetchSongData();
}
setUpSongData();


function playRadio(){
    if (!songData){
        console.log("No song data")
        return;
    }
    if (first){
        first=false;
        startRadio();
        muted = false;
    }
    if (!loaded){
        return;
    }
    else {
        mute_unmute();
    }
}

function startRadio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const totalDuration = songData.total_duration;
    const currentTime = Math.floor(Date.now() / 1000);
    const totalElapsedSeconds = (currentTime % totalDuration);
    console.log("Current time: " + currentTime)
    console.log("Total duration: " + totalDuration)
    console.log("Total elapsed seconds: " + totalElapsedSeconds)
    const songs = songData.songs;
    var song;
    // Find the current song based on elapsed time
    let cumulativeDuration = 0;
    console.log("song length: " + songs.length)

    for (let i = 0; i < songs.length; i++) {
        song = songs[i];
        cumulativeDuration += song.duration;
        if (totalElapsedSeconds < cumulativeDuration) {
            secondsThroughSong = totalElapsedSeconds - (cumulativeDuration - song.duration);
        break;
        }
    }
    console.log("Seconds through song: " + secondsThroughSong)
    console.log("total elapsed seconds: " + totalElapsedSeconds)
    console.log("cumulative duration: " + cumulativeDuration)
    console.log("song duration: " + song.duration)
    mute_unmute();
    playSongAtTime(song.filename, secondsThroughSong);
}


async function playSongAtTime(song, startTime) {
    currentSong = song;
    radioButton.setAttribute('data-tooltip', currentSong);
    const filePath = `${root}/radio/songs/${song}`;
    
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
    //   if (!muted){
    //     nowplaying.innerHTML=filename;
    //   }
    console.log(sourceNode)
    loaded=true;
    // Wait for the song to end before playing the next one
    await new Promise(resolve => {
        sourceNode.onended = resolve;
    });

    // When the current song ends, play the next song
    songs = songData.songs;
    currentSongIndex = songs.findIndex(s => s.filename === song);
    next_song = songs[(currentSongIndex + 1) % songs.length].filename;
    await playSongAtTime(next_song, 0); // Continue with the next song
    } catch (error) {
    console.error('Error fetching or playing file:', error);
    }
}
async function mute_unmute(){
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
    gainNode.gain.value = "1";
    radioEmoji.innerHTML = "📻🔊"
    radioButton.setAttribute('data-tooltip', currentSong);
    console.log(gainNode)
}

function mute(){
    gainNode.gain.value = "0";
    radioEmoji.innerHTML = "📻🔇"
    radioButton.setAttribute('data-tooltip', "Unmute Me!");
    console.log(gainNode)
}

