const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score-display');
const healthDisplay = document.getElementById('health-display');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// साउंड एलीमेंट्स
const shootSound = document.getElementById('shootSound');
const upgradeSound = document.getElementById('upgradeSound');
const bgMusic = document.getElementById('bgMusic');

let gameRunning = false;
let score = 0;
let health = 100;
let bulletCount = 1; // फायर काउंट, जो अपग्रेड से बढ़ेगा

// स्क्रीन का आकार सेट करें
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// रॉकेट (प्लेयर) ऑब्जेक्ट
let player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 10,
    draw: function() {
        // रॉकेट के लिए एक त्रिकोण (Triangle) ड्रा करें
        ctx.fillStyle = 'skyblue';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
};

let bullets = [];
let asteroids = [];
let powerups = [];

// ... [गेम लॉजिक फ़ंक्शंस: अपडेट, ड्रा, कोलाइज़न डिटेक्शन] ...

// रॉकेट को हिलाने के लिए टच कंट्रोल (अंगूठे से लेफ्ट-राइट)
canvas.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault(); // पेज स्क्रॉलिंग को रोकता है
    const touchX = e.touches[0].clientX;
    
    // रॉकेट को टच की जगह पर ले जाएँ (सिर्फ X-axis पर)
    player.x = touchX;

    // रॉकेट को स्क्रीन की सीमा के अंदर रखें
    if (player.x < player.width / 2) {
        player.x = player.width / 2;
    }
    if (player.x > canvas.width - player.width / 2) {
        player.x = canvas.width - player.width / 2;
    }
});

// गेम स्टार्ट फ़ंक्शन
function startGame() {
    gameRunning = true;
    score = 0;
    health = 100;
    bulletCount = 1; // रिसेट
    asteroids = [];
    bullets = [];
    powerups = [];
    
    scoreDisplay.textContent = `स्कोर: ${score}`;
    healthDisplay.textContent = `स्वास्थ्य: ${health}%`;
    startButton.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    // म्यूजिक प्ले करें (ब्राउज़र की ऑटोप्ले पॉलिसी के कारण यह टच के बाद ही काम करेगा)
    bgMusic.play().catch(e => console.log("Music play failed:", e)); 
    
    gameLoop();
}

// गेम लूप (Main Game Loop)
function gameLoop() {
    if (!gameRunning) return;
    
    // 1. कैनवास को साफ़ करें
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. अपडेट लॉजिक (पत्थरों को हिलाना, शूट करना, टक्कर चेक करना)
    updateGame();

    // 3. ड्रा लॉजिक (सभी चीज़ों को स्क्रीन पर दिखाना)
    drawGame();

    // 4. अगले फ्रेम के लिए फिर से बुलाना
    requestAnimationFrame(gameLoop);
}

// ... [यहाँ `updateGame()` और `drawGame()` फ़ंक्शंस की डिटेल कोडिंग आएगी] ...

// गेम ओवर फ़ंक्शन
function gameOver() {
    gameRunning = false;
    bgMusic.pause();
    bgMusic.currentTime = 0; // म्यूजिक को रीसेट करें
    finalScoreDisplay.textContent = `आपका स्कोर: ${score}`;
    gameOverScreen.style.display = 'flex';
}

// इवेंट लिसनर्स
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// एक उदाहरण: शूटिंग फ़ंक्शन (गेम लूप में हर 200ms पर कॉल होगा)
function fireBullet() {
    if (!gameRunning) return;
    // सिंगल फायर
    if (bulletCount === 1) {
        bullets.push({ x: player.x, y: player.y, speed: -15, width: 5, height: 10 });
    } 
    // डबल फायर
    else if (bulletCount === 2) {
        bullets.push({ x: player.x - 10, y: player.y, speed: -15, width: 5, height: 10 });
        bullets.push({ x: player.x + 10, y: player.y, speed: -15, width: 5, height: 10 });
    }
    // मल्टी फायर (उदाहरण)
    else if (bulletCount >= 3) {
        bullets.push({ x: player.x, y: player.y, speed: -15, width: 5, height: 10 });
        bullets.push({ x: player.x - 15, y: player.y, speed: -15, width: 5, height: 10 });
        bullets.push({ x: player.x + 15, y: player.y, speed: -15, width: 5, height: 10 });
    }
    shootSound.currentTime = 0; // साउंड को तुरंत फिर से प्ले करने के लिए
    shootSound.play().catch(e => {}); 
}

// हर 200 मिलीसेकंड पर फायर करें
setInterval(fireBullet, 200); 

// शुरुआती कैनवास सेटअप
resizeCanvas(); 
player.x = canvas.width / 2; // रॉकेट को बीच में सेट करें