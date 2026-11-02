const gameArea = document.getElementById("gameArea");
const ball = document.getElementById("ball");
const paddle = document.getElementById("paddle");
const scoreDisplay = document.getElementById("score");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const ballSize = 18;
const paddleWidth = 100;

let x, y, dx, dy;
let paddleX = 0;
let score = 0;
let gameRunning = false;
let animationId;

function startGame() {
    cancelAnimationFrame(animationId);

    score = 0;
    scoreDisplay.textContent = score;

    x = (gameArea.clientWidth - ballSize) / 2;
    y = 100;

    dx = 3;
    dy = 3;

    paddleX = (gameArea.clientWidth - paddleWidth) / 2;
    paddle.style.left = paddleX + "px";

    gameRunning = true;
    overlay.classList.add("hidden");

    updateGame();
}

function movePaddle(position) {
    paddleX = Math.max(
        0,
        Math.min(position, gameArea.clientWidth - paddleWidth)
    );

    paddle.style.left = paddleX + "px";
}

// Mouse movement
gameArea.addEventListener("mousemove", event => {
    if (!gameRunning) return;

    const rect = gameArea.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    movePaddle(mouseX - paddleWidth / 2);
});

// Keyboard movement
document.addEventListener("keydown", event => {
    if (!gameRunning) return;

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        movePaddle(paddleX - 30);
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        movePaddle(paddleX + 30);
    }
});

function updateGame() {
    if (!gameRunning) return;

    x += dx;
    y += dy;

    // Left and right wall collision
    if (x <= 0 || x + ballSize >= gameArea.clientWidth) {
        dx = -dx;
        x = Math.max(0, Math.min(x, gameArea.clientWidth - ballSize));
    }

    // Top wall collision
    if (y <= 0) {
        dy = Math.abs(dy);
        y = 0;
    }

    // Paddle collision
    const paddleY = gameArea.clientHeight - 28;

    if (
        dy > 0 &&
        y + ballSize >= paddleY &&
        y + ballSize <= paddleY + 10 &&
        x + ballSize >= paddleX &&
        x <= paddleX + paddleWidth
    ) {
        dy = -Math.abs(dy);
        y = paddleY - ballSize;

        score++;
        scoreDisplay.textContent = score;

        // Increase ball speed slightly
        dx *= 1.03;
        dy *= 1.03;
    }

    // Ball missed
    if (y > gameArea.clientHeight) {
        endGame();
        return;
    }

    ball.style.left = x + "px";
    ball.style.top = y + "px";

    animationId = requestAnimationFrame(updateGame);
}

function endGame() {
    gameRunning = false;
    cancelAnimationFrame(animationId);

    message.textContent = `Game Over! Score: ${score}`;
    startBtn.textContent = "Play Again";

    overlay.classList.remove("hidden");
}

startBtn.addEventListener("click", startGame);