import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft; // счетчик попыток
let winCount; // счетчик выйгрыша (показывает отгадали все буквы или не все)

// создаем черточки (скрываем слово)
const createPlaceholdersHTML = () => {
  const word = sessionStorage.getItem("word"); //доступ к сохраненному слову в sessionStorage

  const wordArray = Array.from(word); // создаем массив из загаданного слова

  const placeholdersHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  ); // перебираем массив wordArray, записывая результат

  return `<div id="placeholders" class="placeholders-wrapper">${placeholdersHTML}</div>`; // возвращаем замененное содержимое gameDiv
};

// создаем клавиатуру
const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`
    );
  }, "");

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

// создаем картинки
const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letter.toLowerCase();
  //буквы нет в слове
  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left");
    triesLeft -= 1; // уменьшаем количество попыток
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img"); // меняем картинку в зависимости от оставшихся попыток
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    //буква есть в слове
    const wordArray = Array.from(word); // создаем массив из строки
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame("win");
          return;
        }
        document.getElementById(`letter_${i}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

const stopGame = (status) => {
  document.getElementById("placeholders").remove();
  document.getElementById("tries").remove();
  document.getElementById("keyboard").remove();
  document.getElementById("quit").remove();

  const word = sessionStorage.getItem("word");

  if (status === "win") {
    // сценарий выйгрыша
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header win">You won!</h2>';
  } else if (status === "lose") {
    // сценарий пройгрыша
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header lose">You lost :(</h2>';
  } else if (status === "quit") {
    logoH1.classList.remove("logo-sm");
    document.getElementById("hangman-img").remove();
  }

  document.getElementById(
    "game"
  ).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p> <button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`;
  document.getElementById("play-again").onclick = startGame;
};

export const startGame = () => {
  triesLeft = 10; // счетчик попыток
  winCount = 0; // счетчик отгаданных букв

  logoH1.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length); // floor - округление числа, random - выбор рандомного числа, WORDS.length - длина массива

  const wordToGuess = WORDS[randomIndex]; // рандомное слово для отгадывания

  sessionStorage.setItem("word", wordToGuess); // sessionStorage - временное хранилище информации, которая находится в объекте Window браузера. Удаляется после закрытия браузера.

  gameDiv.innerHTML = createPlaceholdersHTML(); // выводим на экран Placeholders

  gameDiv.innerHTML +=
    '<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>'; // выводим на экран количество оставшихся попыток

  const keyboardDiv = createKeyboard(); // клавиатура
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true; // отключаем нажатую кнопку на клавиатуре (нельзя нажимать повторно)
      checkLetter(event.target.id); // checkLetter проверяет введенную букву
    }
  });

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv); // выводим на экран клавитатуру. appendChild - добавляет новый узел newNode в конец коллекции дочерних узлов

  gameDiv.insertAdjacentHTML(
    "beforeend",
    '<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>'
  ); // создаем кнопку Quit
  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit and lose progress?");
    if (isSure) {
      stopGame("quit");
    }
  };
};
