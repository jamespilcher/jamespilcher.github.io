var currentUrl = window.location.href;

root = currentUrl.split("/").slice(0, 3).join("/");

jpilcher = "JPilcher"
// if window size < 600px, use JP
if (window.innerWidth < 600) {
    jpilcher = "JP"
}

// Use font-size for navbar scaling if window width < 800px
if (window.innerWidth < 800) {
    document.write(`<style>
        nav, nav ul, nav li {
            font-size: 0.9em !important;
        }
        nav .logo {
            font-size: 2em !important;
        }
        .logoimage {
            position: absolute;
            top: 1.2rem;
            height: 1.5rem;
            padding-left: .5rem;
        }
    </style>`);
}

document.write(`
<link href="https://fonts.cdnfonts.com/css/pp-neue-montreal" rel="stylesheet">
                                                
<link href="https://fonts.cdnfonts.com/css/super-dream" rel="stylesheet">

<nav>
    <ul class="left">
        <a href="${root}/home" class="logo"
        >${jpilcher}<img src="${root}/res/jim.png" class="logoimage"/></a>
    </ul>
    <ul>
        <li><a href="${root}/codeArt">codeArt</a></li>
        <li><a href="https://roundapples.substack.com/t/poetry" target="_blank">poetry</a></li>
        <li><a href="https://open.spotify.com/artist/7hbK21OWNLxqGvtKRQtNdH?si=xihJsVwhRZ6ob56-2kU71w" target="_blank">music</a></li>
        <li><button id="radioPlayer" onclick="playRadio()" data-tooltip="Unmute Me!"><div id="radioEmoji">📻🔇</div></button></li>    
    </ul>
</nav>
<br>
<script src="${root}/radio/radio.js"></script>
`);
