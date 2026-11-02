const emojis = ["🍎", "🍌", "🍇", "🍒", "🍕", "⚽", "🚀", "🐱"];

const grid = document.getElementById("grid");
const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");
const message = document.getElementById("message");

let cards = [...emojis, ...emojis];
let moves = 0;
let matches = 0;

// Shuffle the cards
cards.sort(() => Math.random() - 0.5);

// Game state
let firstCard = null;
let secondCard = null;
let locked = false;

// Build the grid
function createGrid() {
    grid.innerHTML = "";

    cards.forEach((emoji, index) => {
        const card = document.createElement("button");

        card.classList.add("card");
        card.dataset.value = emoji;
        card.dataset.index = index;
        card.textContent = "?";

        grid.appendChild(card);
    });
}

// Closure: remembers the first card
function handleCardClick() {

    grid.addEventListener("click", function (event) {

        const card = event.target.closest(".card");

        if (!card || locked || card.classList.contains("open") ||
            card.classList.contains("matched")) {
            return;
        }

        card.textContent = card.dataset.value;
        card.classList.add("open");

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        moves++;

        movesDisplay.textContent = moves;

        if (firstCard.dataset.value === secondCard.dataset.value) {

            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            matches++;
            matchesDisplay.textContent = matches;

            message.textContent = "Great match! 🎉";

            firstCard = null;
            secondCard = null;

            if (matches === 8) {
                message.textContent = `You won in ${moves} moves! 🏆`;
            }

        } else {

            locked = true;
            message.textContent = "Not a match! Try again.";

            setTimeout(() => {

                firstCard.textContent = "?";
                secondCard.textContent = "?";

                firstCard.classList.remove("open");
                secondCard.classList.remove("open");

                firstCard = null;
                secondCard = null;

                locked = false;

            }, 1000);
        }

    });
}

// Restart game
function restartGame() {
    cards.sort(() => Math.random() - 0.5);

    moves = 0;
    matches = 0;

    firstCard = null;
    secondCard = null;
    locked = false;

    movesDisplay.textContent = 0;
    matchesDisplay.textContent = 0;
    message.textContent = "Find the matching cards!";

    createGrid();
}

document.getElementById("restart").addEventListener("click", restartGame);

createGrid();
handleCardClick();