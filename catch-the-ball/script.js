const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const missesDisplay = document.getElementById("misses");
const overlay = document.getElementById("overlay");
const gameMessage = document.getElementById("gameMessage");
const startBtn = document.getElementById("startBtn");

let balls = [];
let score = 0;
let misses = 0;
let basketX = 0;
let gameRunning = false;
let animationId;
let spawnInterval;

const ballSize = 28;
const basketWidth = 65;

// Start game
function startGame() {
    cancelAnimationFrame(animationId);
    clearInterval(spawnInterval);

    balls.forEach(ball => ball.element.remove());
    balls = [];

    score = 0;
    misses = 0;
    basketX = (gameArea.clientWidth - basketWidth) / 2;

    scoreDisplay.textContent = score;
    missesDisplay.textContent = misses;

    basket.style.left = basketX + "px";

    gameRunning = true;
    overlay.classList.add("hidden");

    spawnInterval = setInterval(createBall, 900);

    animationId = requestAnimationFrame(updateGame);
}

// Create a falling ball
function createBall() {
    if (!gameRunning) return;

    const element = document.createElement("div");
    element.classList.add("ball");

    const x = Math.random() * (gameArea.clientWidth - ballSize);

    element.style.left = x + "px";
    element.style.top = "0px";

    gameArea.appendChild(element);

    balls.push({
        element: element,
        x: x,
        y: 0,
        speed: 2 + Math.random() * 2
    });
}

// Move basket
document.addEventListener("keydown", function(event) {
    if (!gameRunning) return;

    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
        basketX -= 25;
    }

    if (key === "arrowright" || key === "d") {
        basketX += 25;
    }

    basketX = Math.max(
        0,
        Math.min(basketX, gameArea.clientWidth - basketWidth)
    );

    basket.style.left = basketX + "px";
});

// Game animation
function updateGame() {
    if (!gameRunning) return;

    const basketY = gameArea.clientHeight - 65;

    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        ball.y += ball.speed;
        ball.element.style.top = ball.y + "px";

        // Check collision
        const caught =
            ball.x + ballSize > basketX &&
            ball.x < basketX + basketWidth &&
            ball.y + ballSize >= basketY &&
            ball.y <= basketY + 55;

        if (caught) {
            score++;
            scoreDisplay.textContent = score;

            ball.element.remove();
            balls.splice(i, 1);
            continue;
        }

        // Check missed ball
        if (ball.y > gameArea.clientHeight) {
            misses++;
            missesDisplay.textContent = misses;

            ball.element.remove();
            balls.splice(i, 1);

            if (misses >= 3) {
                endGame();
                return;
            }
        }
    }

    animationId = requestAnimationFrame(updateGame);
}

// End game
function endGame() {
    gameRunning = false;

    clearInterval(spawnInterval);
    cancelAnimationFrame(animationId);

    gameMessage.textContent = `Game Over! Final Score: ${score}`;
    startBtn.textContent = "Play Again";

    overlay.classList.remove("hidden");
}

// Start button
startBtn.addEventListener("click", startGame);