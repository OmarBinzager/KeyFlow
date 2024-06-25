// declaration
let lessonData;
let lessonInfo = {
    type: '',
    name: '',
    text: '',
    level: 0,
    speed: 0,
    goal_wpm: 0,
    min_wpm: 0,
    accuracy: 0,
};
let words;
let totalLetters;
let lines = [];
let tokens = [];
let cur_line;
let cur_token;
let upperKeyboard = false;
let cur_letter;
let cur_lesson;
let ar_cur_lesson;
let KeyboardLetters = document.querySelectorAll(
    '.keyboard .edc-st1.edc-st2.bld'
);
let sideKeyboardLetters = document.querySelectorAll('.followed');
let activeKeyLetter;
let wrongLetter;
let correctLetter;
let indexes = { cur_line_index: 0, cur_token_index: 0, cur_letter_index: 0 };
// let cur_token_index_in_line = 0;
let holderIndexToken = 0;
const fixedUpDownS = 0.4;
const fixedUpDown = 75 + fixedUpDownS;
let margintop = 0;
let cur_level = 0;
if (localStorage.cur_level) {
    cur_level = parseInt(localStorage.cur_level);
} else {
    localStorage.setItem('cur_level', 0);
}
let ar_cur_level = 0;
if (localStorage.ar_cur_level) {
    ar_cur_level = parseInt(localStorage.ar_cur_level);
} else {
    localStorage.setItem('ar_cur_level', 0);
}
let canType = true;
let canBack = false;
let keydown = 0;
let wrongLettersCount = 0;
let rightLettersCount = 0;
let accuracy = 0;
let speed = 0;
let duration = 0.0;
let seconds = 0;
let durationCounter;
let started = false;
let lessonsList = document.querySelector(
    '.lesson-levels .container .cards-list'
);
let lessonsLevelsScreen = document.querySelector('.lesson-levels');
let shiftRightKey = document.querySelectorAll('.shift-right');
let shiftLeftKey = document.querySelectorAll('.shift-left');
let neutralRight = document.getElementById('neutral-right');
let neutralLeft = document.getElementById('neutral-left');
let text_container = document.querySelector('.text-container.typable');
let progress = document.querySelector('#progress');
let lowAcurracyPopup = document.querySelector('.low-accuracy');
let resultScreen = document.querySelector('.end-lesson');
let timeRsult = document.querySelector('.result .time .info .time');
let starsHolder = document.querySelectorAll('.end-lesson .popup .rate i');
let nextButton = document.querySelector('.end-lesson .popup button.next');
let prevButton = document.querySelector('.end-lesson .popup button.prev');
let congrats = document.querySelector('.end-lesson .popup p.final-word');
let typingLessonContent = document.getElementById('typing-lesson-content');
let videoLessonContent = document.getElementById('video-lesson-content');
let loadingScreen = document.querySelector('.loading-screen');
let play_bause_btn = document.querySelector('.control-bar .btns .play');
let lessonName = document.querySelector('.control-bar p');
let langButtons = document.querySelectorAll('input[type=radio].lang');

let wait = null;
let storeLessonData;

// langButtons.forEach((l) => {
//     l.onclick = ListLessonsCards();
// });
getLessons();
function ListLessonsCards(lessons) {
    // let langRadio = document.querySelector('input[type=radio].lang:checked').value;
    // print(langRadio);
    // if (langRadio == 'en') {
    //     localStorage.isArabic = false;
    // } else {
    //     localStorage.isArabic = true;
    // }
    let progress = [];

    if (localStorage.isArabic == 'false') {
        progress = JSON.parse(localStorage.lessonsProgress);
    } else {
        progress = JSON.parse(localStorage.ArLessonsProgress);
    }
    // print('cleared with lang: ' + lessons[2].name);
    lessonsList.innerHTML = '';
    lessons.forEach((l, index) => {
        generateLessonCard(
            l.level,
            l.name,
            l.goal_wpm,
            l.type === 'video',
            (index > cur_level && localStorage.isArabic == 'false') ||
                (index > ar_cur_level && localStorage.isArabic == 'true'),
            progress.filter((l) => l.lessonId == index)[0]
        );
    });
}
function generateLessonCard(
    id,
    title,
    reqSpeed,
    isVideo = false,
    notAccessed,
    lessonInfo
) {
    let card = '';
    if (isVideo) {
        card = `
            <div class="stars">
            </div>
            <div class="text">
                <h4 class="title">${id}: ${title}</h4>
                <p class="requiered">Video Lesson</p>
            </div>
        `;
    } else {
        if (notAccessed) {
            card = `
            <div class="stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <div class="text">
                <h4 class="title">${id}: ${title}</h4>
                <p class="requiered">Goal: <span>${reqSpeed}</span>wpm</p>
            </div>
        `;
        } else {
            if (lessonInfo != undefined) {
                stars = '';
                if (lessonInfo.stars > 0) {
                    for (var i = 1; i <= 5; i++) {
                        if (i <= lessonInfo.stars) {
                            stars += `<i class="fas fa-star active"></i>`;
                        } else {
                            stars += `<i class="fas fa-star"></i>`;
                        }
                    }
                } else {
                    stars = `
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                `;
                }
                card = `
            <div class="stars">
                ${stars}
            </div>
            <div class="text">
                <h4 class="title">${id}: ${title}</h4>
                ${
                    reqSpeed != undefined
                        ? `<p class="requiered">speed: <span>${lessonInfo.speed}</span>wpm<br>
                                        accuracy: ${lessonInfo.accuracy}%</p>`
                        : 'Video Lesson'
                }
            </div>
        `;
            } else {
                card = `
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="text">
                        <h4 class="title">${id}: ${title}</h4>
                        <p class="requiered">Goal: <span>${reqSpeed}</span>wpm</p>
                    </div>
                `;
            }
        }
    }
    let lessonCard = document.createElement('div');
    lessonCard.classList.add('lesson-card');
    if (notAccessed) {
        lessonCard.classList.add('not-accessed');
    }
    if (isVideo) {
        lessonCard.classList.add('video');
    }
    lessonCard.dataset.id = id;
    lessonCard.innerHTML = card;
    lessonsList.appendChild(lessonCard);
    if (!notAccessed) {
        lessonCard.onclick = function () {
            lessonsLevelsScreen.classList.add('hide');
            loadingScreen.classList.add('active');
            let lessonId = this.dataset.id;
            if (localStorage.isArabic == 'false') {
                cur_lesson = lessonId;
            } else {
                ar_cur_lesson = lessonId;
            }
            getLesson(lessonId);
        };
    }
}
// getLesson(lessonInfo, lessonId = undefined);
function handleLesson(lessonData) {
    lessonInfo.type = lessonData.type;
    lessonInfo.name = lessonData.name;
    lessonInfo.level = lessonData.level;
    lessonName.innerHTML = `Lesson ${lessonInfo.level}: ${lessonInfo.name}`;
    if (lessonInfo.type === 'video') {
        typingLessonContent.style.display = 'none';
        videoLessonContent.classList.add('active');
        lessonInfo.link = lessonData.link;
        showVideo(lessonInfo.link);
    } else {
        lessonInfo.text = lessonData.text;
        lessonInfo.stars = lessonData.stars;
        lessonInfo.speed = lessonData.speed;
        lessonInfo.goal_wpm = lessonData.goal_wpm;
        lessonInfo.min_wpm = lessonData.min_wpm;
        lessonInfo.accuracy = lessonData.accuracy;
        videoLessonContent.classList.remove('active');
        typingLessonContent.style.display = 'block';
        //
        lessonInfo.type;
        words = lessonInfo.text.split(' ');
        totalLetters = lessonInfo.text.length;
        generateLesson(lessonInfo);
        cur_line = lines[0];
        cur_token = tokens[0];
        cur_letter = cur_token.children[0];
        setLetter(cur_letter.textContent);
        cur_letter.classList.add('cur');
    }
}
function backToLessonsList() {
    loadingScreen.classList.add('active');
    lessonsLevelsScreen.classList.add('hide');
    getLessons();
    typingLessonContent.style.display = 'none';
    holderIndexToken = 0;
    margintop = 0;
    tokens = [];
    indexes = { cur_line_index: 0, cur_token_index: 0, cur_letter_index: 0 };
    canType = true;
    canBack = false;
    keydown = 0;
    wrongLettersCount = 0;
    rightLettersCount = 0;
    accuracy = 0;
    seconds = 0;
    speed = 0;
    duration = 0.0;
    started = false;
    wait = null;
    text_container.style.marginTop = '0';
    resultScreen.classList.remove('active');
    const wrapper = document.querySelectorAll('.result .progress');
    wrapper.forEach((w) => (w.innerHTML = ''));
    congrats.innerHTML = '';
    lessonName.innerHTML = `Lesson ${lessonInfo.level}: ${lessonInfo.name}`;
    starsHolder.forEach((s) => s.classList.remove('filled'));
    increaseProgress();
    lessonsLevelsScreen.classList.remove('hide');
    loadingScreen.classList.remove('active');
}
function getLesson(id) {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let handleLessons = JSON.parse(this.responseText);
            handleLesson(handleLessons.lessons[id]);
            startLesson();
            loadingScreen.classList.remove('active');
        }
    };
    if (localStorage.isArabic == undefined)
        localStorage.setItem('isArabic', false);
    else {
        if (localStorage.isArabic == 'true') {
            myRequest.open('GET', '../js/lessons-ar.json', true);
            text_container.style.direction = 'rtl';
            convertKeyboardToArabic();
        } else {
            myRequest.open('GET', '../js/lessons-en.json', true);
            text_container.style.direction = 'ltr';
            convertKeyboardToEnglish();
        }
    }
    myRequest.send();
}

function getLessons() {
    lessonsLevelsScreen.classList.add('hide');
    loadingScreen.classList.add('active');
    let langRadio = document.querySelector(
        'input[type=radio].lang:checked'
    ).value;
    // print(langRadio);
    if (langRadio == 'en') {
        localStorage.isArabic = false;
        text_container.style.direction = 'ltr';
    } else {
        localStorage.isArabic = true;
        text_container.style.direction = 'rtl';
    }
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let handleLessons = JSON.parse(this.responseText);
            print(handleLesson);
            ListLessonsCards(handleLessons.lessons);
            lessonsLevelsScreen.classList.remove('hide');
            loadingScreen.classList.remove('active');
            // if (localStorage.lesson_number) {
            //     lessonData = handleLessons.lessons[localStorage.lesson_number];
            // } else {
            //     lessonData = handleLessons.lessons[handleLessons.lesson_id];
            //     localStorage.setItem('lesson_number', 0);
            // }
            // handleLesson(lessonData);
            // lessonObj.type = lessonData.type;
            // lessonObj.name = lessonData.name;
            // lessonObj.level = lessonData.level;
            // lessonName.innerHTML = `Lesson ${lessonInfo.level}: ${lessonInfo.name}`;
            // if (lessonObj.type === 'video') {
            //     typingLessonContent.style.display = 'none';
            //     videoLessonContent.classList.add('active');
            //     lessonObj.link = lessonData.link;
            //     showVideo(lessonObj.link);
            // } else {
            //     lessonObj.text = lessonData.text;
            //     lessonObj.stars = lessonData.stars;
            //     lessonObj.speed = lessonData.speed;
            //     lessonObj.goal_wpm = lessonData.goal_wpm;
            //     lessonObj.min_wpm = lessonData.min_wpm;
            //     lessonObj.accuracy = lessonData.accuracy;
            //     videoLessonContent.classList.remove('active');
            //     typingLessonContent.style.display = 'block';
            //     //
            //     lessonObj.type;
            //     words = lessonObj.text.split(' ');
            //     totalLetters = lessonObj.text.length;
            //     generateLesson(lessonObj);
            //     cur_line = lines[0];
            //     cur_token = tokens[0];
            //     cur_letter = cur_token.children[0];
            //     setLetter(cur_letter.textContent);
            //     cur_letter.classList.add('cur');
            // }
        }
    };
    if (localStorage.isArabic == undefined)
        localStorage.setItem('isArabic', false);
    else {
        if (localStorage.isArabic == 'true') {
            myRequest.open('GET', '../js/lessons-ar.json', true);
            text_container.style.direction = 'rtl';
            convertKeyboardToArabic();
        } else {
            myRequest.open('GET', '../js/lessons-en.json', true);
            text_container.style.direction = 'ltr';
            convertKeyboardToEnglish();
        }
    }
    myRequest.send();
}
function showVideo(link) {
    let video = videoLessonContent.children[0];
    canType = false;
    canBack = false;
    video.setAttribute('src', link);
    setTimeout(() => {
        video.play();
    }, 3 * 1000);
    video.addEventListener('ended', () => {
        nextLesson();
    });
}
function restartLesson() {
    lowAcurracyPopup.classList.contains('active')
        ? lowAcurracyPopup.classList.remove('active')
        : null;
    holderIndexToken = 0;
    margintop = 0;
    tokens = [];
    indexes = { cur_line_index: 0, cur_token_index: 0, cur_letter_index: 0 };
    canType = true;
    canBack = false;
    keydown = 0;
    wrongLettersCount = 0;
    rightLettersCount = 0;
    accuracy = 0;
    seconds = 0;
    speed = 0;
    duration = 0.0;
    started = false;
    wait = null;
    if (localStorage.isArabic == 'false') {
        getLesson(cur_lesson);
    } else {
        getLesson(ar_cur_lesson);
    }
    text_container.style.marginTop = '0';
    resultScreen.classList.remove('active');
    const wrapper = document.querySelectorAll('.result .progress');
    wrapper.forEach((w) => (w.innerHTML = ''));
    congrats.innerHTML = '';
    lessonName.innerHTML = `Lesson ${lessonInfo.level}: ${lessonInfo.name}`;
    starsHolder.forEach((s) => s.classList.remove('filled'));
    increaseProgress();
}
const typeSound = new AudioContext();

function typeSoundStart() {
    // Load the sound file asynchronously
    fetch('../js/sounds/typewriter.mp3')
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => typeSound.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            const source = typeSound.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(typeSound.destination);
            source.start(); // Play the sound
        });
}
const errorSound = new AudioContext();

function errorSoundStart() {
    // Load the sound file asynchronously
    fetch('../js/sounds/error.mp3')
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => errorSound.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            const source = errorSound.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(errorSound.destination);
            source.start(); // Play the sound
        });
}
const starSound = new AudioContext();

function StarSoundStart() {
    // Load the sound file asynchronously
    fetch('../js/sounds/success_bell-6776 (1).mp3')
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => errorSound.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            const source = errorSound.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(errorSound.destination);
            source.start(); // Play the sound
        });
}

function handleInputs(e) {
    if (!canType) {
        e.preventDefault();
        return;
    }
    if (!canBack) {
        stopTyping();
    } else if (!started) {
        startTyping();
    }
    let i = 0;
    if (wait !== null) {
        clearInterval(wait);
        wait = null;
    } else {
        wait = setInterval(() => {
            i++;
            if (i === 5) {
                stopTyping();
                clearInterval(wait);
            }
        }, 1000);
    }
    if (checkNotForbiddenLetter(e.key)) {
        checkInput(e.key);
    } else if (e.key === ' ') {
        checkInput('space');
    } else if (e.key === 'Backspace' && canBack) {
        backspace();
    }
    if (wrongLettersCount >= 35) {
        lowAcurracy();
    }
    e.preventDefault();
}
function startLesson() {
    window.addEventListener('keydown', handleInputs);
}

function lowAcurracy() {
    canBack = false;
    canType = false;
    lowAcurracyPopup.classList.add('active');
}
function checkNotForbiddenLetter(key) {
    // print(key);
    return (
        key !== 'Shift' &&
        key !== 'Backspace' &&
        key !== 'CapsLock' &&
        key !== 'Control' &&
        key !== ' ' &&
        key !== 'ArrowRight' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowUp' &&
        key !== 'ArrowDown' &&
        key !== 'PageDown' &&
        key !== 'PageUp' &&
        key !== 'Insert' &&
        key !== 'Home' &&
        key !== 'End' &&
        key !== 'Delete' &&
        key !== 'NumLock' &&
        key !== 'Clear' &&
        key !== 'MediaPlayPause' &&
        key !== 'MediaTrackNext' &&
        key !== 'MediaTrackPrevious' &&
        key !== 'AudioVolumeUp' &&
        key !== 'AudioVolumeDown' &&
        key !== 'Alt' &&
        key !== 'F12' &&
        key !== 'F11' &&
        key !== 'F10' &&
        key !== 'F9' &&
        key !== 'F8' &&
        key !== 'F7' &&
        key !== 'F6' &&
        key !== 'F5' &&
        key !== 'F4' &&
        key !== 'F3' &&
        key !== 'F2' &&
        key !== 'Escape'
    );
}
/*
1 Star (Very Weak): "Meh, it could be better." (Lowers expectations)

2 Stars (Mediocre): "Not bad, but there's room for improvement." (Constructive criticism)

3 Stars (Average): "Good job! You did the basics well." (Acknowledgement of effort)

4 Stars (Very Good): "Impressive! This is a solid achievement." (Highlights quality)

5 Stars (Excellent): "Outstanding! You absolutely nailed it!" (Enthusiastic praise)
*/
if (!localStorage.lessonsProgress) {
    let progress = [];
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
}
if (!localStorage.ArLessonsProgress) {
    let progress = [];
    localStorage.setItem('ArLessonsProgress', JSON.stringify(progress));
}
if (!localStorage.isArabic) {
    let isArabic = false;
    localStorage.setItem('ArLessonsProgress', isArabic);
}
let congStatement = [
    "<b>Don't give up!</b> There's always another chance to shine.",
    '<b>Meh,</b> it could be better.',
    "<b>Not bad</b>, but there's room for improvement.",
    '<b>Good job!</b> You did the basics well.',
    '<b>Impressive!</b> This is a solid achievement.',
    '<b>Outstanding!</b> You absolutely nailed it!',
];
function showResult() {
    let lessonResult = {
        lessonId: lessonInfo.level,
        accuracy: 0,
        speed: 0,
        stars: 0,
    };
    let starsCount = 0;
    Math.floor(accuracy) == 100 && speed >= lessonInfo.min_wpm
        ? starsCount++
        : (starsCount = 0);
    speed == lessonInfo.min_wpm
        ? (starsCount += 1)
        : speed > lessonInfo.min_wpm && speed < lessonInfo.goal_wpm
        ? (starsCount += 2)
        : speed == lessonInfo.goal_wpm
        ? (starsCount += 3)
        : speed > lessonInfo.goal_wpm
        ? (starsCount += 4)
        : (starsCount = 0);
    congrats.innerHTML = congStatement[starsCount];
    let index = 0;
    if (starsCount > 0) {
        let setStars = setInterval(() => {
            starsHolder[index++].classList.add('filled');
            StarSoundStart();
            starsCount--;
            if (starsCount < 1) {
                clearInterval(setStars);
            }
        }, 500);
        enabledButton(nextButton);
    } else {
        disabledButton(nextButton);
    }
    let minutes = Math.floor(seconds / 60);
    let second = seconds % 60;
    timeRsult.innerHTML = `${minutes}:${second < 10 ? `0${second}` : second}`;
    const wrapper = document.querySelectorAll('.result .progress');
    const barCount = 50;
    const percent1 = (barCount * Math.round(accuracy)) / 100;
    const percent3 = (barCount * speed) / lessonInfo.goal_wpm;

    for (let index = 0; index < barCount; index++) {
        const className = index < percent1 ? 'selected1' : '';
        wrapper[0].innerHTML += `<i style="--i: ${index};" class="${className}"></i>`;
    }
    accuracy = Math.floor(accuracy) >= 100 ? 100 : Math.floor(accuracy);
    wrapper[0].innerHTML += `<div class='info'><p class="selected percent-text text1">${accuracy}
    <span>%</span></p><h4 class="acc">Accuracy</h4></div>`;

    for (let index = 0; index < barCount; index++) {
        const className = index < percent3 ? 'selected3' : '';
        wrapper[1].innerHTML += `<i style="--i: ${index};" class="${className}"></i>`;
    }

    wrapper[1].innerHTML += `<div class='info'>
    <p class="selected percent-text text3">${speed}<span>wpm</span></p>
    <h4 class="speed">Speed</h4>
    <span class="goal">Goal: ${lessonInfo.goal_wpm} wpm</span>
    <span class="req-speed">Min Speed: ${lessonInfo.min_wpm} wpm</span>
    </div>`;
    lessonResult.accuracy = accuracy;
    lessonResult.speed = speed;
    lessonResult.stars = starsCount;
    let progress = [];
    if (localStorage.isArabic == 'false') {
        if (localStorage.lessonsProgress) {
            progress = JSON.parse(localStorage.lessonsProgress);
            if (cur_lesson == cur_level) {
                progress.push(lessonResult);
            } else {
                progress.map((p, i) => {
                    if (cur_lesson == p.lessonId) {
                        progress.splice(index, 1, lessonResult);
                    }
                });
            }
        }
        localStorage.setItem('lessonsProgress', JSON.stringify(progress));
        if (cur_level == cur_lesson) {
            cur_level++;
            localStorage.cur_level = cur_level;
        }
    } else {
        if (localStorage.ArLessonsProgress) {
            progress = JSON.parse(localStorage.ArLessonsProgress);
            if (ar_cur_lesson == ar_cur_level) {
                progress.push(lessonResult);
                print('pushed arabic');
            } else {
                progress.map((p, i) => {
                    if (ar_cur_lesson == p.lessonId) {
                        progress.splice(index, 1, lessonResult);
                    }
                });
                print('inserted arabic');
            }
        }
        localStorage.setItem('ArLessonsProgress', JSON.stringify(progress));
        if (ar_cur_level == ar_cur_lesson) {
            ar_cur_level++;
            localStorage.ar_cur_level = ar_cur_level;
        }
    }
}
function checkInput(inputLetter) {
    cur_letter.classList.remove('cur');
    if (inputLetter === 'Tab' || inputLetter === 'Enter') {
        setWrongLetter(inputLetter.toLowerCase());
        cur_letter.classList.add('err');
    } else {
        if (
            localStorage.isArabic === 'true' &&
            inputLetter === 'Unidentified'
        ) {
            if ('ل' === cur_letter.textContent) {
                setCorrectLetter(inputLetter.toLowerCase());
                if (cur_letter.classList.contains('e-v'))
                    cur_letter.classList.add('err-vld');
                else cur_letter.classList.add('vld');
                increaseLetterIndex();
            }
        } else if (inputLetter === cur_letter.textContent) {
            setCorrectLetter(inputLetter.toLowerCase());
            if (cur_letter.classList.contains('e-v'))
                cur_letter.classList.add('err-vld');
            else cur_letter.classList.add('vld');
        } else if (inputLetter === 'space' && cur_letter.innerHTML.length > 1) {
            setCorrectLetter(inputLetter);
            if (cur_letter.classList.contains('e-v'))
                cur_letter.classList.add('err-vld');
            else cur_letter.classList.add('vld');
        } else {
            setWrongLetter(inputLetter.toLowerCase());
            cur_letter.classList.add('err');
        }
    }
    let letterIndex = increaseLetterIndex();
    if (canType) {
        cur_letter = cur_token.children[letterIndex];
        if (cur_letter.innerHTML.length > 1) setLetter('space');
        else setLetter(cur_letter.textContent);
        cur_letter.classList.add('cur');
    }
    keydown++;
    increaseProgress();
    canBack = true;
    // print(indexes);
    // print(inputLetter);
    // print(cur_token)
    // print(cur_letter);
}
function backspace() {
    cur_letter.classList.remove('cur');
    let letterIndex = decreaseLetterIndex();
    if (canBack) {
        typeSoundStart();
        cur_letter = cur_token.children[letterIndex];
        if (cur_letter.classList.contains('err')) {
            cur_letter.classList.add('e-v');
            wrongLettersCount--;
        }
        if (cur_letter.classList.contains('vld')) {
            cur_letter.classList.remove('vld');
            rightLettersCount--;
        }
        cur_letter.classList.contains('err')
            ? cur_letter.classList.remove('err')
            : '';
        cur_letter.classList.contains('err-vld')
            ? cur_letter.classList.remove('err-vld')
            : '';
        if (cur_letter.innerHTML.length > 1) setLetter('space');
        else setLetter(cur_letter.textContent);
        cur_letter.classList.add('cur');
        keydown--;
        increaseProgress();
    }
}
function increaseProgress() {
    progress.style.width = `${(keydown / totalLetters) * 100}%`;
}
function increaseLetterIndex() {
    const length = cur_token.children.length;
    if ((indexes.cur_letter_index + 1) % cur_token.children.length == 0) {
        let tokenIndex = ++indexes.cur_token_index;
        if (tokenIndex < tokens.length) {
            cur_token = tokens[tokenIndex];
            holderIndexToken++;
            if (holderIndexToken === cur_line.children.length) {
                holderIndexToken = 0;
                cur_line = lines[++indexes.cur_line_index];
                if (
                    indexes.cur_line_index >= 2 &&
                    indexes.cur_line_index < lines.length
                )
                    downText();
            }
        }
    }
    if (
        cur_token == tokens[tokens.length - 1] &&
        cur_letter == cur_token.children[cur_token.children.length - 1]
    ) {
        endLesson();
    }
    return (indexes.cur_letter_index = (indexes.cur_letter_index + 1) % length);
}
function downText() {
    let start = 0;
    let slowly = setInterval(() => {
        text_container.style.marginTop = `${margintop--}px`;
        start++;
        if (start >= 75) {
            text_container.style.marginTop = `${(margintop -= fixedUpDownS)}px`;
            clearInterval(slowly);
        }
    }, 300 / fixedUpDown);
    // margintop -= fixedUpDown;
}
function upText() {
    let start = 0;
    let slowly = setInterval(() => {
        text_container.style.marginTop = `${margintop++}px`;
        start++;
        if (start >= 75) {
            text_container.style.marginTop = `${(margintop += fixedUpDownS)}px`;
            clearInterval(slowly);
        }
    }, 300 / fixedUpDown);
}
function decreaseLetterIndex() {
    let index = --indexes.cur_letter_index;
    if (index < 0) {
        let tokenIndex = --indexes.cur_token_index;
        holderIndexToken--;
        if (tokenIndex >= 0) {
            cur_token = tokens[tokenIndex];
            indexes.cur_letter_index = cur_token.children.length - 1;
            index = indexes.cur_letter_index;
        } else {
            canBack = false;
            cur_letter.classList.add('cur');
        }
    }
    if (holderIndexToken < 0 && indexes.cur_line_index > 0) {
        cur_line = lines[--indexes.cur_line_index];
        holderIndexToken = cur_line.children.length - 1;
        indexes.cur_line_index < 1 ? null : upText();
    }
    return index;
}
function setWrongLetter(wrongLet) {
    wrongLettersCount++;
    errorSoundStart();
    setKeyWrong(wrongLet);
    incorrectLetterShow(wrongLetter);
    setTimeout(() => {
        incorrectLetterHide(wrongLetter);
    }, 200);
}
function play() {
    /* <i class="fa-solid fa-play"></i><i class="fa-solid fa-pause"></i> */
    play_bause_btn.classList.add('played');
    play_bause_btn.classList.remove('baused');
    started = true;
    durationCounter = setInterval(() => {
        duration += 0.0166666667;
        seconds++;
        accuracy = (rightLettersCount / keydown) * 100;
        speed = Math.round((keydown / (duration * 5)) * (accuracy / 100));
    }, 1000);
}
function bause() {
    play_bause_btn.classList.remove('played');
    play_bause_btn.classList.add('baused');
    started = false;
    clearInterval(durationCounter);
}
function playBause() {
    if (started) {
        bause();
    } else {
        play();
    }
}
window.onload = function () {
    typingLessonContent.style.display = 'none';
};
function endLesson() {
    stopTyping();
    canType = false;
    resultScreen.classList.add('active');
    showResult();
    window.removeEventListener('keydown', handleInputs);
}
function nextLesson() {
    if (videoLessonContent.classList.contains('active')) {
        videoLessonContent.classList.remove('active');
        videoLessonContent.children[0].pause();
    }
    loadingScreen.classList.add('active');
    if (localStorage.isArabic == 'false') {
        if (cur_lesson <= 614 && cur_level <= 614) {
            // print("Yes");
            if (cur_level == cur_lesson) {
                cur_level++;
                localStorage.cur_level = cur_level;
            }
            cur_lesson++;
        } else {
            disabledButton(nextButton);
        }
    } else {
        if (ar_cur_lesson <= 365 && ar_cur_level <= 365) {
            // print("Yes");
            if (ar_cur_level == ar_cur_lesson) {
                ar_cur_level++;
                localStorage.ar_cur_level = ar_cur_level;
            }
            ar_cur_lesson++;
        } else {
            disabledButton(nextButton);
        }
    }
    restartLesson();
    loadingScreen.classList.remove('active');
}
function disabledButton(button) {
    button.classList.add('disabled');
    button.disabled = true;
}
function enabledButton(button) {
    button.classList.remove('disabled');
    button.disabled = false;
}
function previousLesson() {
    cur_lesson--;
    restartLesson();
}
function setCorrectLetter(letter) {
    rightLettersCount++;
    typeSoundStart();
    setKeyCorrect(letter);
    correctLetterShow(correctLetter);
    setTimeout(() => {
        correctLetterHide(correctLetter);
    }, 200);
}
function generateLesson(lessonInfo) {
    const line = document.createElement('span');
    line.classList.add('line');
    for (let i = 0; i < words.length; i++) {
        const token = document.createElement('span');
        token.classList.add('token');
        for (let j = 0; j < words[i].length; j++) {
            const letter = document.createElement('span');
            letter.classList.add('letter');
            letter.innerHTML = words[i][j];
            token.appendChild(letter);
        }
        const endSpace = document.createElement('span');
        endSpace.classList.add('letter');
        endSpace.innerHTML = '&nbsp;<i></i>';
        token.appendChild(endSpace);
        tokens.push(token);
    }
    setLines();
}

window.addEventListener('resize', (e) => setLines());

function setLines() {
    lines = null;
    text_container.innerHTML = '';
    let currentLine = document.createElement('span');
    currentLine.classList.add('line');
    tokens.forEach((word) => {
        // Check if the current line can fit the word without wrapping
        const currentLineLength = currentLine.textContent.trim().length;
        // print(currentLineLength);
        // print(word.children.length);
        if (
            currentLineLength > 0 &&
            currentLineLength + word.children.length + 1 >
                text_container.offsetWidth / 27
        ) {
            // If it wraps, append the current line and create a new one
            text_container.appendChild(currentLine);
            currentLine = document.createElement('span');
            currentLine.classList.add('line');
        }

        currentLine.appendChild(word);
    });
    // Append the last line (if any)
    if (currentLine.textContent.length > 0) {
        text_container.appendChild(currentLine);
    }
    lines = text_container.children;
    // // Insert the dynamic span after the paragraph
    // paragraphContainer.appendChild(dynamicSpan);
}
function startTyping() {
    play();
}
function stopTyping() {
    bause();
}
function setLetter(letter) {
    // setTimeout(() => {
    if (activeKeyLetter) toggleKeyLetter(activeKeyLetter);
    if (localStorage.isArabic === 'true') {
    }
    // print(letter);
    // print(isUpper(letter))
    // print(!Number.parseInt(letter))
    // print( isShiftChar(letter))
    if (
        (isUpper(letter) && localStorage.isArabic == 'false') ||
        (!Number.parseInt(letter) && isShiftChar(letter))
    ) {
        keyboardToUpper();
        setKeyActive(letter.toLowerCase());
        addActiveKey(activeKeyLetter);
        removeActiveKey(shiftLeftKey);
        removeActiveKey(shiftRightKey);
        unactivateLeftNeutral();
        unctivateRightNeutral();
        if (isRightLetter(letter)) {
            addActiveKey(shiftLeftKey);
        } else {
            addActiveKey(shiftRightKey);
        }
    } else {
        if (localStorage.isArabic == 'true') {
            if (
                shiftLeftKey[0].classList.contains('active') ||
                shiftRightKey[0].classList.contains('active')
            ) {
                removeActiveKey(shiftLeftKey);
                removeActiveKey(shiftRightKey);
            }
            if (isLeftLetter(setArabicKeyActive(letter))) {
                activateRightNeutral();
                unactivateLeftNeutral();
            } else {
                activateLeftNeutral();
                unctivateRightNeutral();
            }
            keyboardToLower();
            activeKeyLetter ? toggleKeyLetter(activeKeyLetter) : null;
        } else {
            if (
                shiftLeftKey[0].classList.contains('active') ||
                shiftRightKey[0].classList.contains('active')
            ) {
                removeActiveKey(shiftLeftKey);
                removeActiveKey(shiftRightKey);
            }
            if (isLeftLetter(setKeyActive(letter))) {
                activateRightNeutral();
                unactivateLeftNeutral();
            } else {
                activateLeftNeutral();
                unctivateRightNeutral();
            }
            keyboardToLower();
            activeKeyLetter ? toggleKeyLetter(activeKeyLetter) : null;
        }
    }
    // }, 0);
}
function isRightLetter(letter) {
    if (localStorage.isArabic == 'false') {
        if (
            letter == 'P' ||
            letter == 'O' ||
            letter == 'I' ||
            letter == 'U' ||
            letter == 'Y' ||
            letter == 'M' ||
            letter == 'N' ||
            letter == 'L' ||
            letter == 'K' ||
            letter == 'J' ||
            letter == 'H' ||
            letter == ':' ||
            letter == '"' ||
            letter == '|' ||
            letter == '+' ||
            letter == '/' ||
            letter == ')' ||
            letter == '(' ||
            letter == '*' ||
            letter == '&' ||
            letter == '^' ||
            letter == '?' ||
            letter == '>' ||
            letter == '<' ||
            letter == '{' ||
            letter == '}'
        )
            return true;
        else return false;
    } else {
        if (
            letter == '؛' || //(>؛×÷‘إأـ،/:"؟.,’آ+_()*&^")
            letter == '×' ||
            letter == '÷' ||
            letter == '‘' ||
            letter == 'إ' ||
            letter == '’' ||
            letter == 'آ' ||
            letter == '/' ||
            letter == '،' ||
            letter == 'ـ' ||
            letter == 'أ' ||
            letter == 'إ' ||
            letter == ':' ||
            letter == '"' ||
            letter == '|' ||
            letter == '+' ||
            letter == '_' ||
            letter == '(' ||
            letter == ')' ||
            letter == '*' ||
            letter == '&' ||
            letter == '^' ||
            letter == '؟' ||
            letter == '.' ||
            letter == ',' ||
            letter == '>' ||
            letter == '<'
        )
            return true;
        else return false;
    }
}
function isLeftLetter(letter) {
    if (localStorage.isArabic == 'false') {
        if (
            letter == '' ||
            letter == 'w' ||
            letter == 'e' ||
            letter == 'r' ||
            letter == 't' ||
            letter == 'a' ||
            letter == 's' ||
            letter == 'd' ||
            letter == 'f' ||
            letter == 'g' ||
            letter == 'z' ||
            letter == 'x' ||
            letter == 'c' ||
            letter == 'v' ||
            letter == 'b' ||
            letter == 'tab' ||
            letter == '~' ||
            letter == '1' ||
            letter == '2' ||
            letter == '3' ||
            letter == '4' ||
            letter == '5'
        )
            return true;
        else return false;
    } else {
        if (
            letter == 'ذ' ||
            letter == '1' ||
            letter == '2' ||
            letter == '3' ||
            letter == '4' ||
            letter == '5' ||
            letter == 'ض' ||
            letter == 'ص' ||
            letter == 'ث' ||
            letter == 'ق' ||
            letter == 'ف' ||
            letter == 'ل' ||
            letter == 'ب' ||
            letter == 'ي' ||
            letter == 'س' ||
            letter == 'ش' ||
            letter == 'ؤ' ||
            letter == 'ر' ||
            letter == 'ء' ||
            letter == 'ئ' ||
            letter == 'لا'
        )
            return true;
        else return false;
    }
}
function isShiftChar(letter) {
    if (
        letter == '+' ||
        letter == '_' ||
        letter == ')' ||
        letter == '(' ||
        letter == '*' ||
        letter == '&' ||
        letter == '^' ||
        letter == '%' ||
        letter == '$' ||
        letter == '#' ||
        letter == '@' ||
        letter == '!' ||
        letter == '}' ||
        letter == '{' ||
        letter == '"' ||
        letter == ':' ||
        letter == '>' ||
        letter == '<' ||
        letter == '~' ||
        letter == '|'
    )
        return true;
    if (localStorage.isArabic == 'false') {
        if (letter == '?' || letter == '~') return true;
        else return false;
    } else {
        if (
            letter == '؛' || //(>؛×÷‘إأـ،/:"؟.,’آ+_()*&^")
            letter == '×' ||
            letter == '÷' ||
            letter == '‘' ||
            letter == 'إ' ||
            letter == '’' ||
            letter == 'آ' ||
            letter == '/' ||
            letter == '،' ||
            letter == 'أ' ||
            letter == 'إ' ||
            letter == '؟' ||
            letter == 'ّ' ||
            letter == 'َ' ||
            letter == 'ً' ||
            letter == 'ُ' ||
            letter == 'ٌ' ||
            letter == 'لإ' ||
            letter == 'ِ' ||
            letter == 'ٍ' ||
            letter == ']' ||
            letter == '[' ||
            letter == 'لأ' ||
            letter == 'لآ' ||
            letter == 'ْ' ||
            letter == '' ||
            letter == '.' ||
            letter == ','
        )
            return true;
        else return false;
    }
}
function toggleKeyLetter(collection) {
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.toggle('active');
    }
}
function removeActiveKey(collection) {
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.remove('active');
    }
}
function addActiveKey(collection) {
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.add('active');
    }
}
function activateLeftNeutral() {
    neutralLeft.classList.add('active');
}
function unactivateLeftNeutral() {
    neutralLeft.classList.remove('active');
}
function activateRightNeutral() {
    neutralRight.classList.add('active');
}
function unctivateRightNeutral() {
    neutralRight.classList.remove('active');
}
function correctLetterShow(collection) {
    for (let i = 0; i < 2; i++) {
        collection[i].classList.add('correct');
    }
}
function incorrectLetterShow(collection) {
    for (let i = 0; i < 2; i++) {
        collection[i].classList.add('incorrect');
    }
}
function correctLetterHide(collection) {
    for (let i = 0; i < 2; i++) {
        collection[i].classList.remove('correct');
    }
}
function incorrectLetterHide(collection) {
    for (let i = 0; i < 2; i++) {
        collection[i].classList.remove('incorrect');
    }
}
// function toggleCase() {
//     // setTimeout(() => {
//     KeyboardLetters[0].innerHTML !== KeyboardLetters[0].innerHTML.toLowerCase()
//         ? KeyboardLetters.forEach(
//               (l) => (l.innerHTML = l.innerHTML.toLowerCase())
//           )
//         : KeyboardLetters.forEach(
//               (l) => (l.innerHTML = l.innerHTML.toUpperCase())
//           );
//     // }, 0);
// }
function keyboardToLower() {
    upperKeyboard == true
        ? KeyboardLetters.forEach(
              (l) => (l.innerHTML = l.innerHTML.toLowerCase())
          )
        : null;
    upperKeyboard = false;
}
function keyboardToUpper() {
    upperKeyboard == false
        ? KeyboardLetters.forEach(
              (l) => (l.innerHTML = l.innerHTML.toUpperCase())
          )
        : null;
    upperKeyboard = true;
}
function convertKeyboardToArabic() {
    KeyboardLetters.forEach((l) => {
        l.innerHTML = keysToArabic(l.textContent.toLowerCase());
    });
    sideKeyboardLetters.forEach((l) => {
        l.innerHTML = sideKeyToArabic(l.textContent.toLocaleLowerCase());
    });
}
function convertKeyboardToEnglish() {
    KeyboardLetters.forEach((l) => {
        l.innerHTML = keysToEnglish(l.textContent.toLowerCase());
    });
    sideKeyboardLetters.forEach((l) => {
        l.innerHTML = sideKeyToEnglish(l.textContent.toLocaleLowerCase());
    });
}
function sideKeyToArabic(letter) {
    let result = '';
    letter === '~'
        ? (result = '')
        : letter === '{'
        ? (result = '<')
        : letter === '}'
        ? (result = '>')
        : letter === '"'
        ? (result = '"')
        : letter === ':'
        ? (result = ':')
        : letter === '?'
        ? (result = '؟')
        : letter === '>'
        ? (result = '.')
        : letter === '<'
        ? (result = ',')
        : letter === ')'
        ? (result = '(')
        : letter === '('
        ? (result = ')')
        : (result = letter);
    return result;
}
function keysToArabic(letter) {
    let result = '';
    letter === '`'
        ? (result = 'ذ')
        : letter === 'q'
        ? (result = 'ض')
        : letter === 'w'
        ? (result = 'ص')
        : letter === 'e'
        ? (result = 'ث')
        : letter === 'r'
        ? (result = 'ق')
        : letter === 't'
        ? (result = 'ف')
        : letter === 'y'
        ? (result = 'غ')
        : letter === 'u'
        ? (result = 'ع')
        : letter === 'i'
        ? (result = 'ه')
        : letter === 'o'
        ? (result = 'خ')
        : letter === 'p'
        ? (result = 'ح')
        : letter === '['
        ? (result = 'ج')
        : letter === ']'
        ? (result = 'د')
        : letter === 'a'
        ? (result = 'ش')
        : letter === 's'
        ? (result = 'س')
        : letter === 'd'
        ? (result = 'ي')
        : letter === 'f'
        ? (result = 'ب')
        : letter === 'g'
        ? (result = 'ل')
        : letter === 'h'
        ? (result = 'ا')
        : letter === 'j'
        ? (result = 'ت')
        : letter === 'k'
        ? (result = 'ن')
        : letter === 'l'
        ? (result = 'م')
        : letter === ';'
        ? (result = 'ك')
        : letter === "'"
        ? (result = 'ط')
        : letter === 'z'
        ? (result = 'ئ')
        : letter === 'x'
        ? (result = 'ء')
        : letter === 'c'
        ? (result = 'ؤ')
        : letter === 'v'
        ? (result = 'ر')
        : letter === 'b'
        ? (result = 'لا')
        : letter === 'n'
        ? (result = 'ى')
        : letter === 'm'
        ? (result = 'ة')
        : letter === ','
        ? (result = 'و')
        : letter === '.'
        ? (result = 'ز')
        : letter === '/'
        ? (result = 'ظ')
        : (result = letter);
    return result;
}

function sideKeyToEnglish(letter) {
    let result = '';
    letter === ''
        ? (result = '~')
        : letter === '<'
        ? (result = '{')
        : letter === '>'
        ? (result = '}')
        : letter === '"'
        ? (result = '"')
        : letter === ':'
        ? (result = ':')
        : letter === '؟'
        ? (result = '?')
        : letter === '.'
        ? (result = '>')
        : letter === ','
        ? (result = '<')
        : letter === '('
        ? (result = ')')
        : letter === ')'
        ? (result = '(')
        : (result = letter);
    return result;
}
function keysToEnglish(letter) {
    let result = '';
    letter === 'ذ'
        ? (result = '`')
        : letter === 'ض'
        ? (result = 'q')
        : letter === 'ص'
        ? (result = 'w')
        : letter === 'ث'
        ? (result = 'e')
        : letter === 'ق'
        ? (result = 'r')
        : letter === 'ف'
        ? (result = 't')
        : letter === 'غ'
        ? (result = 'y')
        : letter === 'ع'
        ? (result = 'u')
        : letter === 'ه'
        ? (result = 'i')
        : letter === 'خ'
        ? (result = 'o')
        : letter === 'ح'
        ? (result = 'p')
        : letter === 'ج'
        ? (result = '[')
        : letter === 'د'
        ? (result = ']')
        : letter === 'ش'
        ? (result = 'a')
        : letter === 'س'
        ? (result = 's')
        : letter === 'ي'
        ? (result = 'd')
        : letter === 'ب'
        ? (result = 'f')
        : letter === 'ل'
        ? (result = 'g')
        : letter === 'ا'
        ? (result = 'h')
        : letter === 'ت'
        ? (result = 'j')
        : letter === 'ن'
        ? (result = 'k')
        : letter === 'م'
        ? (result = 'l')
        : letter === 'ك'
        ? (result = ';')
        : letter === 'ط'
        ? (result = "'")
        : letter === 'ئ'
        ? (result = 'z')
        : letter === 'ء'
        ? (result = 'x')
        : letter === 'ؤ'
        ? (result = 'c')
        : letter === 'ر'
        ? (result = 'v')
        : letter === 'لا'
        ? (result = 'b')
        : letter === 'ى'
        ? (result = 'n')
        : letter === 'ة'
        ? (result = 'm')
        : letter === 'و'
        ? (result = ',')
        : letter === 'ز'
        ? (result = '.')
        : letter === 'ظ'
        ? (result = '/')
        : (result = letter);
    return result;
}

function setKeyActive(letter) {
    let id = clearInput(letter);
    activeKeyLetter = document.getElementsByClassName(id);
    return id;
}
function setArabicKeyActive(letter) {
    let id = clearInput(letter);
    activeKeyLetter = document.getElementsByClassName(id);
    return letter;
}
function setKeyCorrect(letter) {
    let id = clearInput(letter);
    correctLetter = document.getElementsByClassName(id);
    // print(id);
    return id;
}
function setKeyWrong(letter) {
    let id = clearInput(letter);
    wrongLetter = document.getElementsByClassName(id);
    return id;
}
function clearInput(letter) {
    let id = '';
    if (localStorage.isArabic == 'false') {
        letter == '['
            ? (id = '{')
            : letter == ']'
            ? (id = '}')
            : letter == '"'
            ? (id = "'")
            : letter == ':'
            ? (id = ';')
            : letter == '|'
            ? (id = '\\')
            : letter == '+'
            ? (id = '=')
            : letter == '_'
            ? (id = '-')
            : letter == ')'
            ? (id = '0')
            : letter == '('
            ? (id = '9')
            : letter == '*'
            ? (id = '8')
            : letter == '&'
            ? (id = '7')
            : letter == '^'
            ? (id = '6')
            : letter == '%'
            ? (id = '5')
            : letter == '$'
            ? (id = '4')
            : letter == '#'
            ? (id = '3')
            : letter == '@'
            ? (id = '2')
            : letter == '!'
            ? (id = '1')
            : letter == '`'
            ? (id = '~')
            : letter == '?'
            ? (id = '/')
            : letter == '>'
            ? (id = '.')
            : letter == '<'
            ? (id = ',')
            : (id = letter);
    } else {
        letter == 'ج' || letter == '<'
            ? (id = '{')
            : letter == 'د' || letter == '>'
            ? (id = '}')
            : letter == 'ط' || letter == '"'
            ? (id = "'")
            : letter == 'ك' || letter == ':'
            ? (id = ';')
            : letter == '|'
            ? (id = '\\')
            : letter == '+'
            ? (id = '=')
            : letter == '_'
            ? (id = '-')
            : letter == '('
            ? (id = '0')
            : letter == ')'
            ? (id = '9')
            : letter == '*'
            ? (id = '8')
            : letter == '&'
            ? (id = '7')
            : letter == '^'
            ? (id = '6')
            : letter == '%'
            ? (id = '5')
            : letter == '$'
            ? (id = '4')
            : letter == '#'
            ? (id = '3')
            : letter == '@'
            ? (id = '2')
            : letter == '!'
            ? (id = '1')
            : letter == 'ذ' || letter == 'ّ'
            ? (id = '~')
            : letter == 'ظ' || letter == '؟'
            ? (id = '/')
            : letter == 'ز' || letter == '.'
            ? (id = '.')
            : letter == 'و' || letter == ','
            ? (id = ',')
            : letter == 'ض' || letter == `َ`
            ? (id = 'q')
            : letter == 'ص' || letter == `ً`
            ? (id = 'w')
            : letter == 'ث' || letter == `ُ`
            ? (id = 'e')
            : letter == 'ق' || letter == `ٌ`
            ? (id = 'r')
            : letter == 'ف' || letter == `لإ`
            ? (id = 't')
            : letter == 'غ' || letter == `إ`
            ? (id = 'y')
            : letter == 'ع' || letter == `‘`
            ? (id = 'u')
            : letter == 'ه' || letter == `÷`
            ? (id = 'i')
            : letter == 'خ' || letter == `×`
            ? (id = 'o')
            : letter == 'ح' || letter == `؛`
            ? (id = 'p')
            : letter == 'ش' || letter == `ِ`
            ? (id = 'a')
            : letter == 'س' || letter == `ٍ`
            ? (id = 's')
            : letter == 'ي' || letter == `]`
            ? (id = 'd')
            : letter == 'ب' || letter == `[`
            ? (id = 'f')
            : letter == 'ل' || letter == `لأ`
            ? (id = 'g')
            : letter == 'ا' || letter == `أ`
            ? (id = 'h')
            : letter == 'ت' || letter == `ـ`
            ? (id = 'j')
            : letter == 'ن' || letter == `،`
            ? (id = 'k')
            : letter == 'م' || letter == `/`
            ? (id = 'l')
            : letter == 'ئ' || letter == `~`
            ? (id = 'z')
            : letter == 'ء' || letter == `ْ`
            ? (id = 'x')
            : letter == 'ؤ' || letter == `}`
            ? (id = 'c')
            : letter == 'ر' || letter == `{`
            ? (id = 'v')
            : letter == 'unidentified' || letter == `لآ`
            ? (id = 'b')
            : letter == 'ى' || letter == `آ`
            ? (id = 'n')
            : letter == 'ة' || letter == `’`
            ? (id = 'm')
            : (id = letter);
    }
    return id;
}
function isUpper(letter) {
    return letter === letter.toUpperCase();
}

function print(string) {
    console.log(string);
}
