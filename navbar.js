var currentUrl = window.location.href;
root = currentUrl.split("/").slice(0, 3).join("/");

jpilcher = "JPilcher"
// if window size < 600px, use JP
if (window.innerWidth < 600) {
    jpilcher = "JP"
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
        <li><a href="https://roundapples.substack.com/t/poetry" target="_blank">poetry</a></li>
        <li><a href="${root}/codeArt">codeArt</a></li>
        <li><a href="${root}/music">music</a></li>
        <li><button id="radioPlayer" onclick="playRadio()" data-tooltip="Unmute Me!"><div id="radioEmoji">📻🔇</div></button></li>    
    </ul>
</nav>
<script src="${root}/radio/radio.js"></script>
`);
