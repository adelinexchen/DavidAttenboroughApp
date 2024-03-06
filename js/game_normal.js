var coins = 0;
var gameStarted = false;
var flippedPair = 0;
var ongoing = null;

const boardContainer = document.querySelector(".board-container");
const board = document.querySelector(".board");
const win = document.querySelector(".win-card");

// randomise the images for the game
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

// shuffle the images so pairs aren't next to each other
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

// create game
const generateGame = () => {
  const cardNums = board.getAttribute("cards");

  if (cardNums % 2 !== 0) {
    throw new Error("You need an even amount of cards to play.");
  }

  // images for game that are chosen at random
  const icons = [
    '<img src="images/david_and_bird.png" alt="David and toucan" />',
    '<img src="images/david_and_frog.jpeg" alt="David and frog" />',
    '<img src="images/angry_david.png" alt="Angry David" />',
    '<img src="images/david_and_queen.jpeg" alt="David and queen" />',
    '<img src="images/david_hurt.jpeg" alt="David is hurt" />',
    '<img src="images/happy_david.png" alt="David is happy" />',
    '<img src="images/pensive_david.jpeg" alt="Pensive David" />',
    '<img src="images/turtle.png" alt="Turtle" />',
  ];
  const randomImages = randomise(icons, cardNums / 2);
  const cards = shuffleCards([...randomImages, ...randomImages]);
  const deck = `
        <div class="board" style="grid-template-columns: repeat(${cardNums}, auto)">
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

  const parser = new DOMParser().parseFromString(deck, "text/html");

  board.replaceWith(parser.querySelector(".board"));
};

// start game
const startGame = () => {
  gameStarted = true;
};

// flip back if cards dont match
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

  // check if flipped cards match
  if (flippedPair === 2) {
    const flippedPair = document.querySelectorAll(".flipped:not(.matched)");

    if (flippedPair[0].innerHTML == flippedPair[1].innerHTML) {
      flippedPair[0].classList.add("matched");
      flippedPair[1].classList.add("matched");
      coins += 2;
    }

    setTimeout(() => {
      flipToBack();
    }, 1000);
  }

  // if player has won
  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    setTimeout(() => {
      updateBalance(getCookie("user"), Number(getCookie("balance")) + coins);
  
      document.getElementById("balance").textContent =
        getCookie("balance");
      const lastChar = document.getElementById("last_char_in_win");
      win.classList.remove("win-card_closed");
      win.classList.add("win-card_opened");
      document.getElementById("popup").style.zIndex = "3";
      lastChar.insertAdjacentHTML(
        "afterend",
        `
            <p>
            earning a total of <br> <span>${coins}</span> coins
            </p>
            `
      );

      clearInterval(loop);
    }, 1000);
  }
};

// flip cards to front
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

generateGame();
eventListeners();
