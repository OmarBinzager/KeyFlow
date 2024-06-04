// declaration
let lessonData;
let lessonInfo = {
    name: '',
    text: '',
    level: 0,
    require_speed: 0
};

let words;
let totalLetters;
let lines = [];
let tokens = [];
let cur_line;
let cur_token;
let cur_letter;
let KeyboardLetters = document.querySelectorAll(
    '.keyboard .edc-st1.edc-st2.bld'
);
let activeKeyLetter;
let wrongLetter;
let correctLetter;
let indexes = { cur_line_index: 0, cur_token_index: 0, cur_letter_index: 0 };
// let cur_token_index_in_line = 0;
let holderIndexToken = 0;
const fixedUpDownS = 0.4;
const fixedUpDown = 75 + fixedUpDownS;
let margintop = 0;
let canType = true;
let canBack = false;
let keydown = 0;
let wrongLettersCount = 0;
let rightLettersCount = 0;
let testLevel = 0;
let accuracy = 0;
let speed = 0;
let duration = 0.0;
let seconds = 0;
let durationCounter;
let started = false;
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
let loadingScreen = document.querySelector('.loading-screen');
let play_bause_btn = document.querySelector('.control-bar button');
let lessonName = document.querySelector('.control-bar p.lesson-name');
let ContainerTestLessonCard = document.querySelector('.choose-test-level');
let testLessonCard = document.querySelectorAll('.choose-test-level .tl');

let wait = null;
let storeLessonData;
testLessonCard.forEach((tl) =>
    tl.addEventListener('click', () => {
        testLevel = tl.dataset.id;
        print(testLevel);
        ContainerTestLessonCard.classList.add('hide');
        getLesson(lessonInfo);
    })
);
function getLesson(lessonObj) {
    loadingScreen.classList.add('active');
    setTimeout(() => {
        loadingScreen.classList.remove('active');
    }, 3 * 1000);
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let handleLessons = JSON.parse(this.responseText);
            lessonData = handleLessons.TestLevels[testLevel];
            // print(lessonData);
            lessonObj.name = lessonData.name;
            lessonObj.level = lessonData.level;
            lessonObj.text = lessonData.text;
            lessonObj.require_speed = lessonData.require_speed;
            words = lessonObj.text.split(' ');
            totalLetters = lessonObj.text.length;
            generateLesson(lessonObj);
            cur_line = lines[0];
            cur_token = tokens[0];
            cur_letter = cur_token.children[0];
            setLetter(cur_letter.textContent);
            cur_letter.classList.add('cur');
            lessonName.innerHTML = `Lesson ${lessonInfo.level}: ${lessonInfo.name}`;
        }
    };

    myRequest.open('GET', '/js/typing-test.json', true);
    myRequest.send();
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
    getLesson(lessonInfo);
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

window.addEventListener('keydown', (e) => {
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
    // print(e.key);
    if (
        e.key !== 'Shift' &&
        e.key !== 'Backspace' &&
        e.key !== 'CapsLock' &&
        e.key !== 'Control' &&
        e.key !== ' ' &&
        e.key !== 'ArrowRight' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowUp' &&
        e.key !== 'ArrowDown' &&
        e.key !== 'PageDown' &&
        e.key !== 'PageUp' &&
        e.key !== 'Insert' &&
        e.key !== 'Home' &&
        e.key !== 'End' &&
        e.key !== 'Delete' &&
        e.key !== 'NumLock' &&
        e.key !== 'Clear' &&
        e.key !== 'MediaPlayPause' &&
        e.key !== 'MediaTrackNext' &&
        e.key !== 'MediaTrackPrevious' &&
        e.key !== 'AudioVolumeUp' &&
        e.key !== 'AudioVolumeDown' &&
        e.key !== 'Alt'
    ) {
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
});

function lowAcurracy() {
    canBack = false;
    canType = false;
    lowAcurracyPopup.classList.add('active');
}
/*
1 Star (Very Weak): "Meh, it could be better." (Lowers expectations)

2 Stars (Mediocre): "Not bad, but there's room for improvement." (Constructive criticism)

3 Stars (Average): "Good job! You did the basics well." (Acknowledgement of effort)

4 Stars (Very Good): "Impressive! This is a solid achievement." (Highlights quality)

5 Stars (Excellent): "Outstanding! You absolutely nailed it!" (Enthusiastic praise)
*/
let congStatement = [
    "<b>Don't give up!</b> There's always another chance to shine.",
    '<b>Meh,</b> it could be better.',
    "<b>Not bad</b>, but there's room for improvement.",
    '<b>Good job!</b> You did the basics well.',
    '<b>Impressive!</b> This is a solid achievement.',
    '<b>Outstanding!</b> You absolutely nailed it!',
];
function showResult() {
    let starsCount = 0;
    Math.floor(accuracy) == 100 ? starsCount++ : (starsCount = 0);
    speed >= lessonInfo.require_speed && speed <= lessonInfo.require_speed + 5
        ? (starsCount += 2)
        : speed < lessonInfo.require_speed + 13 &&
          speed > lessonInfo.require_speed + 5
        ? (starsCount += 3)
        : speed > lessonInfo.require_speed + 13
        ? (starsCount += 4)
        : (starsCount = 0);
    congrats.innerHTML = congStatement[starsCount];
    let index = 0;
    let setStars = setInterval(() => {
        starsHolder[index++].classList.add('filled');
        StarSoundStart();
        starsCount--;
        if (starsCount < 1) {
            clearInterval(setStars);
        }
    }, 500);
    let minutes = Math.floor(seconds / 60);
    let second = seconds % 60;
    timeRsult.innerHTML = `${minutes}:${second < 10 ? `0${second}` : second}`;
    const wrapper = document.querySelectorAll('.result .progress');

    const barCount = 50;
    const percent1 = (barCount * Math.round(accuracy)) / 100;
    const speedBarCount = lessonInfo.require_speed + 25;
    const percent3 =
        /*lessonInfo.require_speed*/ (barCount * speed) / speedBarCount;

    for (let index = 0; index < barCount; index++) {
        const className = index < percent1 ? 'selected1' : '';
        wrapper[0].innerHTML += `<i style="--i: ${index};" class="${className}"></i>`;
    }

    wrapper[0].innerHTML += `<div class='info'><p class="selected percent-text text1">${Math.floor(
        accuracy
    )}<span>%</span></p><h4 class="acc">Accuracy</h4></div>`;

    for (let index = 0; index < barCount; index++) {
        const className = index < percent3 ? 'selected3' : '';
        wrapper[1].innerHTML += `<i style="--i: ${index};" class="${className}"></i>`;
    }

    wrapper[1].innerHTML += `<div class='info'>
    <p class="selected percent-text text3">${speed}<span>wpm</span></p>
    <h4 class="speed">Speed</h4>
    </div>`;
}
function checkInput(inputLetter) {
    cur_letter.classList.remove('cur');
    if (inputLetter === 'Tab' || inputLetter === 'Enter') {
        setWrongLetter(inputLetter.toLowerCase());
    } else {
        if (inputLetter === cur_letter.textContent) {
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
        let letterIndex = increaseLetterIndex();
        if (canType) {
            cur_letter = cur_token.children[letterIndex];
            if (cur_letter.innerHTML.length > 1) setLetter('space');
            else setLetter(cur_letter.textContent);
            cur_letter.classList.add('cur');
        }
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
function endLesson() {
    stopTyping();
    canType = false;
    resultScreen.classList.add('active');
    showResult();
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
    if (
        isUpper(letter) &&
        !Number.parseInt(letter) &&
        letter !== '0' &&
        !isSpecialChar(letter)
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
    // }, 0);
}

function isRightLetter(letter) {
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
        letter == '_' ||
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
}
function isLeftLetter(letter) {
    if (
        letter == 'q' ||
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
}
function isSpecialChar(letter) {
    if (
        letter == '=' ||
        letter == '-' ||
        letter == ']' ||
        letter == '[' ||
        letter == "'" ||
        letter == ';' ||
        letter == '/' ||
        letter == '\\' ||
        letter == '.' ||
        letter == ',' ||
        letter == '`'
    )
        return true;
    else return false;
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
    KeyboardLetters[0].innerHTML !== KeyboardLetters[0].innerHTML.toLowerCase()
        ? KeyboardLetters.forEach(
              (l) => (l.innerHTML = l.innerHTML.toLowerCase())
          )
        : null;
}
function keyboardToUpper() {
    KeyboardLetters[0].innerHTML !== KeyboardLetters[0].innerHTML.toUpperCase()
        ? KeyboardLetters.forEach(
              (l) => (l.innerHTML = l.innerHTML.toUpperCase())
          )
        : null;
}

function setKeyActive(letter) {
    let id = clearInput(letter);
    activeKeyLetter = document.getElementsByClassName(id);
    return id;
}
function setKeyCorrect(letter) {
    let id = clearInput(letter);
    correctLetter = document.getElementsByClassName(id);
    return id;
}
function setKeyWrong(letter) {
    let id = clearInput(letter);
    wrongLetter = document.getElementsByClassName(id);
    return id;
}
function clearInput(letter) {
    let id = '';
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
    return id;
}
function isUpper(letter) {
    return letter === letter.toUpperCase();
}

function print(string) {
    console.log(string);
}
