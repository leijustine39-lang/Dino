// I need the comments so shush
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const cactus2 = document.getElementById('cactus2');
const gameScreen = document.getElementById('gameScreen');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const finalScoreDisplay = document.getElementById('finalScore');
const finalHighScoreDisplay = document.getElementById('finalHighScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const photoBoothScreen = document.getElementById('photoBoothScreen');
const gameWrapper = document.getElementById('gameWrapper');
const selectedDinoDisplay = document.getElementById('selectedDino');

// Buttons
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const changeDinoBtn = document.getElementById('changeDinoBtn');
const changeCharacterBtn = document.getElementById('changeCharacterBtn');
const boothStartBtn = document.getElementById('boothStartBtn');
const mobileStartBtn = document.getElementById('mobileStartBtn');
const mobilePauseBtn = document.getElementById('mobilePauseBtn');
const mobileRestartBtn = document.getElementById('mobileRestartBtn');
const mobileJumpBtn = document.getElementById('mobileJumpBtn');

// Photo Booth Elements
const photoOptions = document.querySelectorAll('.photo-option');

// Game Variables
let isJumping = false;
let isGameRunning = false;
let isGamePaused = false;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameSpeed = 3500;
let cactusSpeed = 3;
let cactus2Speed = 4;
let cactusPositions = [];
let lastCactusTime = 0;
let gameInterval;
let cactusInterval;
let selectedDinoImage = 'roy.png';
let selectedDinoName = 'Roy';

// Initialize Photo Booth
function initPhotoBooth() {
    // Set first photo as selected by default
    photoOptions[0].classList.add('selected');
    
    // Add click handlers to photo options
    photoOptions.forEach(option => {
        option.addEventListener('click', () => {
           
            photoOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedDinoImage = option.getAttribute('data-img');
            selectedDinoName = option.querySelector('.photo-label').textContent;
            selectedDinoDisplay.textContent = selectedDinoName;
            
            dino.style.backgroundImage = `url(${selectedDinoImage})`;
        });
    });
    
    // Start game button handler
    boothStartBtn.addEventListener('click', () => {
        photoBoothScreen.style.display = 'none';
        gameWrapper.style.display = 'block';
        dino.style.backgroundImage = `url(${selectedDinoImage})`;
        initGame();
    });
}

// Initialize Game
function initGame() {
    console.log("Initializing game...");
    
    // Reset all game state
    isJumping = false;
    isGameRunning = false;
    isGamePaused = false;
    score = 0;
    
    // Reset speed
    gameSpeed = 3500;
    cactusSpeed = 3;
    cactus2Speed = 4;
    
    // Update displays
    scoreDisplay.textContent = '00000';
    highScoreDisplay.textContent = 'HI ' + formatScore(highScore);
    
    // Reset dino
    dino.style.bottom = '20px';
    dino.classList.remove('jump');
    dino.style.transform = 'rotate(0deg)';
    
    cactus.style.right = '-100px';
    cactus.style.transform = 'rotate(0deg)';
    cactus.style.display = 'none';
    
    cactus2.style.right = '-100px';
    cactus2.style.transform = 'rotate(0deg)';
    cactus2.style.display = 'none';
    
    // Clear arrays
    cactusPositions = [];
    lastCactusTime = Date.now();
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
    
    // Reset buttons
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
    
    mobileStartBtn.style.display = 'flex';
    mobilePauseBtn.style.display = 'none';
    mobilePauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    clearAllIntervals();
}

// Format Score
function formatScore(num) {
    const str = num.toString();
    return '0'.repeat(Math.max(0, 5 - str.length)) + str;
}

// Clear all intervals
function clearAllIntervals() {
    if (gameInterval) clearInterval(gameInterval);
    if (cactusInterval) clearInterval(cactusInterval);
    gameInterval = null;
    cactusInterval = null;
}

// Start Game
function startGame() {
    console.log("Starting game...");
    if (isGameRunning) return;
    
    isGameRunning = true;
    isGamePaused = false;
    
    // Update buttons
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
    mobileStartBtn.style.display = 'none';
    mobilePauseBtn.style.display = 'flex';
    
    // Start score timer
    gameInterval = setInterval(() => {
        if (!isGamePaused && isGameRunning) {
            score += 1;
            scoreDisplay.textContent = formatScore(score);
        }
    }, 150);
    
    // Start cactus movement
    lastCactusTime = Date.now();
    cactusInterval = setInterval(moveCacti, 20);
}

// Pause Game
function pauseGame() {
    if (!isGameRunning) return;
    
    isGamePaused = !isGamePaused;
    
    if (isGamePaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> RESUME';
        mobilePauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
        mobilePauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

// Move Cacti
function moveCacti() {
    if (!isGameRunning || isGamePaused) return;
    
    const now = Date.now();
    
    // Create new cactus if enough time has passed
    if (now - lastCactusTime > gameSpeed) {
        createCactus();
        lastCactusTime = now;
    }
    
    // Move all active cacti
    for (let i = cactusPositions.length - 1; i >= 0; i--) {
        const cactusObj = cactusPositions[i];
        const element = cactusObj.element;
        
        // Get current position
        let currentRight = parseInt(element.style.right) || -100;
        
        // Move cactus left
        currentRight += cactusObj.speed;
        element.style.right = `${currentRight}px`;
        
        // Remove if off screen
        if (currentRight > window.innerWidth + 100) {
            element.style.display = 'none';
            cactusPositions.splice(i, 1);
            continue;
        }
        
        // Check collision
        if (checkCollision(element)) {
            gameOver();
            return;
        }
    }
}

// Create Cactus
function createCactus() {
    const useFirstCactus = cactusPositions.length % 2 === 0;
    const cactusElement = useFirstCactus ? cactus : cactus2;
    const speed = useFirstCactus ? cactusSpeed : cactus2Speed;
    
    // Reset position and make visible
    cactusElement.style.right = '-100px';
    cactusElement.style.transform = 'rotate(0deg)';
    cactusElement.style.display = 'block';
    
    // Add to tracking array
    cactusPositions.push({
        element: cactusElement,
        speed: speed,
        id: Date.now()
    });
}

// Check Collision
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

// Jump
function jump() {
    if (isJumping || !isGameRunning || isGamePaused) return;
    
    isJumping = true;
    dino.classList.add('jump');
    
    // If game hasn't started, start it
    if (!isGameRunning) {
        startGame();
    }
    
    // Reset after jump
    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 600);
}

// Game Over
function gameOver() {
    console.log("Game over! Score:", score);
    isGameRunning = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
    }
    
    // Clear intervals
    clearAllIntervals();
    
    // Show game over screen
    finalScoreDisplay.textContent = formatScore(score);
    finalHighScoreDisplay.textContent = formatScore(highScore);
    gameOverScreen.style.display = 'flex';
    
    // Reset buttons
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    mobileStartBtn.style.display = 'flex';
    mobilePauseBtn.style.display = 'none';
}

// Show Photo Booth
function showPhotoBooth() {
    gameWrapper.style.display = 'none';
    photoBoothScreen.style.display = 'flex';
    clearAllIntervals();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
    
    if (e.code === 'Enter' && !isGameRunning && gameWrapper.style.display !== 'none') {
        startGame();
    }
    
    if (e.code === 'KeyP' && isGameRunning) {
        pauseGame();
    }
});

// Touch controls
document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.mobile-btn') && !e.target.closest('.mobile-jump-btn')) {
        e.preventDefault();
        jump();
    }
});

// Screen click to jump
gameScreen.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
        jump();
    }
});

// Desktop button listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
    initGame();
    setTimeout(startGame, 100);
});
changeDinoBtn.addEventListener('click', showPhotoBooth);
changeCharacterBtn.addEventListener('click', showPhotoBooth);

// Mobile button listeners
mobileStartBtn.addEventListener('click', startGame);
mobilePauseBtn.addEventListener('click', pauseGame);
mobileRestartBtn.addEventListener('click', initGame);
mobileJumpBtn.addEventListener('click', jump);

// Prevent spacebar scrolling
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
    }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, initializing photo booth...");
    initPhotoBooth();
});

// Pause when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isGameRunning && !isGamePaused) {
        pauseGame();
    }
});

// Handle resize
window.addEventListener('resize', () => {
    if (isGameRunning) {
        cactusPositions.forEach(cactusObj => {
            const element = cactusObj.element;
            const currentRight = parseInt(element.style.right) || -100;
            element.style.right = `${currentRight}px`;
        });
    }
});











