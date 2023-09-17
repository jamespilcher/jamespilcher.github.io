let currentUrl = window.location.href;
root = currentUrl.split("/").slice(0, 3).join("/");

jpilcher = "JPilcher"
blog = "blog/other"
// if window size < 600px, use JP
if (window.innerWidth < 600) {
    jpilcher = "JP"
    blog = "blog"
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
        <li><a href="${root}/blog">${blog}</a></li>
        <li><a href="${root}/codeArt">codeArt</a></li>
        <li><a href="${root}/music">music</a></li>
    </ul>
</nav>

`);
