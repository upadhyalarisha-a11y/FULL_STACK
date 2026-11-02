const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const speedDisplay = document.getElementById("speed");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

let playerLane = 1;
let obstacles = [];
let score = 0;
let time = 0;
let speed = 3;
let gameRunning = false;

let animationId;
let spawnInterval;
let timerInterval;

const lanes = [0, 1, 2];

function startGame() {
    cancelAnimationFrame(animationId);
    clearInterval(spawnInterval);
    clearInterval(timerInterval);

    obstacles.forEach(obstacle => obstacle.element.remove());
    obstacles = [];

    playerLane = 1;
    score = 0;
    time = 0;
    speed = 3;

    updateScoreboard();
    player.style.left = "33.33%";

    gameRunning = true;
    overlay.classList.add("hidden");

    spawnInterval = setInterval(createObstacle, 1000);

    timerInterval = setInterval(() => {
        time++;

        if (time % 10 === 0) {
            speed += 1;
        }

        updateScoreboard();
    }, 1000);

    animationId = requestAnimationFrame(updateGame);
}

function updateScoreboard() {
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    speedDisplay.textContent = (speed / 3).toFixed(1);
}

function createObstacle() {
    if (!gameRunning) return;

    const lane = lanes[Math.floor(Math.random() * 3)];

    const element = document.createElement("div");
    element.classList.add("obstacle");
    element.textContent = "🚧";
    element.style.left = (lane * 33.33) + "%";
    element.style.top = "-45px";

    gameArea.appendChild(element);

    obstacles.push({
        element: element,
        lane: lane,
        y: -45
    });
}

document.addEventListener("keydown", event => {
    if (!gameRunning) return;

    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
        event.preventDefault();
        playerLane = Math.max(0, playerLane - 1);
    }

    if (key === "arrowright" || key === "d") {
        event.preventDefault();
        playerLane = Math.min(2, playerLane + 1);
    }

    player.style.left = (playerLane * 33.33) + "%";
});

function updateGame() {
    if (!gameRunning) return;

    const playerRect = player.getBoundingClientRect();

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];

        obstacle.y += speed;
        obstacle.element.style.top = obstacle.y + "px";

        const obstacleRect = obstacle.element.getBoundingClientRect();

        // Collision detection using getBoundingClientRect()
        const collision =
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top;

        if (collision) {
            endGame();
            return;
        }

        // Remove obstacles that leave the game area
        if (obstacle.y > gameArea.clientHeight) {
            obstacle.element.remove();
            obstacles.splice(i, 1);
            score++;
            updateScoreboard();
        }
    }

    animationId = requestAnimationFrame(updateGame);
}

function endGame() {
    gameRunning = false;

    clearInterval(spawnInterval);
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);

    message.textContent = `Game Over! Score: ${score}`;
    startBtn.textContent = "Play Again";

    overlay.classList.remove("hidden");
}

startBtn.addEventListener("click", startGame);