let playerScore = 0;
let computerScore = 0;

const choices = document.querySelectorAll(".choice");

const result = document.getElementById("result");
const computerChoice = document.getElementById("computerChoice");

const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");

const winner = document.getElementById("winner");
const playAgain = document.getElementById("playAgain");

const options = ["rock", "paper", "scissors"];

choices.forEach(button => {

    button.addEventListener("click", function () {

        let playerChoice = button.dataset.choice;

        let computerPick = options[
            Math.floor(Math.random() * 3)
        ];

        computerChoice.textContent =
            "Computer chose: " + computerPick;

        checkWinner(playerChoice, computerPick);

    });

});

function checkWinner(player, computer) {

    if (player === computer) {

        result.textContent = "It's a Draw!";

    } else {

        switch (player) {

            case "rock":
                if (computer === "scissors") {
                    playerScore++;
                    result.textContent = "You win this round!";
                } else {
                    computerScore++;
                    result.textContent = "Computer wins this round!";
                }
                break;

            case "paper":
                if (computer === "rock") {
                    playerScore++;
                    result.textContent = "You win this round!";
                } else {
                    computerScore++;
                    result.textContent = "Computer wins this round!";
                }
                break;

            case "scissors":
                if (computer === "paper") {
                    playerScore++;
                    result.textContent = "You win this round!";
                } else {
                    computerScore++;
                    result.textContent = "Computer wins this round!";
                }
                break;
        }
    }

    updateScore();

    if (playerScore === 5) {

        winner.textContent = "🎉 You won the game!";

        endGame();

    } else if (computerScore === 5) {

        winner.textContent = "Computer won the game! 🤖";

        endGame();

    }

}

function updateScore() {

    playerScoreDisplay.textContent = playerScore;

    computerScoreDisplay.textContent = computerScore;

}

function endGame() {

    choices.forEach(button => {
        button.disabled = true;
    });

    playAgain.hidden = false;

}

playAgain.addEventListener("click", function () {

    playerScore = 0;
    computerScore = 0;

    updateScore();

    result.textContent = "Make your move!";

    computerChoice.textContent = "Computer: Waiting...";

    winner.textContent = "";

    choices.forEach(button => {
        button.disabled = false;
    });

    playAgain.hidden = true;

});