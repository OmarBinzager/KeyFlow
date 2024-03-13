let header = document.createElement('div');
function createHeader() {
    header.innerHTML = `
        <div class="blur"></div>
        <div class="container">
            <div class="logo">
                <h2>Key<span>Flow</span></h2>
            </div>
            <div class="nav">
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="/pages/lesson.html">Lessons</a></li>
                    <li><a href="#">Games</a></li>
                    <li><a href="#">Typing Test</a></li>
                </ul>
                <div>
                    <a href="#" class="sign"><span>Sign in</span></a>
                </div>
                <div class="toggle">
                    <i class="fas fa-bars toggle-menu"></i>
                </div>
            </div>
        </div>
        <div class="menu">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="/pages/lesson.html">Lessons</a></li>
                <li><a href="#">Games</a></li>
                <li><a href="#">Typing Test</a></li>
                <li><a href="#" class="sign"><span>Sign in</span></a></li>
            </ul>
        </div>
    `;
    document.getElementById('header').appendChild(header);
}

createHeader();

let menu = document.querySelector('.header .menu');
// toggle.addEventListener(('mouseDown', () => {
//     console.log('toggle clicked');
//     menu.style.height = '100%';
// }))

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-menu')) {
        menu.classList.toggle('active');
    } else {
        menu.classList.remove('active');
    }
});

document.addEventListener('scroll',() => {
    if (window.scrollY >= '100') {
        header.classList.remove('show');
        header.classList.add('disappear');
    } else {
        header.classList.remove('disappear');
        header.classList.add('show');
    }
});
