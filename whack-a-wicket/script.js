// Game variables

let score = 0;
let timeLeft = 30;

let activeCell = null;

let moleInterval = null;
let timerInterval = null;

let gameRunning = false;


// Selecting HTML elements

const gameGrid = document.getElementById("gameGrid");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

const bestScoreDisplay = document.getElementById("bestScore");

const message = document.getElementById("message");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");


// Best score

let bestScore = Number(localStorage.getItem("bestScore")) || 0;

bestScoreDisplay.textContent = bestScore;


// STEP 1: Build the 3x3 grid using a for loop

for (let i = 0; i < 9; i++) {

    const cell = document.createElement("div");

    cell.classList.add("cell");

    cell.dataset.index = i;

    cell.textContent = "🟫";

    gameGrid.appendChild(cell);

}


// Get all cells

const cells = document.querySelectorAll(".cell");


// STEP 2: Start the game

function startGame() {

    if (gameRunning) return;

    score = 0;
    timeLeft = 30;

    scoreDisplay.textContent = score;

    timerDisplay.textContent = timeLeft;

    message.textContent = "Game started! Hit the wicket!";

    gameRunning = true;

    startBtn.disabled = true;

    // Start mole movement every 800 milliseconds

    moleInterval = setInterval(showMole, 800);

    // Countdown timer

    timerInterval = setInterval(() => {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);

}


// STEP 3: Show a random wicket

function showMole() {

    // Remove previous active wicket

    if (activeCell !== null) {

        cells[activeCell].classList.toggle("active", false);

    }

    // Select a random cell

    let randomIndex = Math.floor(Math.random() * 9);

    activeCell = randomIndex;

    // Show wicket

    cells[randomIndex].textContent = "🏏";

    cells[randomIndex].classList.toggle("active", true);

}


// STEP 4: Event delegation on the entire grid

gameGrid.addEventListener("click", function (event) {

    // Find the clicked cell

    const clickedCell = event.target.closest(".cell");

    // Ignore clicks outside cells or after game ends

    if (!clickedCell || !gameRunning) return;

    // Get the clicked cell index

    const clickedIndex = Number(clickedCell.dataset.index);


    // Check whether the correct wicket was clicked

    if (clickedIndex === activeCell) {

        score++;

        scoreDisplay.textContent = score;

        message.textContent = "🎯 Perfect hit! +1 point";


        // Update best score

        if (score > bestScore) {

            bestScore = score;

            bestScoreDisplay.textContent = bestScore;

            localStorage.setItem("bestScore", bestScore);

        }


        // Remove the wicket immediately

        clickedCell.classList.toggle("active", false);

        clickedCell.classList.add("hit");

        clickedCell.textContent = "💥";


        activeCell = null;


        // Remove hit animation after a short time

        setTimeout(() => {

            clickedCell.classList.remove("hit");

            clickedCell.textContent = "🟫";

        }, 200);

    }

    else {

        message.textContent = "Missed! Watch carefully.";

    }

});


// STEP 5: End the game

function endGame() {

    gameRunning = false;

    clearInterval(moleInterval);

    clearInterval(timerInterval);

    activeCell = null;


    // Remove all active wickets

    cells.forEach(cell => {

        cell.classList.toggle("active", false);

        cell.classList.remove("hit");

        cell.textContent = "🟫";

    });


    message.textContent = `⏰ Time's up! Your final score: ${score}`;

    startBtn.disabled = false;

    startBtn.textContent = "▶ Play Again";

}


// STEP 6: Reset the game

function resetGame() {

    clearInterval(moleInterval);

    clearInterval(timerInterval);

    gameRunning = false;

    score = 0;

    timeLeft = 30;

    activeCell = null;


    scoreDisplay.textContent = score;

    timerDisplay.textContent = timeLeft;

    message.textContent = "Ready? Press Start Game!";


    cells.forEach(cell => {

        cell.classList.toggle("active", false);

        cell.classList.remove("hit");

        cell.textContent = "🟫";

    });


    startBtn.disabled = false;

    startBtn.textContent = "▶ Start Game";

}


// Button events

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", resetGame);