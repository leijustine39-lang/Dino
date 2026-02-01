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



