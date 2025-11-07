const gridContainer = document.getElementById("grid");
      const cards = gridContainer.getElementsByClassName("number-card");
      const startBtn = document.getElementById("start");
      const timerDisplay = document.getElementById("timer");
      const scoreDisplay = document.getElementById("score");
      const messageBox = document.getElementById("message-box");
      const messageText = document.getElementById("message-text");
      const playAgainBtn = document.getElementById("play-again");
      const gameTitle = document.getElementById("game-title");

      let numbers = [];
      let userClicks = [];
      let gameStarted = false;
      let memorizePhase = true;
      let timeLeft = 10;
      let timerInterval = null;
      let score = 0;
      let level = 1;

      startBtn.onclick = () => startGame();
      playAgainBtn.onclick = () => {
        messageBox.classList.remove("show");
        level = 1;
        score = 0;
        scoreDisplay.textContent = "Score : " + score;
        startGame();
      };

      function startGame() {
        if (timerInterval) clearInterval(timerInterval);

        numbers = [];
        userClicks = [];
        gameStarted = true;
        memorizePhase = true;
        timeLeft = 10 - (level - 1) * 2;
        if (timeLeft < 4) timeLeft = 4;

        gameTitle.textContent = `Level ${level} — Memorize the positions!`;
        timerDisplay.textContent = "Time : " + timeLeft;
        startBtn.style.display = "none";

        while (numbers.length < 9) {
          const n = Math.floor(Math.random() * 9) + 1;
          if (!numbers.includes(n)) numbers.push(n);
        }

        for (let i = 0; i < cards.length; i++) {
          cards[i].textContent = numbers[i];
          cards[i].classList.remove("selected", "wrong");
          cards[i].style.pointerEvents = "none";
        }

        timerInterval = setInterval(() => {
          timeLeft--;
          timerDisplay.textContent = "Time : " + timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            setTimeout(() => {
              for (let i = 0; i < cards.length; i++) {
                cards[i].textContent = "";
                cards[i].style.pointerEvents = "auto";
              }
              memorizePhase = false;
              gameTitle.textContent = `Level ${level} — Click them in order!`;
              timerDisplay.textContent = "Your turn!";
            }, 300);
          }
        }, 1000);
      }

      for (let i = 0; i < cards.length; i++) {
        cards[i].onclick = function () {
          if (!gameStarted || memorizePhase) return;

          const index = parseInt(this.getAttribute("data-index"), 10);
          const clickedNumber = numbers[index];
          const expected = userClicks.length + 1;
          this.textContent = clickedNumber;

          if (clickedNumber === expected) {
            this.classList.add("selected");
            userClicks.push(clickedNumber);
            score += 10;
            scoreDisplay.textContent = "Score : " + score;

            if (userClicks.length === 9) {
              gameStarted = false;
              for (let j = 0; j < cards.length; j++)
                cards[j].style.pointerEvents = "none";
              if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
              }

              setTimeout(() => {
                if (level < 3) {
                  level++;
                  showMessage(
                    `🎉 Level ${
                      level - 1
                    } Complete! 🎉<br>Get ready for Level ${level}!`
                  );
                  setTimeout(() => {
                    messageBox.classList.remove("show");
                    startGame();
                  }, 1500);
                } else {
                  showMessage(
                    `You Win All Levels! <br>Final Score: ${score}`
                  );
                }
              }, 600);
            }
          } else {
            this.classList.add("wrong");
            gameStarted = false;
            for (let j = 0; j < cards.length; j++)
              cards[j].style.pointerEvents = "none";
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
            setTimeout(() => {
              showMessage("Game Over!<br>Wrong order. Try again!");
            }, 500);
          }
        };
      }

      function showMessage(text) {
        messageText.innerHTML = text;
        messageBox.classList.add("show");
        startBtn.style.display = "inline-block";
      }