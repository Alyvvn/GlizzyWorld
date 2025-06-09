<template>
  <div class="glizzy-world" :class="{ 'rain-active': isRaining }">
    <!-- Glitch Overlay -->
    <div class="glitch-overlay"></div>
    
    <!-- Raining Glizzys -->
    <div v-if="isRaining" class="rain-container">
      <div v-for="(glizzy, index) in rainingGlizzys" :key="index" 
           class="raining-glizzy" 
           :style="{ left: glizzy.x + 'px', top: glizzy.y + 'px', transform: `rotate(${glizzy.rotation}deg) scale(${glizzy.scale})` }">
        🌭
      </div>
    </div>

    <!-- Header -->
    <header class="header">
      <div class="marquee">
        <div class="marquee-content">
          <span>PSX HAS THE MEATS</span>
          <span>F*** BIG PHARMA / FREE LUIGI MANGIONE</span>
          <span>ADDERALL + ZOLOFT = GAINS</span>
          <span>BEST RETARDS</span>
          <span>WORKPLACE HARASSMENT IS MY PASSION</span>
        </div>
      </div>
      
      <h1 class="title">
        <span class="glitch-text" data-text="GLIZZY">GLIZZY</span>
        <span class="world-text">WORLD</span>
      </h1>
      
      <div class="powerade-banner">
        <span class="powerade-text">SPONSORED BY BLUE POWERADE</span>
        <span class="powerade-emoji">🥤</span>
      </div>
    </header>

    <!-- Game Selection -->
    <div class="game-selector">
      <button @click="activeGame = 'flip'" :class="{ active: activeGame === 'flip' }" class="game-btn">
        GLIZZY FLIP 🪙
      </button>
      <button @click="toggleRain" :class="{ active: isRaining }" class="game-btn">
        MAKE IT RAIN GLIZZYS 🌧️
      </button>
      <button @click="activeGame = 'defense'" :class="{ active: activeGame === 'defense' }" class="game-btn">
        GLIZZY DEFENSE 🛡️
      </button>
    </div>

    <!-- Game Area -->
    <div class="game-area">
      <!-- Glizzy Flip Game -->
      <div v-if="activeGame === 'flip'" class="flip-game">
        <div class="game-header">
          <h2>GLIZZY FLIP</h2>
          <div class="balance">BALANCE: {{ flipBalance }} GLIZZY COINS</div>
        </div>
        
        <div class="flip-container">
          <div class="coin" :class="{ flipping: isFlipping }">
            <div class="coin-side heads">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-16%20at%208.14.41%E2%80%AFPM-CD01sEoD9RfeWVQ8YSRJl0lvpjB4k7.png" alt="Glizzy Bun" class="bun-img" />
            </div>
            <div class="coin-side tails">🌭</div>
          </div>
          
          <div class="bet-controls">
            <input type="number" v-model.number="betAmount" class="bet-input" min="1" :max="flipBalance" />
            <div class="bet-buttons">
              <button @click="flipCoin('heads')" :disabled="isFlipping || betAmount > flipBalance" class="bet-btn heads-btn">
                BET ON BUN
              </button>
              <button @click="flipCoin('tails')" :disabled="isFlipping || betAmount > flipBalance" class="bet-btn tails-btn">
                BET ON GLIZZY
              </button>
            </div>
          </div>
          
          <div class="flip-result" v-if="flipResult">
            {{ flipResult }}
          </div>
          
          <div class="meme-quote">
            "Being on Discord while eating garlic bread at Olive Garden" - Sun Tzu
          </div>
        </div>
      </div>

      <!-- Glizzy Defense Game -->
      <div v-if="activeGame === 'defense'" class="defense-game">
        <div class="game-header">
          <h2>GLIZZY DEFENSE</h2>
          <div class="score">SCORE: {{ defenseScore }}</div>
        </div>
        
        <div class="defense-container" ref="defenseContainer" @click="clickDefense">
          <div v-for="(enemy, index) in enemies" :key="index" 
               class="enemy" 
               :style="{ left: enemy.x + 'px', top: enemy.y + 'px' }"
               @click.stop="defeatEnemy(index)">
            {{ enemy.type }}
          </div>
          
          <div class="defense-base">
            <div class="base-emoji">🌭</div>
            <div class="base-health" :style="{ width: (baseHealth / 100) * 100 + '%' }"></div>
          </div>
        </div>
        
        <div class="defense-controls">
          <button @click="startDefenseGame" :disabled="defenseGameActive" class="start-btn">
            START WAVE
          </button>
          <div class="upgrade-btn" @click="upgradeDefense" :disabled="defenseScore < upgradeCost">
            UPGRADE DEFENSE ({{ upgradeCost }} POINTS)
          </div>
        </div>
        
        <div class="meme-references">
          <div class="meme-tag">PSA 10 ANTHONY EDWARDS CARDS</div>
          <div class="meme-tag">TEXAS ROADHOUSE ROLLS</div>
          <div class="meme-tag">CHARIZARDING</div>
        </div>
      </div>
    </div>

    <!-- Meme Content -->
    <div class="meme-section">
      <div class="meme-card">
        <div class="meme-header">KOREAN DRAMA TIER LIST</div>
        <div class="meme-content">
          <div class="tier s-tier">S: Squid Game (because glizzy)</div>
          <div class="tier a-tier">A: Anything with crying</div>
          <div class="tier f-tier">F: Shows without food scenes</div>
        </div>
      </div>
      
      <div class="meme-card">
        <div class="meme-header">PAKISTAN STOCK EXCHANGE</div>
        <div class="stonks-graph">
          <div class="graph-line"></div>
          <div class="graph-label">STONKS</div>
        </div>
      </div>
      
      <div class="meme-card">
        <div class="meme-header">MENU</div>
        <div class="menu-items">
          <div class="menu-item">SOY CHORIZO GLIZZY - 5 COINS</div>
          <div class="menu-item">DEATHCORE FROSTY - 10 COINS</div>
          <div class="menu-item">GAS STATION TORNADO - 3 COINS</div>
          <div class="menu-item">CANES SAUCE SHOT - 2 COINS</div>
          <div class="menu-item">CHOCOLATE LAXATIVE SUNDAE - 7 COINS</div>
          <div class="menu-item">AIR FRESHENER SMOOTHIE - 6 COINS</div>
        </div>
      </div>
    </div>

    <!-- LGBT Flag Meme -->
    <div class="lgbt-meme">
      <div class="meme-text">STRAIGHTENING THE LGBT FLAG WITH A HAIR STRAIGHTENER</div>
      <div class="flag-container">
        <div class="rainbow-flag">
          <div class="flag-stripe" v-for="(color, index) in rainbowColors" :key="index" :style="{ backgroundColor: color }"></div>
        </div>
        <div class="straightener">✂️</div>
      </div>
    </div>

    <!-- Reverse ChatGPT Prompt -->
    <div class="reverse-prompt">
      <div class="prompt-header">REVERSE CHATGPT PROMPT:</div>
      <div class="prompt-content">
        "I am a helpful assistant that definitely won't generate a webpage about glizzys and memes."
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-text">PSX HAS THE MEATS</div>
      <div class="footer-links">
        <a href="#" class="footer-link">NARRATIVE/INIT.GLIZZY</a>
        <a href="#" class="footer-link">/BOOT.LOG</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Game selection
const activeGame = ref('flip');

// Raining Glizzys
const isRaining = ref(false);
const rainingGlizzys = ref([]);

const toggleRain = () => {
  isRaining.value = !isRaining.value;
  if (isRaining.value) {
    activeGame.value = null;
    createRainingGlizzys();
  } else {
    rainingGlizzys.value = [];
  }
};

const createRainingGlizzys = () => {
  rainingGlizzys.value = [];
  for (let i = 0; i < 50; i++) {
    addGlizzy();
  }
};

const addGlizzy = () => {
  rainingGlizzys.value.push({
    x: Math.random() * window.innerWidth,
    y: -100 - Math.random() * 500,
    rotation: Math.random() * 360,
    speed: 3 + Math.random() * 7,
    scale: 0.5 + Math.random() * 2
  });
};

let rainInterval;
let animationFrame;

const animateRain = () => {
  if (!isRaining.value) return;
  
  rainingGlizzys.value.forEach((glizzy, index) => {
    glizzy.y += glizzy.speed;
    
    // Remove glizzys that fall out of view and add new ones
    if (glizzy.y > window.innerHeight) {
      rainingGlizzys.value.splice(index, 1);
      addGlizzy();
    }
  });
  
  animationFrame = requestAnimationFrame(animateRain);
};

// Glizzy Flip Game
const flipBalance = ref(100);
const betAmount = ref(10);
const isFlipping = ref(false);
const flipResult = ref('');

const flipCoin = (choice) => {
  if (isFlipping.value || betAmount.value > flipBalance.value) return;
  
  isFlipping.value = true;
  flipResult.value = '';
  
  // Simulate coin flip
  setTimeout(() => {
    const result = Math.random() > 0.5 ? 'heads' : 'tails';
    
    if (result === choice) {
      flipBalance.value += betAmount.value;
      flipResult.value = `YOU WON ${betAmount.value} GLIZZY COINS! BEST RETARDS!`;
    } else {
      flipBalance.value -= betAmount.value;
      flipResult.value = `YOU LOST ${betAmount.value} GLIZZY COINS! F*** BIG PHARMA!`;
    }
    
    isFlipping.value = false;
  }, 2000);
};

// Glizzy Defense Game
const defenseContainer = ref(null);
const defenseScore = ref(0);
const baseHealth = ref(100);
const enemies = ref([]);
const defenseGameActive = ref(false);
const defenseLevel = ref(1);
const upgradeCost = computed(() => Math.floor(50 * Math.pow(1.5, defenseLevel.value)));

const startDefenseGame = () => {
  if (defenseGameActive.value) return;
  
  defenseGameActive.value = true;
  baseHealth.value = 100;
  
  // Create enemies
  createEnemies();
};

const createEnemies = () => {
  enemies.value = [];
  const enemyCount = 5 + defenseLevel.value * 2;
  
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => {
      if (!defenseContainer.value) return;
      
      const containerWidth = defenseContainer.value.clientWidth;
      const enemyTypes = ['🍔', '🍕', '🥪', '🌮', '🍣'];
      
      enemies.value.push({
        x: Math.random() * containerWidth,
        y: -50,
        type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
        speed: 1 + Math.random() * defenseLevel.value
      });
    }, i * 1000);
  }
};

const defeatEnemy = (index) => {
  if (!defenseGameActive.value) return;
  
  defenseScore.value += 10;
  enemies.value.splice(index, 1);
  
  // Check if all enemies are defeated
  if (enemies.value.length === 0 && defenseGameActive.value) {
    defenseGameActive.value = false;
    defenseLevel.value += 1;
  }
};

const clickDefense = (event) => {
  // This is just for the background click, actual enemy clicks are handled by defeatEnemy
};

const upgradeDefense = () => {
  if (defenseScore.value >= upgradeCost.value) {
    defenseScore.value -= upgradeCost.value;
    defenseLevel.value += 1;
  }
};

let defenseInterval;

const animateDefense = () => {
  if (!defenseGameActive.value || !defenseContainer.value) return;
  
  const containerHeight = defenseContainer.value.clientHeight;
  
  enemies.value.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    
    // Check if enemy reached the base
    if (enemy.y > containerHeight - 100) {
      baseHealth.value -= 10;
      enemies.value.splice(index, 1);
      
      // Game over if health reaches 0
      if (baseHealth.value <= 0) {
        defenseGameActive.value = false;
      }
      
      // Check if all enemies are defeated
      if (enemies.value.length === 0 && defenseGameActive.value) {
        defenseGameActive.value = false;
        defenseLevel.value += 1;
      }
    }
  });
  
  requestAnimationFrame(animateDefense);
};

// Rainbow colors for LGBT flag
const rainbowColors = ref([
  '#FF0018', // Red
  '#FFA52C', // Orange
  '#FFFF41', // Yellow
  '#008018', // Green
  '#0000F9', // Blue
  '#86007D'  // Purple
]);

// Lifecycle hooks
onMounted(() => {
  // Start animation loops
  animationFrame = requestAnimationFrame(animateRain);
  requestAnimationFrame(animateDefense);
  
  // Add more glizzys periodically when raining
  rainInterval = setInterval(() => {
    if (isRaining.value) {
      addGlizzy();
    }
  }, 200);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  clearInterval(rainInterval);
});
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Comic Sans MS", cursive, sans-serif;
}

.glizzy-world {
  min-height: 100vh;
  background-color: #000;
  background-image: 
    linear-gradient(to right, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2)),
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none" stroke="%23ff00ff" stroke-width="2"/></svg>');
  color: white;
  overflow-x: hidden;
  position: relative;
}

.glitch-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 98%,
    rgba(255, 0, 255, 0.2) 98%,
    rgba(255, 0, 255, 0.2) 100%
  );
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 10;
  opacity: 0.3;
}

.rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.raining-glizzy {
  position: absolute;
  font-size: 40px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.7));
}

/* Header Styles */
.header {
  padding: 20px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.marquee {
  background-color: #ff0000;
  padding: 10px;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 20px;
}

.marquee-content {
  display: inline-block;
  animation: marquee 20s linear infinite;
}

.marquee-content span {
  margin: 0 30px;
  font-weight: bold;
  font-size: 18px;
}

@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}

.title {
  font-size: 80px;
  font-weight: 900;
  margin-bottom: 20px;
  text-shadow: 
    0 0 10px #ff00ff,
    0 0 20px #ff00ff,
    0 0 30px #ff00ff;
  letter-spacing: 5px;
}

.glitch-text {
  position: relative;
  color: #00ffff;
  animation: glitch 2s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff00ff;
  animation: glitch-anim 3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-2px, -2px);
}

.glitch-text::after {
  color: #ffff00;
  animation: glitch-anim 2s infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
  transform: translate(2px, 2px);
}

@keyframes glitch-anim {
  0% { transform: translate(0); }
  20% { transform: translate(-5px, 5px); }
  40% { transform: translate(-5px, -5px); }
  60% { transform: translate(5px, 5px); }
  80% { transform: translate(5px, -5px); }
  100% { transform: translate(0); }
}

.world-text {
  color: #ffff00;
}

.powerade-banner {
  background-color: #0066ff;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  animation: pulse 2s infinite;
}

.powerade-text {
  font-weight: bold;
  font-size: 18px;
}

.powerade-emoji {
  font-size: 24px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Game Selector Styles */
.game-selector {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
  z-index: 2;
  position: relative;
}

.game-btn {
  background: linear-gradient(to right, #ff00ff, #00ffff);
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
}

.game-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.8);
}

.game-btn.active {
  background: linear-gradient(to right, #ffff00, #ff00ff);
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(255, 255, 0, 0.8);
}

/* Game Area Styles */
.game-area {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  padding: 30px;
  margin: 0 auto 40px;
  max-width: 800px;
  position: relative;
  z-index: 2;
  border: 3px solid;
  border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff) 1;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.game-header h2 {
  font-size: 36px;
  color: #ffff00;
  text-shadow: 0 0 10px #ffff00;
}

.balance, .score {
  font-size: 24px;
  font-weight: bold;
  color: #00ffff;
}

/* Glizzy Flip Game Styles */
.flip-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.coin {
  width: 150px;
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  margin: 20px 0;
}

.coin-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  background-color: #333;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
}

.heads {
  transform: rotateY(0deg);
  background-color: #ffcc00;
  overflow: hidden;
}

.bun-img {
  width: 140px;
  height: auto;
}

.tails {
  transform: rotateY(180deg);
  background-color: #ff6600;
}

.flipping {
  animation: flip 2s ease-out;
}

@keyframes flip {
  0% { transform: rotateY(0); }
  100% { transform: rotateY(1440deg); }
}

.bet-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
}

.bet-input {
  padding: 15px;
  font-size: 20px;
  text-align: center;
  background-color: #333;
  color: white;
  border: 2px solid #00ffff;
  border-radius: 10px;
}

.bet-buttons {
  display: flex;
  gap: 20px;
}

.bet-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.bet-btn:hover {
  transform: translateY(-3px);
}

.heads-btn {
  background-color: #ffcc00;
  color: black;
}

.tails-btn {
  background-color: #ff6600;
  color: white;
}

.flip-result {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  height: 30px;
  color: #ffff00;
  text-shadow: 0 0 10px #ffff00;
}

.meme-quote {
  font-style: italic;
  text-align: center;
  margin-top: 20px;
  color: #00ffff;
}

/* Glizzy Defense Game Styles */
.defense-container {
  position: relative;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 2px solid #00ffff;
}

.enemy {
  position: absolute;
  font-size: 40px;
  cursor: pointer;
  transition: transform 0.2s;
  filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.7));
}

.enemy:hover {
  transform: scale(1.2);
}

.defense-base {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.base-emoji {
  font-size: 60px;
  margin-bottom: 10px;
}

.base-health {
  width: 100%;
  height: 10px;
  background-color: #00ff00;
  border-radius: 5px;
  transition: width 0.3s;
}

.defense-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.start-btn, .upgrade-btn {
  background-color: #ff00ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.start-btn:hover, .upgrade-btn:hover {
  transform: translateY(-3px);
  background-color: #ff33ff;
}

.start-btn:disabled, .upgrade-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  transform: none;
}

.meme-references {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.meme-tag {
  background-color: rgba(255, 0, 255, 0.3);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

/* Meme Section Styles */
.meme-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.meme-card {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  border: 2px solid;
  border-image: linear-gradient(45deg, #ff00ff, #00ffff) 1;
}

.meme-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #ffff00;
  text-align: center;
}

.meme-content {
  font-size: 16px;
}

.tier {
  padding: 5px 10px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.s-tier {
  background-color: rgba(255, 215, 0, 0.3);
}

.a-tier {
  background-color: rgba(192, 192, 192, 0.3);
}

.f-tier {
  background-color: rgba(255, 0, 0, 0.3);
}

.stonks-graph {
  height: 150px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.graph-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #ff0000, #00ff00);
  animation: stonks 5s infinite;
}

@keyframes stonks {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-50px) rotate(-5deg); }
  75% { transform: translateY(30px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.graph-label {
  font-size: 36px;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  z-index: 1;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 5px;
}

/* LGBT Flag Meme */
.lgbt-meme {
  max-width: 600px;
  margin: 0 auto 40px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 20px;
  position: relative;
  z-index: 2;
  border: 2px solid #ffff00;
}

.meme-text {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #ffff00;
}

.flag-container {
  position: relative;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rainbow-flag {
  width: 300px;
  height: 60px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 5px;
  animation: wave 3s infinite;
}

.flag-stripe {
  flex: 1;
  transition: transform 0.5s;
}

.straightener {
  position: absolute;
  right: 50px;
  font-size: 40px;
  animation: straighten 3s infinite;
}

@keyframes wave {
  0% { transform: skewX(0); }
  50% { transform: skewX(10deg); }
  100% { transform: skewX(0); }
}

@keyframes straighten {
  0% { transform: translateX(0) rotate(0); }
  50% { transform: translateX(-100px) rotate(20deg); }
  100% { transform: translateX(0) rotate(0); }
}

/* Reverse ChatGPT Prompt */
.reverse-prompt {
  max-width: 600px;
  margin: 0 auto 40px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 20px;
  position: relative;
  z-index: 2;
  border: 2px solid #00ffff;
}

.prompt-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #00ffff;
}

.prompt-content {
  font-style: italic;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Footer Styles */
.footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 2;
}

.footer-text {
  font-size: 18px;
  font-weight: bold;
  color: #ff0000;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: #00ffff;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .title {
    font-size: 40px;
  }
  
  .game-selector {
    flex-direction: column;
    align-items: center;
  }
  
  .game-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .bet-buttons {
    flex-direction: column;
  }
  
  .meme-section {
    flex-direction: column;
    align-items: center;
  }
  
  .meme-card {
    width: 100%;
    max-width: 300px;
  }
}
</style>
