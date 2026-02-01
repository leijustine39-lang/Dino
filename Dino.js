const photoBooth = document.getElementById('photoBooth');
const gameContainer = document.getElementById('gameContainer');
const dinoSelects = document.querySelectorAll('.dino-select');
const startGameBtn = document.getElementById('startGame');
const changeDinoBtn = document.getElementById('changeDino');
const goMenuBtn = document.getElementById('goMenu');
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const gameOver = document.getElementById('gameOver');
const playAgainBtn = document.getElementById('playAgain');

let currentColor = '#4CAF50';
let isJumping = false;
let isGameRunning = false;
let score = 0;
let cactusPosition = -50;
let cactusInterval;
let scoreInterval;

dinoSelects.forEach(select => {
    select.addEventListener('click', function() {
        dinoSelects.forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        currentColor = this.getAttribute('data-color');
    });
});

startGameBtn.addEventListener('click', function() {
    photoBooth.style.display = 'none';
    gameContainer.style.display = 'block';
    dino.style.backgroundColor = currentColor;
    startGame();
});

changeDinoBtn.addEventListener('click', function() {
    gameContainer.style.display = 'none';
    photoBooth.style.display = 'block';
    stopGame();
});

goMenuBtn.addEventListener('click', function() {
    gameOver.style.display = 'none';
    photoBooth.style.display = 'block';
    stopGame();
});

playAgainBtn.addEventListener('click', function() {
    gameOver.style.display = 'none';
    startGame();
});

function startGame() {
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = score;
    cactusPosition = -50;
    cactus.style.right = cactusPosition + 'px';
    dino.classList.remove('jump');
    dino.style.bottom = '0';
    dino.style.backgroundColor = currentColor;
    
    scoreInterval = setInterval(function() {
        if (isGameRunning) {
            score++;
            scoreDisplay.textContent = score;
        }
    }, 100);
    
    cactusInterval = setInterval(moveCactus, 20);
}

function moveCactus() {
    if (!isGameRunning) return;
    
    cactusPosition += 5;
    cactus.style.right = cactusPosition + 'px';
    
    if (cactusPosition > window.innerWidth) {
        cactusPosition = -50;
    }
    
    if (checkCollision()) {
        gameEnd();
    }
}

function jump() {
    if (isJumping || !isGameRunning) return;
    
    isJumping = true;
    dino.classList.add('jump');
    
    setTimeout(function() {
        dino.classList.remove('jump');
        isJumping = false;
    }, 500);
}

function checkCollision() {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    
    return !(dinoRect.right < cactusRect.left ||
             dinoRect.left > cactusRect.right ||
             dinoRect.bottom < cactusRect.top ||
             dinoRect.top > cactusRect.bottom);
}

function gameEnd() {
    isGameRunning = false;
    finalScoreDisplay.textContent = score;
    gameOver.style.display = 'flex';
    stopGame();
}

function stopGame() {
    clearInterval(scoreInterval);
    clearInterval(cactusInterval);
    isJumping = false;
}

gameArea.addEventListener('click', jump);

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});







