  const homeScreen = document.getElementById('home-screen');const gameScreen = document.getElementById('game-screen');
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  const difficultySection = document.getElementById('difficulty-selection');
  const codeInputsContainer = document.getElementById('code-inputs');
  const guessBtn = document.getElementById('guess-btn');
  const messageDiv = document.getElementById('message');
  const triesLeftDiv = document.getElementById('tries-left');
  const restartBtn = document.getElementById('restart-btn');
  const backBtn = document.getElementById('back-btn');
  const instructionText = document.getElementById('instruction-text');

  const ATTEMPTS = 12;

  let secretCode = '';
  let attemptsLeft = ATTEMPTS;
  let digitsCount = 3;
  let codeInputs = [];

  function generateSecretCode() {
    const max = Math.pow(10, digitsCount) - 1;
    const num = Math.floor(Math.random() * (max + 1));
    return num.toString().padStart(digitsCount, '0');
  }

  function createCodeInputs() {
    codeInputsContainer.innerHTML = '';
    codeInputs = [];

    for (let i = 0; i < digitsCount; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'code-digit';
      input.inputMode = 'numeric';
      input.setAttribute('maxlength', '1');
      input.setAttribute('aria-label', `Digit ${i + 1}`);
      input.autocomplete = 'off';

      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, ''); // digits only
        if (input.value.length === 1 && i < digitsCount - 1) {
          codeInputs[i + 1].focus();
        }
      });

      input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && input.value === '' && i > 0) {
          codeInputs[i - 1].focus();
        } else if (e.key === 'Enter') {
          if (i === digitsCount - 1) {
            checkGuess();
          } else {
            codeInputs[i + 1].focus();
          }
        }
      });

      codeInputsContainer.appendChild(input);
      codeInputs.push(input);
    }
  }

  function getGuess() {
    return codeInputs.map(input => input.value || '0').join('');
  }

  function resetInputs() {
    codeInputs.forEach(input => {
      input.value = '';
      input.disabled = false;
      input.style.borderColor = '#f2d9e6';
    });
    codeInputs[0].focus();
  }

  function setAttemptsText() {
    triesLeftDiv.textContent = `Attempts left: ${attemptsLeft}`;
  }

  function endGame() {
    codeInputs.forEach(input => input.disabled = true);
    guessBtn.disabled = true;
  }

  function startGame() {
    secretCode = generateSecretCode();
    attemptsLeft = ATTEMPTS;
    setAttemptsText();
    messageDiv.textContent = '';
    resetInputs();
    guessBtn.disabled = false;
    instructionText.textContent = `Guess the secret ${digitsCount}-digit code 🧐`;
  }
  function checkGuess() {
    const guess = getGuess();

    if (!new RegExp(`^\\d{${digitsCount}}$`).test(guess)) {
      messageDiv.textContent = `Please enter a ${digitsCount}-digit code using digits 0–9.`;
      return;
    }

    attemptsLeft--;
    setAttemptsText();

    if (guess === secretCode) {
      messageDiv.textContent = `🎉 Code cracked! The secret code was ${secretCode}.`;
      endGame();
      return;
    }

    codeInputs.forEach(input => input.style.borderColor = '#f2d9e6');

    let correctPosition = 0;
    let correctDigitWrongPos = 0;

    const secretArr = secretCode.split('');
    const guessArr = guess.split('');

    const secretUsed = Array(digitsCount).fill(false);
    const guessUsed = Array(digitsCount).fill(false);

    // Pass 1: exact matches
    for (let i = 0; i < digitsCount; i++) {
      if (guessArr[i] === secretArr[i]) {
        correctPosition++;
        secretUsed[i] = true;
        guessUsed[i] = true;
        codeInputs[i].style.borderColor = '#8bc34a'; // green for correct position
      }
    }

    // Pass 2: correct digit but wrong position
    for (let i = 0; i < digitsCount; i++) {
      if (!guessUsed[i]) {
        for (let j = 0; j < digitsCount; j++) {
          if (!secretUsed[j] && guessArr[i] === secretArr[j]) {
            correctDigitWrongPos++;
            secretUsed[j] = true;
            codeInputs[i].style.borderColor = '#f4a261'; // orange for correct digit wrong pos
            break;
          }
        }
      }
    }

    const numericGuess = parseInt(guess, 10);
    const numericSecret = parseInt(secretCode, 10);
    const directionHint = numericGuess < numericSecret ? "⬆️ Go higher!" : "⬇️ Go lower!";

    messageDiv.textContent = `Correct position: ${correctPosition}, Correct digit wrong position: ${correctDigitWrongPos}. ${directionHint}`;
    messageDiv.classList.remove('fade-in');
    void messageDiv.offsetWidth;
    messageDiv.classList.add('fade-in');

    if (attemptsLeft <= 0) {
      messageDiv.textContent = `💥 Game over! The secret code was ${secretCode}.`;
      endGame();
    }

    resetInputs();
  }

  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      digitsCount = Number(btn.getAttribute('data-digits'));
      createCodeInputs();
      homeScreen.classList.remove('active');
      gameScreen.classList.add('active');
      difficultySection.classList.add('hidden');
      startGame();
    });
  });

  guessBtn.addEventListener('click', checkGuess);
  restartBtn.addEventListener('click', startGame);

  backBtn.addEventListener('click', () => {
    gameScreen.classList.remove('active');
    homeScreen.classList.add('active');
    difficultySection.classList.remove('hidden');
    messageDiv.textContent = '';
  });
