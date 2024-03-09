var coins = 0;
var timeRemaining = 60;
var gameStarted = false;
var flippedPair = 0;
var livesLeft = 10;
var ongoing = null;

const boardContainer = document.querySelector(".board-container");
const board = document.querySelector(".board");
const moves = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const win = document.querySelector(".win-card");
const lose = document.querySelector(".lose-card");

// calculating number of hearts to put on page

for (let i = 1; i <= livesLeft; i++) {
  document
    .querySelector(".dead")
    .insertAdjacentHTML(
      "beforeend",
      `<img src="images/grey_heart.png" alt="grey heart" />`
    );
  document
    .querySelector(".live")
    .insertAdjacentHTML(
      "beforeend",
      `<img id="${i}" class="live_unhidden" src="images/red_heart.png" alt="red heart" />`
    );
}

timer.textContent = "Time: " + timeRemaining + " s";

// pick a given number of items from array, at random
const randomise = (options, quantity) => {
  let randomised = [];

  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * options.length);
    // remove chosen element
    randomised.push(options[randomIndex]);
    options.splice(randomIndex, 1);
  }

  return randomised;
};

// randomise an array
const shuffleCards = (cards) => {
  for (let i = cards.length - 1; i > 0; i--) {
    const oldElement = cards[i];
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // swap the new and the old element
    cards[i] = cards[randomIndex];
    cards[randomIndex] = oldElement;
  }
  return cards;
};

// creating the game
const generateGame = () => {
  const cardNums = board.getAttribute("cards");

  if (cardNums % 2 !== 0) {
    throw new Error("You need an even amount of cards to play.");
  }

  // images used for game, picked randomly
  const images = [
    '<img src="images/david_and_bird.png" alt="David and toucan" />',
    '<img src="images/david_and_frog.jpeg" alt="David and frog" />',
    '<img src="images/angry_david.png" alt="Angry David" />',
    '<img src="images/david_and_queen.jpeg" alt="David and queen" />',
    '<img src="images/david_hurt.jpeg" alt="David is hurt" />',
    '<img src="images/happy_david.png" alt="David is happy" />',
    '<img src="images/pensive_david.jpeg" alt="Pensive David" />',
    '<img src="images/turtle.png" alt="Turtle" />',
  ];

  // pick random list of image pairs
  const randomImages = randomise(images, cardNums / 2);
  // order the images randomly
  const cards = shuffleCards([...randomImages, ...randomImages]);
  const deck = `
        <div class="board" style="grid-template: repeat(${cardNums}, auto)">
            ${cards
              .map(
                (card) => `
                <div class="card">
                    <div class="card-front">?</div>
                    <div class="card-back">${card}</div>
                </div>
            `
              )
              .join("")}
       </div>
    `;

  let parser = new DOMParser().parseFromString(deck, "text/html");

  board.replaceWith(parser.querySelector(".board"));
};

// start game
const startGame = () => {
  gameStarted = true;

  // decrement time every second and check if player has lost
  ongoing = setInterval(() => {
    timeRemaining--;
    if (timeRemaining < 0 || livesLeft <= 0) {
      lose.classList.remove("lose-card_closed");
      lose.classList.add("lose-card_opened");
      document.getElementById("popup").style.zIndex = "3";
      return;
    }

    timer.innerText = `Time: ${timeRemaining} sec`;
  }, 1000);
};

// flip the cards back around if they don't match
const flipToBack = () => {
  document.querySelectorAll(".card:not(.matched)").forEach((card) => {
    card.classList.remove("flipped");
  });

  flippedPair = 0;
};

// flip card to front function
const flipToFront = (card) => {
  flippedPair++;

  if (!gameStarted) {
    startGame();
  }

  if (flippedPair <= 2) {
    card.classList.add("flipped");
  }

  // check if a flipped pair of cards matches or not
  if (flippedPair === 2) {
    const flippedPair = document.querySelectorAll(".flipped:not(.matched)");

    if (flippedPair[0].innerHTML == flippedPair[1].innerHTML) {
      flippedPair[0].classList.add("matched");
      flippedPair[1].classList.add("matched");
      coins += 2;
    } else {
      document.getElementById(livesLeft).classList.add("live_hidden");
      document.getElementById(livesLeft).classList.remove("live_unhidden");
      livesLeft--;
    }

    setTimeout(() => {
      flipToBack();
    }, 1000);
  }

  // if player has won
  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    setTimeout(() => {
      // calculating bonus coins
      let bonus = 0;
      coins += livesLeft;
      bonus += livesLeft;
      coins += timeRemaining;
      bonus += timeRemaining;

      updateBalance(getCookie("user"), Number(getCookie("balance")) + coins);

      document.getElementById("balance").textContent = getCookie("balance");
      const lastChar = document.getElementById("last_char_in_win");
      win.classList.remove("win-card_closed");
      win.classList.add("win-card_opened");
      document.getElementById("popup").style.zIndex = "3";
      lastChar.insertAdjacentHTML(
        "afterend",
        `
            <p>
            earning
            <span>${bonus}</span> bonus coins
            and a total of <span>${coins}</span> coins
            </p>
            `
      );

      clearInterval(ongoing);
    }, 1000);
  }
};

// flip card to front if its been clicked
const eventListeners = () => {
  document.addEventListener("click", (event) => {
    const parent = event.target.parentElement;
    if (
      event.target.className.includes("card") &&
      !parent.className.includes("flipped")
    ) {
      flipToFront(parent);
    }
  });
};

// win alert
win.querySelector(".exit").addEventListener("click", () => {
  location.reload();
  win.classList.add("win-card_closed");
  win.classList.remove("win-card_opened");
  document.getElementById("popup").style.zIndex = "-1";
});
// lose alert
lose.querySelector(".exit").addEventListener("click", () => {
  location.reload();
  win.classList.add("lose-card_closed");
  win.classList.remove("lose-card_opened");
  document.getElementById("popup").style.zIndex = "-1";
});

// logout button
document.getElementById("logout_button").addEventListener("click", () => {
  location.reload();
});

generateGame();
eventListeners();
