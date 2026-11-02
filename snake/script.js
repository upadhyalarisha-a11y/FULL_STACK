const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("bestScore");
const levelDisplay = document.getElementById("level");
const statusDisplay = document.getElementById("status");

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const description = document.getElementById("description");
const overlayIcon = document.getElementById("overlayIcon");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const GRID = 20;
const CELL = canvas.width / GRID;

let snake = [];
let food = {};
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

let score = 0;
let bestScore = Number(localStorage.getItem("snakeBest")) || 0;
let speed = 150;

let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let gameLoop = null;

bestDisplay.textContent = bestScore;

function startGame() {
    clearInterval(gameLoop);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    speed = 150;

    gameRunning = true;
    gamePaused = false;
    gameOver = false;

    scoreDisplay.textContent = score;
    levelDisplay.textContent = "Level 1";
    statusDisplay.textContent = "PLAYING";

    overlay.classList.add("hidden");
    pauseBtn.disabled = false;
    pauseBtn.textContent = "⏸ Pause";

    createFood();
    drawGame();

    gameLoop = setInterval(updateGame, speed);
}

function createFood() {
    const freeCells = [];

    for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
            const occupied = snake.some(
                segment => segment.x === x && segment.y === y
            );

            if (!occupied) {
                freeCells.push({ x, y });
            }
        }
    }

    if (freeCells.length === 0) {
        winGame();
        return;
    }

    food = freeCells[Math.floor(Math.random() * freeCells.length)];
}

function updateGame() {
    if (!gameRunning || gamePaused) return;

    direction = { ...nextDirection };

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= GRID ||
        head.y < 0 ||
        head.y >= GRID
    ) {
        endGame();
        return;
    }

    const eating = head.x === food.x && head.y === food.y;

    // When not eating, the tail moves away, so it is excluded.
    const bodyToCheck = eating ? snake : snake.slice(0, -1);

    // Self collision
    if (bodyToCheck.some(
        segment => segment.x === head.x && segment.y === head.y
    )) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (eating) {
        score += 10;
        scoreDisplay.textContent = score;

        if (score > bestScore) {
            bestScore = score;
            bestDisplay.textContent = bestScore;
            localStorage.setItem("snakeBest", bestScore);
        }

        createFood();

        if (!gameOver) {
            updateDifficulty();
        }
    } else {
        snake.pop();
    }

    drawGame();
}

function updateDifficulty() {
    const level = Math.floor(score / 50) + 1;

    levelDisplay.textContent = `Level ${level}`;

    const newSpeed = Math.max(65, 150 - (level - 1) * 12);

    if (newSpeed !== speed) {
        speed = newSpeed;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, speed);
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background grid
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(canvas.width, i * CELL);
        ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#fb7185";
    ctx.beginPath();
    ctx.arc(
        food.x * CELL + CELL / 2,
        food.y * CELL + CELL / 2,
        CELL / 2.8,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#86efac" : "#22c55e";

        ctx.beginPath();
        ctx.roundRect(
            segment.x * CELL + 1,
            segment.y * CELL + 1,
            CELL - 2,
            CELL - 2,
            5
        );
        ctx.fill();
    });

    // Eyes on the snake's head
    const head = snake[0];
    const eyeX = head.x * CELL + CELL / 2;
    const eyeY = head.y * CELL + CELL / 2;

    ctx.fillStyle = "#10251a";

    const eyeOffset = 4;

    if (direction.x !== 0) {
        ctx.beginPath();
        ctx.arc(eyeX + direction.x * 5, eyeY - eyeOffset, 2, 0, Math.PI * 2);
        ctx.arc(eyeX + direction.x * 5, eyeY + eyeOffset, 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(eyeX - eyeOffset, eyeY + direction.y * 5, 2, 0, Math.PI * 2);
        ctx.arc(eyeX + eyeOffset, eyeY + direction.y * 5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function changeDirection(x, y) {
    if (!gameRunning || gamePaused) return;

    // Prevent a 180-degree turn
    if (x === -direction.x && y === -direction.y) {
        return;
    }

    nextDirection = { x, y };
}

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    const controls = {
        arrowup: [0, -1],
        w: [0, -1],
        arrowdown: [0, 1],
        s: [0, 1],
        arrowleft: [-1, 0],
        a: [-1, 0],
        arrowright: [1, 0],
        d: [1, 0]
    };

    if (controls[key]) {
        event.preventDefault();
        changeDirection(...controls[key]);
    }

    if (key === " ") {
        event.preventDefault();
        togglePause();
    }
});

function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;

    if (gamePaused) {
        clearInterval(gameLoop);
        pauseBtn.textContent = "▶ Resume";
        statusDisplay.textContent = "PAUSED";
    } else {
        gameLoop = setInterval(updateGame, speed);
        pauseBtn.textContent = "⏸ Pause";
        statusDisplay.textContent = "PLAYING";
    }
}

function endGame() {
    clearInterval(gameLoop);

    gameRunning = false;
    gameOver = true;

    pauseBtn.disabled = true;
    statusDisplay.textContent = "GAME OVER";

    overlayIcon.textContent = "💀";
    message.textContent = "Game Over!";
    description.textContent = `Your final score is ${score}. Best score: ${bestScore}.`;
    startBtn.textContent = "Play Again";

    overlay.classList.remove("hidden");
}

function winGame() {
    clearInterval(gameLoop);

    gameRunning = false;
    gameOver = true;

    pauseBtn.disabled = true;
    statusDisplay.textContent = "YOU WON!";

    overlayIcon.textContent = "🏆";
    message.textContent = "Amazing!";
    description.textContent = "You filled the entire board!";
    startBtn.textContent = "Play Again";

    overlay.classList.remove("hidden");
}

// Buttons
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);

// Mobile controls
document.querySelectorAll(".mobile-controls button").forEach(button => {
    button.addEventListener("click", () => {
        const directions = {
            up: [0, -1],
            down: [0, 1],
            left: [-1, 0],
            right: [1, 0]
        };

        changeDirection(...directions[button.dataset.direction]);
    });
});

// Initial screen
drawInitialScreen();

function drawInitialScreen() {
    ctx.fillStyle = "#0c1724";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SNAKE", canvas.width / 2, canvas.height / 2);
}