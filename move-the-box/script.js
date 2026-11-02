const player = document.getElementById("player");
const goal = document.getElementById("goal");
const gameArea = document.getElementById("gameArea");
const status = document.getElementById("status");

let x = 0;
let y = 0;
const speed = 10;
const size = 35;

let gameWon = false;

document.addEventListener("keydown", function(e) {

    if (gameWon) return;

    switch(e.key.toLowerCase()) {

        case "arrowup":
        case "w":
            y -= speed;
            break;

        case "arrowdown":
        case "s":
            y += speed;
            break;

        case "arrowleft":
        case "a":
            x -= speed;
            break;

        case "arrowright":
        case "d":
            x += speed;
            break;

        default:
            return;
    }

    // Boundary checks

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    if (x > gameArea.clientWidth - size)
        x = gameArea.clientWidth - size;

    if (y > gameArea.clientHeight - size)
        y = gameArea.clientHeight - size;

    // Update player position

    player.style.left = x + "px";
    player.style.top = y + "px";

    // Check collision with goal

    if (
        x < goal.offsetLeft + size &&
        x + size > goal.offsetLeft &&
        y < goal.offsetTop + size &&
        y + size > goal.offsetTop
    ) {
        status.textContent = "🎉 You reached the goal!";
        gameWon = true;
    }

});


// Restart game

document.getElementById("resetBtn").addEventListener("click", function() {

    x = 0;
    y = 0;
    gameWon = false;

    player.style.left = "0px";
    player.style.top = "0px";

    status.textContent = "Find the goal!";

});