// ===================================
// REACTION TIMER GAME
// ===================================


// STEP 1: Game variables

let timeoutId = null;

let startTime = 0;

let gameState = "idle";


// STEP 2: Select HTML elements

const reactionArea = document.getElementById("reactionArea");

const reactionTitle = document.getElementById("reactionTitle");

const reactionMessage = document.getElementById("reactionMessage");

const reactionIcon = document.getElementById("reactionIcon");

const startBtn = document.getElementById("startBtn");

const resetBtn = document.getElementById("resetBtn");

const lastTimeDisplay = document.getElementById("lastTime");

const bestTimeDisplay = document.getElementById("bestTime");


// STEP 3: Load personal best from localStorage

let bestTime = Number(localStorage.getItem("bestReactionTime")) || 0;

bestTimeDisplay.textContent = bestTime
    ? bestTime + " ms"
    : "-- ms";


// STEP 4: Start the test

function startTest() {

    // Prevent multiple timers from running

    if (gameState === "waiting" || gameState === "ready") {

        return;

    }

    // Clear any previous timeout

    clearTimeout(timeoutId);

    gameState = "waiting";

    startBtn.disabled = true;

    reactionArea.className = "reaction-area waiting";

    reactionIcon.textContent = "⏳";

    reactionTitle.textContent = "Wait for green!";

    reactionMessage.textContent = "Don't click too early.";


    // Random delay between 2 and 5 seconds

    const randomDelay = Math.floor(Math.random() * 3000) + 2000;


    // STEP 5: Change screen after random delay

    timeoutId = setTimeout(function () {

        gameState = "ready";

        reactionArea.className = "reaction-area go";

        reactionIcon.textContent = "🟢";

        reactionTitle.textContent = "CLICK NOW!";

        reactionMessage.textContent = "How fast are you?";

        // Record the exact starting time

        startTime = Date.now();

    }, randomDelay);

}


// STEP 6: Handle reaction click

function handleReaction() {

    // Player clicked too early

    if (gameState === "waiting") {

        clearTimeout(timeoutId);

        gameState = "early";

        reactionArea.className = "reaction-area early";

        reactionIcon.textContent = "🚫";

        reactionTitle.textContent = "Too early!";

        reactionMessage.textContent =
            "You clicked before the screen turned green.";

        startBtn.disabled = false;

        return;

    }


    // Ignore clicks if the game isn't ready

    if (gameState !== "ready") {

        return;

    }


    // Calculate reaction time

    const reactionTime = Date.now() - startTime;

    gameState = "finished";


    // Display reaction time

    lastTimeDisplay.textContent = reactionTime + " ms";

    reactionArea.className = "reaction-area result";

    reactionIcon.textContent = "⚡";

    reactionTitle.textContent = reactionTime + " ms";

    reactionMessage.textContent = "Your reaction time!";


    // STEP 7: Update personal best

    if (bestTime === 0 || reactionTime < bestTime) {

        bestTime = reactionTime;

        bestTimeDisplay.textContent = bestTime + " ms";

        localStorage.setItem("bestReactionTime", bestTime);

        reactionMessage.textContent = "🏆 New personal best!";

    }


    startBtn.disabled = false;

    startBtn.textContent = "Try Again";

}


// STEP 8: Reset the game

function resetGame() {

    // Stop any pending timeout

    clearTimeout(timeoutId);

    timeoutId = null;

    gameState = "idle";

    startTime = 0;


    reactionArea.className = "reaction-area";

    reactionIcon.textContent = "⚡";

    reactionTitle.textContent = "Ready to test your reflexes?";

    reactionMessage.textContent =
        "Press the button below to begin.";

    lastTimeDisplay.textContent = "-- ms";

    startBtn.disabled = false;

    startBtn.textContent = "Start Test";

}


// STEP 9: Button events

startBtn.addEventListener("click", startTest);


// Clicking the reaction area

reactionArea.addEventListener("click", handleReaction);


// Reset button

resetBtn.addEventListener("click", resetGame);