const track = document.getElementById("track");
const ball = document.getElementById("ball");

const runsDisplay = document.getElementById("runs");
const ballsDisplay = document.getElementById("balls");
const missesDisplay = document.getElementById("misses");

const result = document.getElementById("result");
const hitBtn = document.getElementById("hitBtn");
const startBtn = document.getElementById("startBtn");

let position = 0;
let speed = 0;
let direction = 1;

let runs = 0;
let balls = 0;
let misses = 0;

let gameRunning = false;
let ballMoving = false;
let ballInterval = null;
let nextBallTimer = null;

const ballWidth = 25;

function startGame() {
    clearInterval(ballInterval);
    clearTimeout(nextBallTimer);

    runs = 0;
    balls = 0;
    misses = 0;

    gameRunning = true;

    updateScoreboard();

    result.textContent = "Get ready for the first ball!";
    startBtn.textContent = "Restart Game";
    hitBtn.disabled = true;

    startBall();
}

function startBall() {
    if (!gameRunning) return;

    clearInterval(ballInterval);

    const maxPosition = track.clientWidth - ballWidth;

    position = 0;
    direction = 1;

    speed = 3 + Math.random() * 4;

    ball.style.left = position + "px";

    ballMoving = true;
    hitBtn.disabled = false;

    result.textContent = "Ball coming! Time your shot!";

    ballInterval = setInterval(() => {
        position += speed * direction;

        if (position >= maxPosition) {
            position = maxPosition;
            direction = -1;
        }

        if (position <= 0) {
            position = 0;
            direction = 1;
        }

        ball.style.left = position + "px";
    }, 20);
}

function hitBall() {
    if (!gameRunning || !ballMoving) return;

    clearInterval(ballInterval);

    ballMoving = false;
    hitBtn.disabled = true;

    balls++;

    const ballCenter = position + ballWidth / 2;
    const trackWidth = track.clientWidth;

    const percentage = (ballCenter / trackWidth) * 100;

    let scoredRuns = 0;

    if (percentage < 20) {
        scoredRuns = 6;
    } else if (percentage < 40) {
        scoredRuns = 4;
    } else if (percentage < 60) {
        scoredRuns = 2;
    } else if (percentage < 80) {
        scoredRuns = 1;
    } else {
        scoredRuns = 0;
    }

    runs += scoredRuns;

    if (scoredRuns === 6) {
        result.textContent = "🔥 SIX! Incredible shot!";
    } else if (scoredRuns === 4) {
        result.textContent = "🏏 FOUR! Beautiful boundary!";
    } else if (scoredRuns === 2) {
        result.textContent = "Great running! 2 runs!";
    } else if (scoredRuns === 1) {
        result.textContent = "Quick single! 1 run!";
    } else {
        result.textContent = "Dot ball! No runs.";
    }

    updateScoreboard();

    nextBallTimer = setTimeout(startBall, 1200);
}

function missBall() {
    if (!gameRunning || !ballMoving) return;

    clearInterval(ballInterval);

    ballMoving = false;
    hitBtn.disabled = true;

    balls++;
    misses++;

    result.textContent = "❌ You missed the ball!";

    updateScoreboard();

    if (misses >= 3) {
        endGame();
        return;
    }

    nextBallTimer = setTimeout(startBall, 1200);
}

function updateScoreboard() {
    runsDisplay.textContent = runs;
    ballsDisplay.textContent = balls;
    missesDisplay.textContent = misses + "/3";
}

function endGame() {
    gameRunning = false;
    ballMoving = false;

    clearInterval(ballInterval);
    clearTimeout(nextBallTimer);

    hitBtn.disabled = true;

    result.textContent = `🏆 Game Over! Final Score: ${runs} runs`;
    startBtn.textContent = "Play Again";
}

hitBtn.addEventListener("click", hitBall);
startBtn.addEventListener("click", startGame);

// Press SPACE to hit the ball
document.addEventListener("keydown", event => {
    if (event.code === "Space" && gameRunning) {
        event.preventDefault();
        hitBall();
    }
});

// Count a miss if the ball completes its movement without being hit.
function checkBallMiss() {
    if (!gameRunning || !ballMoving) return;

    if (
        (direction === 1 && position >= track.clientWidth - ballWidth) ||
        (direction === -1 && position <= 0)
    ) {
        missBall();
    }
}