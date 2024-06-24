let header = document.createElement('div');
function createHeader(home, lessons, game, test) {
    header.innerHTML = `
        <div class="blur"></div>
        <div class="container">
            <div class="logo"  style="font-family: courier;">
                <h2>Key<span>Flow</span></h2>
            </div>
            <div class="nav">
                <ul>
                    <li><a href="${home}index.html">Home</a></li>
                    <li><a href="${lessons}lesson.html">Lessons</a></li>
                    <li><a href="${game}index.html">Game</a></li>
                    <li><a href="${test}TypingTest.html">Typing Test</a></li>
                </ul>
                <div class="toggle">
                    <i class="fas fa-bars toggle-menu"></i>
                </div>
            </div>
        </div>
        <div class="menu">
            <ul>
                <li><a href="${home}index.html">Home</a></li>
                <li><a href="${lessons}lesson.html">Lessons</a></li>
                <li><a href="${game}index.html">Game</a></li>
                <li><a href="${test}TypingTest.html">Typing Test</a></li>
            </ul>
        </div>
    `;
    document.getElementById('header').appendChild(header);
}


menuButton = document.querySelector('#header .nav .toggle-menu');
// toggle.addEventListener(('mouseDown', () => {
//     console.log('toggle clicked');
//     menu.style.height = '100%';
// }))
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-menu')) {
        document.querySelector('.header .menu').classList.toggle('active');
    } else {
        document.querySelector('.header .menu').classList.remove('active');
    }
});


document.addEventListener('scroll', () => {
    if (window.scrollY >= '100') {
        header.classList.remove('show');
        header.classList.add('disappear');
    } else {
        header.classList.remove('disappear');
        header.classList.add('show');
    }
});
