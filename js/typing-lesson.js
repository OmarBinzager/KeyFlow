let lessonInfo = {
    name: 'Pleasure',
    text: `You can acount the pleasure entire the world as you can. people always taken other people in a park, but that not happen with me. You can acount the pleasure entire the world as you can.`,
    level: 1,
    stars: 0,
    speed: 0,
    accuracy: 0,
};
let KeyboardLetters = document.querySelectorAll(
    '.keyboard .edc-st1.edc-st2.bld'
);
let words = lessonInfo.text.split(' ');
let activeKeyLetter;
let wrongLetter;
let correctLetter;
let lines = [];
let tokens = [];
let indexes = { cur_line_index: 0, cur_token_index: 0, cur_letter_index: 0 };
let cur_line;
// let cur_token_index_in_line = 0;
let holderIndexToken = 0;
const fixedUpDown = 73.76;
let margintop = 0;
let canType = true;
let canBack = false;
let cur_token;
let cur_letter;
let keydown = 0;
let totalLetters = lessonInfo.text.length;
let shiftRightKey = document.querySelectorAll('.shift-right');
let shiftLeftKey = document.querySelectorAll('.shift-left');
let neutralRight = document.getElementById('neutral-right');
let neutralLeft = document.getElementById('neutral-left');
let text_container = document.querySelector('.text-container.typable');
let progress = document.querySelector('.progress');


const typeSound = new AudioContext();

function typeSoundStart(){
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

function errorSoundStart(){
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


generateLesson(lessonInfo);
cur_line = lines[0];
cur_token = tokens[0];
cur_letter = cur_token.children[0];
setLetter(cur_letter.textContent);
cur_letter.classList.add('cur');



window.addEventListener('keydown', (e) => {
    if (!canType) {
        e.preventDefault();
        return;
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
    e.preventDefault();
});
function checkInput(inputLetter) {
    cur_letter.classList.remove('cur');
     if (
        inputLetter === 'Tab' ||
        inputLetter === 'Enter'
    ) {
        setWrongLetter(inputLetter.toLowerCase());
     }
     else {
        if (inputLetter === cur_letter.textContent) {
            setCorrectLetter(inputLetter.toLowerCase());
            if (cur_letter.classList.contains('e-v'))
                cur_letter.classList.add('err-vld');
            else
                cur_letter.classList.add('vld');
        } else if (inputLetter === 'space' &&
            cur_letter.innerHTML.length > 1) {
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
        }
    }
    cur_letter.classList.add('cur');
    keydown++
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
        if (cur_letter.classList.contains('err')) { cur_letter.classList.add('e-v'); }
        cur_letter.classList.contains('vld')
            ? cur_letter.classList.remove('vld'):'';
        cur_letter.classList.contains('err')
            ? cur_letter.classList.remove('err'):'';
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
    progress.style.width = `${((keydown / totalLetters) * 100)}%`;
}
function increaseLetterIndex() {
    const length = cur_token.children.length;
    if (((indexes.cur_letter_index + 1) % cur_token.children.length) == 0) {
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
        indexes.cur_letter_index == cur_token.children.length -1
    ) {
        endLesson();
    }
    return (
        indexes.cur_letter_index = (indexes.cur_letter_index + 1) %
        length
    );
}
function downText() {
    let start = 0;
    let slowly = setInterval(() => {    
        text_container.style.marginTop = `${margintop--}px`;
        start++;
        if (start >= 73) {
            text_container.style.marginTop = `${margintop -= 0.76}px`;
            clearInterval(slowly);
        }
    }, 300 / fixedUpDown);
    // margintop -= fixedUpDown;
}
function upText(){
    let start = 0;
    let slowly = setInterval(() => {
        text_container.style.marginTop = `${margintop++}px`;
        start++;
        if (start >= 73) {
            text_container.style.marginTop = `${(margintop += 0.76)}px`;
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
    errorSoundStart();
    setKeyWrong(wrongLet);
    incorrectLetterShow(wrongLetter);
    setTimeout(() => {
        incorrectLetterHide(wrongLetter);
    }, 200);
}
function endLesson() {
    canType = false;
}
function setCorrectLetter(letter) {
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

window.addEventListener('resize', e => setLines());

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
