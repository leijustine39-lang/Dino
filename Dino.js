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

function initPhotoBooth() {
    photoOptions.forEach(option => {
        const color = option.getAttribute('data-color');
        option.querySelector('.photo-preview').style.backgroundColor = color;
        
        option.addEventListener('click', () => {
            photoOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedColor = color;
        });
    });
    
    boothStartBtn.addEventListener('click', startGameFromBooth);
}

function startGameFromBooth() {
    photoBoothScreen.style.display = 'none';
    gameWrapper.style.display = 'block';
    dino.style.backgroundColor = selectedColor;
    initGame();
}

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
    pauseBtn.textContent = 'PAUSE';
    
    clearAllIntervals();
}

function formatScore(num) {
    return num.toString().padStart(5, '0');
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
    pauseBtn.textContent = isGamePaused ? 'RESUME' : 'PAUSE';
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
        element.style.right = currentRight + 'px';
        
        if (currentRight > window.innerWidth) {
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
    
    const collisionMargin = 10;
    
    return !(
        dinoRect.right - collisionMargin < cactusRect.left ||
        dinoRect.left + collisionMargin > cactusRect.right ||
        dinoRect.bottom - collisionMargin < cactusRect.top ||
        dinoRect.top + collisionMargin > cactusRect.bottom
    );
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
    
    if (e.code === 'Enter' && !isGameRunning && gameWrapper.style.display !== 'none') {
        startGame();
    }
});

gameScreen.addEventListener('click', (e) => {
    if (e.target === gameScreen || e.target === dino) {
        jump();
    }
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
    initPhotoBooth();
    dino.style.backgroundColor = selectedColor;
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && isGameRunning && !isGamePaused) {
        pauseGame();
    }
});    option.addEventListener('click', () => {
        photoOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedColor = option.getAttribute('data-color');
        option.querySelector('.photo-preview').style.backgroundColor = selectedColor;
    });
});

photoOptions[0].querySelector('.photo-preview').style.backgroundColor = '#4CAF50';
photoOptions[1].querySelector('.photo-preview').style.backgroundColor = '#ff6b6b';
photoOptions[2].querySelector('.photo-preview').style.backgroundColor = '#4ecdc4';
photoOptions[3].querySelector('.photo-preview').style.backgroundColor = '#ffe66d';

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
    
    cactus1.style.right = '-100px';
    cactus1.style.display = 'none';
    cactus2.style.right = '-100px';
    cactus2.style.display = 'none';
    
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
    
    if (e.code === 'Enter' && !isGameRunning && gameWrapper.style.display !== 'none') {
        startGame();
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
    initGame();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && isGameRunning && !isGamePaused) {
        pauseGame();
    }
});let gameSpeed = 3500;
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
});                    <div class="image-number">2</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="image-preview">
                    <div class="image-number">3</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="image-preview">
                    <div class="image-number">4</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
            </div>
           
            <button class="select-button" id="selectDinoButton" disabled>Select as Dino & Start Game</button>
        </div>
       
        <div class="game-container" id="gameContainer">
            <h2 class="game-title">Dino Game <span id="dinoPlayerName"></span></h2>
            <div class="game">
                <div id="player"></div>
                <div id="cactus"></div>
            </div>
            <p class="hint">Press SPACE or click to jump</p>
        </div>
    `;
   
    document.body.innerHTML = photoboothHTML;
   
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const selectDinoButton = document.getElementById('selectDinoButton');
    const dinoPlayerName = document.getElementById('dinoPlayerName');
    const photoboothContainer = document.getElementById('photoboothContainer');
    const gameContainer = document.getElementById('gameContainer');
   
    let uploadedImages = [];
   
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });
   
    imageUpload.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
       
        files.forEach((file, index) => {
            if (uploadedImages.length >= 4) return;
           
            const reader = new FileReader();
           
            reader.onload = (e) => {
                uploadedImages.push({
                    id: uploadedImages.length,
                    src: e.target.result,
                    name: `Dino ${uploadedImages.length + 1}`
                });
               
                updateImagePreviews();
               
                if (uploadedImages.length >= 1) {
                    selectDinoButton.disabled = false;
                }
            };
           
            reader.readAsDataURL(file);
        });
       
        event.target.value = '';
    });
   
    function updateImagePreviews() {
        const previews = imagePreviewContainer.querySelectorAll('.image-preview');
       
        previews.forEach((preview, index) => {
            if (index < uploadedImages.length) {
                const image = uploadedImages[index];
                preview.innerHTML = `
                    <div class="image-number">${index + 1}</div>
                    <img src="${image.src}" alt="${image.name}">
                `;
               
                preview.addEventListener('click', () => {
                    previews.forEach(p => p.classList.remove('selected'));
                    preview.classList.add('selected');
                    selectedImage = image;
                });
            } else {
                preview.innerHTML = `
                    <div class="image-number">${index + 1}</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                `;
                preview.onclick = null;
            }
        });
    }
   
    selectDinoButton.addEventListener('click', () => {
        if (!selectedImage && uploadedImages.length > 0) {
            selectedImage = uploadedImages[0];
        }
       
        if (!selectedImage) return;
       
        const playerElement = document.getElementById('player');
        playerElement.style.backgroundImage = `url('${selectedImage.src}')`;
       
        dinoPlayerName.textContent = `- ${selectedImage.name}`;
       
        photoboothContainer.style.display = 'none';
        gameContainer.style.display = 'flex';
       
        gameStarted = true;
        alert('Game starting! Press SPACE or click to jump over cacti!');
    });
   
    updateImagePreviews();
});


function jump() {
    if (!gameStarted) return;
    if (isJumping) return;
   
    isJumping = true;
    const playerElement = document.getElementById('player');
    playerElement.classList.add('jump');
   
    setTimeout(() => {
        playerElement.classList.remove('jump');
        isJumping = false;
    }, 500);
}


function increaseScore() {
    if (gameStarted && !isGameOver) {
        score++;
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${score}`;
       
        if (score % 100 === 0) {
            const cactus = document.getElementById('cactus');
            const currentSpeed = parseFloat(getComputedStyle(cactus).animationDuration);
            cactus.style.animationDuration = `${Math.max(0.5, currentSpeed * 0.9)}s`;
        }
    }
}


setInterval(increaseScore, 100);


function checkCollision() {
    if (!gameStarted || isGameOver) return;
   
    const playerElement = document.getElementById('player');
    const cactusElement = document.getElementById('cactus');
   
    const playerRect = playerElement.getBoundingClientRect();
    const cactusRect = cactusElement.getBoundingClientRect();
    const gameRect = document.querySelector('.game').getBoundingClientRect();
   
    const playerLeft = playerRect.left - gameRect.left;
    const playerRight = playerRect.right - gameRect.left;
    const playerBottom = playerRect.bottom - gameRect.top;
   
    const cactusLeft = cactusRect.left - gameRect.left;
    const cactusRight = cactusRect.right - gameRect.left;
    const cactusTop = cactusRect.top - gameRect.top;
   
    if (
        playerRight > cactusLeft + 10 &&
        playerLeft < cactusRight - 10 &&
        playerBottom > cactusTop
    ) {
        if (!isGameOver) {
            isGameOver = true;
           
            cactusElement.style.animationPlayState = 'paused';
           
            setTimeout(() => {
                const playAgain = confirm(`Game Over!\nFinal Score: ${score}\n\nPlay again?`);
                if (playAgain) {
                    location.reload();
                }
            }, 100);
        }
    }
}


document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        jump();
    }
   
    if (event.code === "KeyR" && isGameOver) {
        location.reload();
    }
});


document.addEventListener("click", function() {
    jump();
});


setInterval(checkCollision, 10);
const player = document.getElementById("player");
const cactus = document.getElementById("cactus");
let isJumping = false;
let score = 0;
let gameStarted = false;
let isGameOver = false;
let selectedImage = null;


const scoreElement = document.createElement("div");
scoreElement.id = "score";
scoreElement.textContent = `Score: ${score}`;
document.body.insertBefore(scoreElement, document.querySelector(".game"));


document.addEventListener('DOMContentLoaded', function() {
    const photoboothHTML = `
        <div class="photobooth-container" id="photoboothContainer">
            <h2 class="photobooth-title">Photobooth Dino Game</h2>
            <p class="photobooth-subtitle">Upload at least 1 image, then select it to be your dino player!</p>
           
            <div class="upload-area" id="uploadArea">
                <i class="fas fa-camera"></i>
                <h3>Click to upload images</h3>
                <p>Upload 1-4 images to choose from</p>
                <input type="file" id="imageUpload" accept="image/*" multiple style="display: none;">
            </div>
           
            <div class="image-preview-container" id="imagePreviewContainer">
                <div class="image-preview">
                    <div class="image-number">1</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="image-preview">
                    <div class="image-number">2</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="image-preview">
                    <div class="image-number">3</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="image-preview">
                    <div class="image-number">4</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
            </div>
           
            <button class="select-button" id="selectDinoButton" disabled>Select as Dino & Start Game</button>
        </div>
       
        <div class="game-container" id="gameContainer">
            <h2 class="game-title">Dino Game <span id="dinoPlayerName"></span></h2>
            <div class="game">
                <div id="player"></div>
                <div id="cactus"></div>
            </div>
            <p class="hint">Press SPACE or click to jump</p>
        </div>
    `;
   
    document.body.innerHTML = photoboothHTML;
   
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const selectDinoButton = document.getElementById('selectDinoButton');
    const dinoPlayerName = document.getElementById('dinoPlayerName');
    const photoboothContainer = document.getElementById('photoboothContainer');
    const gameContainer = document.getElementById('gameContainer');
   
    let uploadedImages = [];
   
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });
   
    imageUpload.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
       
        files.forEach((file, index) => {
            if (uploadedImages.length >= 4) return;
           
            const reader = new FileReader();
           
            reader.onload = (e) => {
                uploadedImages.push({
                    id: uploadedImages.length,
                    src: e.target.result,
                    name: `Dino ${uploadedImages.length + 1}`
                });
               
                updateImagePreviews();
               
                if (uploadedImages.length >= 1) {
                    selectDinoButton.disabled = false;
                }
            };
           
            reader.readAsDataURL(file);
        });
       
        event.target.value = '';
    });
   
    function updateImagePreviews() {
        const previews = imagePreviewContainer.querySelectorAll('.image-preview');
       
        previews.forEach((preview, index) => {
            if (index < uploadedImages.length) {
                const image = uploadedImages[index];
                preview.innerHTML = `
                    <div class="image-number">${index + 1}</div>
                    <img src="${image.src}" alt="${image.name}">
                `;
               
                preview.addEventListener('click', () => {
                    previews.forEach(p => p.classList.remove('selected'));
                    preview.classList.add('selected');
                    selectedImage = image;
                });
            } else {
                preview.innerHTML = `
                    <div class="image-number">${index + 1}</div>
                    <div class="empty-preview">
                        <i class="fas fa-image"></i>
                    </div>
                `;
                preview.onclick = null;
            }
        });
    }
   
    selectDinoButton.addEventListener('click', () => {
        if (!selectedImage && uploadedImages.length > 0) {
            selectedImage = uploadedImages[0];
        }
       
        if (!selectedImage) return;
       
        const playerElement = document.getElementById('player');
        playerElement.style.backgroundImage = `url('${selectedImage.src}')`;
       
        dinoPlayerName.textContent = `- ${selectedImage.name}`;
       
        photoboothContainer.style.display = 'none';
        gameContainer.style.display = 'flex';
       
        gameStarted = true;
        alert('Game starting! Press SPACE or click to jump over cacti!');
    });
   
    updateImagePreviews();
});


function jump() {
    if (!gameStarted) return;
    if (isJumping) return;
   
    isJumping = true;
    const playerElement = document.getElementById('player');
    playerElement.classList.add('jump');
   
    setTimeout(() => {
        playerElement.classList.remove('jump');
        isJumping = false;
    }, 500);
}


function increaseScore() {
    if (gameStarted && !isGameOver) {
        score++;
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Score: ${score}`;
       
        if (score % 100 === 0) {
            const cactus = document.getElementById('cactus');
            const currentSpeed = parseFloat(getComputedStyle(cactus).animationDuration);
            cactus.style.animationDuration = `${Math.max(0.5, currentSpeed * 0.9)}s`;
        }
    }
}


setInterval(increaseScore, 100);


function checkCollision() {
    if (!gameStarted || isGameOver) return;
   
    const playerElement = document.getElementById('player');
    const cactusElement = document.getElementById('cactus');
   
    const playerRect = playerElement.getBoundingClientRect();
    const cactusRect = cactusElement.getBoundingClientRect();
    const gameRect = document.querySelector('.game').getBoundingClientRect();
   
    const playerLeft = playerRect.left - gameRect.left;
    const playerRight = playerRect.right - gameRect.left;
    const playerBottom = playerRect.bottom - gameRect.top;
   
    const cactusLeft = cactusRect.left - gameRect.left;
    const cactusRight = cactusRect.right - gameRect.left;
    const cactusTop = cactusRect.top - gameRect.top;
   
    if (
        playerRight > cactusLeft + 10 &&
        playerLeft < cactusRight - 10 &&
        playerBottom > cactusTop
    ) {
        if (!isGameOver) {
            isGameOver = true;
           
            cactusElement.style.animationPlayState = 'paused';
           
            setTimeout(() => {
                const playAgain = confirm(`Game Over!\nFinal Score: ${score}\n\nPlay again?`);
                if (playAgain) {
                    location.reload();
                }
            }, 100);
        }
    }
}


document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        jump();
    }
   
    if (event.code === "KeyR" && isGameOver) {
        location.reload();
    }
});


document.addEventListener("click", function() {
    jump();
});


setInterval(checkCollision, 10);






