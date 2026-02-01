const dino = document.getElementById('dino');
const cactus1 = document.getElementById('cactus1');
const cactus2 = document.getElementById('cactus2');
const gameScreen = document.getElementById('gameScreen');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const finalScoreDisplay = document.getElementById('finalScore');
const finalHighScoreDisplay = document.getElementById('finalHighScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const photoBoothScreen = document.getElementById('photoBoothScreen');
const gameWrapper = document.getElementById('gameWrapper');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const changeDinoBtn = document.getElementById('changeDinoBtn');
const changeCharacterBtn = document.getElementById('changeCharacterBtn');
const boothStartBtn = document.getElementById('boothStartBtn');

const photoOptions = document.querySelectorAll('.photo-option');

let isJumping = false;
let isGameRunning = false;
let isGamePaused = false;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameSpeed = 2000;
let cactusSpeed = 3;
let cactusPositions = [];
let lastCactusTime = 0;
let gameInterval;
let cactusInterval;
let selectedColor = '#4CAF50';

photoOptions.forEach(option => {
    option.addEventListener('click', () => {
        photoOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedColor = option.getAttribute('data-color');
        dino.style.backgroundColor = selectedColor;
    });
});

boothStartBtn.addEventListener('click', () => {
    photoBoothScreen.style.display = 'none';
    gameWrapper.style.display = 'block';
    dino.style.backgroundColor = selectedColor;
    initGame();
});

function initGame() {
    isJumping = false;
    isGameRunning = false;
    isGamePaused = false;
    score = 0;
    gameSpeed = 2000;
    cactusSpeed = 3;
    
    scoreDisplay.textContent = '00000';
    highScoreDisplay.textContent = 'HI ' + formatScore(highScore);
    
    dino.style.bottom = '20px';
    dino.classList.remove('jump');
    dino.style.backgroundColor = selectedColor;
    
    cactus1.style.right = '-100px';
    cactus1.style.display = 'none';
    cactus1.style.backgroundColor = selectedColor;
    
    cactus2.style.right = '-100px';
    cactus2.style.display = 'none';
    cactus2.style.backgroundColor = selectedColor;
    
    cactusPositions = [];
    lastCactusTime = Date.now();
    
    gameOverScreen.style.display = 'none';
    
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    
    clearAllIntervals();
}

function formatScore(num) {
    const str = num.toString();
    return '0'.repeat(Math.max(0, 5 - str.length)) + str;
}

function clearAllIntervals() {
    if (gameInterval) clearInterval(gameInterval);
    if (cactusInterval) clearInterval(cactusInterval);
    gameInterval = null;
    cactusInterval = null;
}

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    isGamePaused = false;
    
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    
    gameInterval = setInterval(() => {
        if (!isGamePaused && isGameRunning) {
            score += 1;
            scoreDisplay.textContent = formatScore(score);
        }
    }, 100);
    
    lastCactusTime = Date.now();
    cactusInterval = setInterval(moveCacti, 20);
}

function pauseGame() {
    if (!isGameRunning) return;
    
    isGamePaused = !isGamePaused;
    
    if (isGamePaused) {
        pauseBtn.textContent = 'RESUME';
    } else {
        pauseBtn.textContent = 'PAUSE';
    }
}

function moveCacti() {
    if (!isGameRunning || isGamePaused) return;
    
    const now = Date.now();
    
    if (now - lastCactusTime > gameSpeed) {
        createCactus();
        lastCactusTime = now;
    }
    
    for (let i = cactusPositions.length - 1; i >= 0; i--) {
        const cactusObj = cactusPositions[i];
        const element = cactusObj.element;
        
        let currentRight = parseInt(element.style.right) || -100;
        currentRight += cactusObj.speed;
        element.style.right = `${currentRight}px`;
        
        if (currentRight > window.innerWidth + 100) {
            element.style.display = 'none';
            cactusPositions.splice(i, 1);
            continue;
        }
        
        if (checkCollision(element)) {
            gameOver();
            return;
        }
    }
}

function createCactus() {
    const useFirstCactus = cactusPositions.length % 2 === 0;
    const cactusElement = useFirstCactus ? cactus1 : cactus2;
    
    cactusElement.style.right = '-100px';
    cactusElement.style.display = 'block';
    cactusElement.style.backgroundColor = selectedColor;
    
    cactusPositions.push({
        element: cactusElement,
        speed: cactusSpeed,
        id: Date.now()
    });
}

function checkCollision(cactusElement) {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactusElement.getBoundingClientRect();
    
    const collisionMargin = 15;
    
    const isColliding = !(
        dinoRect.right - collisionMargin < cactusRect.left ||
        dinoRect.left + collisionMargin > cactusRect.right ||
        dinoRect.bottom - collisionMargin < cactusRect.top ||
        dinoRect.top + collisionMargin > cactusRect.bottom
    );
    
    return isColliding;
}

function jump() {
    if (isJumping || !isGameRunning || isGamePaused) return;
    
    isJumping = true;
    dino.classList.add('jump');
    
    if (!isGameRunning) {
        startGame();
    }
    
    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 500);
}

function gameOver() {
    isGameRunning = false;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
    }
    
    clearAllIntervals();
    
    finalScoreDisplay.textContent = formatScore(score);
    finalHighScoreDisplay.textContent = formatScore(highScore);
    gameOverScreen.style.display = 'flex';
    
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
}

function showPhotoBooth() {
    gameWrapper.style.display = 'none';
    photoBoothScreen.style.display = 'flex';
    clearAllIntervals();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

gameScreen.addEventListener('click', () => {
    jump();
});

gameScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
    initGame();
    setTimeout(startGame, 100);
});
changeDinoBtn.addEventListener('click', showPhotoBooth);
changeCharacterBtn.addEventListener('click', showPhotoBooth);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    dino.style.backgroundColor = selectedColor;
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && isGameRunning && !isGamePaused) {
        pauseGame();
    }
});








