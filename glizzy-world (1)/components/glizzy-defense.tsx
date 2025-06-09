"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

type Enemy = {
  id: number
  x: number
  y: number
  type: string
  speed: number
  health: number
  size: number
  rotation: number
}

type Projectile = {
  id: number
  x: number
  y: number
  targetId: number | null
  speed: number
}

type PowerUp = {
  id: number
  x: number
  y: number
  type: string
  duration: number
}

export function GlizzyDefense() {
  const [defenseScore, setDefenseScore] = useState(0)
  const [baseHealth, setBaseHealth] = useState(100)
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [defenseGameActive, setDefenseGameActive] = useState(false)
  const [defenseLevel, setDefenseLevel] = useState(1)
  const [upgradeCost, setUpgradeCost] = useState(50)
  const [fireRate, setFireRate] = useState(1)
  const [projectileDamage, setProjectileDamage] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [activePowerUps, setActivePowerUps] = useState<{ [key: string]: number }>({})
  const [waveMessage, setWaveMessage] = useState("")
  const [highScore, setHighScore] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const lastFireRef = useRef<number>(0)

  // Enemy types with their properties
  const enemyTypes = [
    { emoji: "🍔", health: 2, speed: 1, points: 10 },
    { emoji: "🍕", health: 1, speed: 1.5, points: 15 },
    { emoji: "🥪", health: 3, speed: 0.7, points: 20 },
    { emoji: "🌮", health: 1, speed: 2, points: 25 },
    { emoji: "🍣", health: 4, speed: 0.5, points: 30 },
  ]

  // Power-up types
  const powerUpTypes = [
    { emoji: "⚡", type: "speed", effect: "Increased fire rate" },
    { emoji: "💪", type: "damage", effect: "Increased damage" },
    { emoji: "🛡️", type: "shield", effect: "Temporary shield" },
    { emoji: "🔄", type: "multishot", effect: "Multiple projectiles" },
  ]

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("glizzyDefenseHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    // Set upgrade cost based on level
    setUpgradeCost(Math.floor(50 * Math.pow(1.5, defenseLevel)))

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [defenseLevel])

  // Update the startDefenseGame function
  const startDefenseGame = () => {
    if (defenseGameActive) return

    setDefenseGameActive(true)
    setBaseHealth(100)
    setGameOver(false)
    setWaveMessage(`WAVE ${defenseLevel} INCOMING!`)

    // Show wave message for 2 seconds
    setTimeout(() => {
      setWaveMessage("")
    }, 2000)

    // Play start sound
    // playSoundSafely("/sounds/game-start.mp3")

    // Create enemies
    createEnemies()

    // Start game loop
    animationRef.current = requestAnimationFrame(gameLoop)
  }

  const createEnemies = () => {
    setEnemies([])
    const enemyCount = 5 + defenseLevel * 2

    for (let i = 0; i < enemyCount; i++) {
      setTimeout(
        () => {
          if (!containerRef.current || !defenseGameActive) return

          const containerWidth = containerRef.current.clientWidth
          const randomEnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]

          setEnemies((prev) => [
            ...prev,
            {
              id: Date.now() + i,
              x: Math.random() * (containerWidth - 50),
              y: -50 - Math.random() * 200, // Stagger entry
              type: randomEnemyType.emoji,
              speed: randomEnemyType.speed * (0.8 + defenseLevel * 0.1),
              health: randomEnemyType.health * (1 + Math.floor(defenseLevel / 3) * 0.5),
              size: 0.8 + Math.random() * 0.4,
              rotation: Math.random() * 360,
            },
          ])
        },
        i * (1000 - Math.min(500, defenseLevel * 50)),
      )
    }

    // Spawn power-up with 30% chance per wave
    if (Math.random() < 0.3) {
      setTimeout(() => {
        if (!containerRef.current || !defenseGameActive) return

        const containerWidth = containerRef.current.clientWidth
        const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]

        setPowerUps((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * (containerWidth - 40),
            y: -50,
            type: randomPowerUp.type,
            duration: 10000, // 10 seconds
          },
        ])
      }, enemyCount * 500)
    }
  }

  const gameLoop = (timestamp: number) => {
    if (!defenseGameActive) return

    // Update enemies
    updateEnemies()

    // Update projectiles
    updateProjectiles()

    // Update power-ups
    updatePowerUps()

    // Auto-fire projectiles
    if (timestamp - lastFireRef.current > 1000 / (fireRate * (activePowerUps.speed ? 2 : 1))) {
      fireProjectile()
      lastFireRef.current = timestamp
    }

    // Check for game over
    if (baseHealth <= 0) {
      endGame()
    }

    // Continue game loop
    animationRef.current = requestAnimationFrame(gameLoop)
  }

  const updateEnemies = () => {
    if (!containerRef.current) return

    const containerHeight = containerRef.current.clientHeight

    setEnemies((prev) => {
      const updated = prev.map((enemy) => ({
        ...enemy,
        y: enemy.y + enemy.speed,
        rotation: enemy.rotation + enemy.speed,
      }))

      // Check if enemies reached the base
      const remaining = updated.filter((enemy) => {
        if (enemy.y > containerHeight - 100) {
          // Damage base
          if (!activePowerUps.shield) {
            setBaseHealth((health) => Math.max(0, health - 10))

            // Play damage sound
            // playSoundSafely("/sounds/damage.mp3", 0.3)
          }
          return false
        }
        return true
      })

      // Check if all enemies are defeated
      if (remaining.length === 0 && prev.length > 0) {
        waveComplete()
      }

      return remaining
    })
  }

  const updateProjectiles = () => {
    if (!containerRef.current) return

    const containerHeight = containerRef.current.clientHeight

    setProjectiles((prev) => {
      const updated = prev.map((projectile) => {
        // Basic projectile movement
        const newY = projectile.y - projectile.speed

        // If projectile has a target, move towards it
        if (projectile.targetId) {
          const target = enemies.find((e) => e.id === projectile.targetId)
          if (target) {
            // Calculate direction to target
            const dx = target.x - projectile.x
            const dy = target.y - projectile.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Move towards target
            if (distance > 0) {
              const vx = (dx / distance) * projectile.speed
              const vy = (dy / distance) * projectile.speed
              return {
                ...projectile,
                x: projectile.x + vx,
                y: projectile.y + vy,
              }
            }
          }
        }

        return {
          ...projectile,
          y: newY,
        }
      })

      // Remove projectiles that are off-screen
      return updated.filter((p) => p.y > -20)
    })

    // Check for projectile-enemy collisions
    checkCollisions()
  }

  const updatePowerUps = () => {
    if (!containerRef.current) return

    const containerHeight = containerRef.current.clientHeight

    setPowerUps((prev) => {
      const updated = prev.map((powerUp) => ({
        ...powerUp,
        y: powerUp.y + 1,
      }))

      // Remove power-ups that are off-screen
      return updated.filter((p) => p.y < containerHeight)
    })

    // Check for power-up collisions with base
    checkPowerUpCollisions()

    // Update active power-ups timers
    setActivePowerUps((prev) => {
      const updated = { ...prev }

      Object.keys(updated).forEach((key) => {
        updated[key] -= 16 // Approximately 16ms per frame
        if (updated[key] <= 0) {
          delete updated[key]

          // Reset effects when power-up expires
          if (key === "speed") {
            // Fire rate returns to normal
          } else if (key === "damage") {
            // Damage returns to normal
          } else if (key === "multishot") {
            // Multishot returns to normal
          }
        }
      })

      return updated
    })
  }

  const checkCollisions = () => {
    // Check each projectile against each enemy
    const updatedEnemies = [...enemies]
    const updatedProjectiles = [...projectiles]
    let scoreIncrease = 0

    for (let i = updatedProjectiles.length - 1; i >= 0; i--) {
      const projectile = updatedProjectiles[i]

      for (let j = updatedEnemies.length - 1; j >= 0; j--) {
        const enemy = updatedEnemies[j]

        // Simple collision detection
        const dx = projectile.x - enemy.x
        const dy = projectile.y - enemy.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 30 * enemy.size) {
          // Hit!
          const damage = projectileDamage * (activePowerUps.damage ? 2 : 1)
          enemy.health -= damage

          // Play hit sound
          // playSoundSafely("/sounds/hit.mp3", 0.2)

          // Remove projectile
          updatedProjectiles.splice(i, 1)

          // Check if enemy is defeated
          if (enemy.health <= 0) {
            // Find enemy type to get points
            const enemyType = enemyTypes.find((t) => t.emoji === enemy.type)
            const points = enemyType ? enemyType.points : 10

            scoreIncrease += points
            updatedEnemies.splice(j, 1)

            // Play defeat sound
            // playSoundSafely("/sounds/enemy-defeat.mp3", 0.3)

            // Spawn particles
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect()
              const x = (enemy.x + rect.left) / window.innerWidth
              const y = (enemy.y + rect.top) / window.innerHeight

              confetti({
                particleCount: 10,
                startVelocity: 20,
                spread: 360,
                origin: { x, y },
                colors: ["#ff0000", "#ff7700", "#ffff00"],
              })
            }
          }

          break
        }
      }
    }

    // Update state if there were changes
    if (scoreIncrease > 0) {
      setDefenseScore((prev) => prev + scoreIncrease)
    }

    if (updatedEnemies.length !== enemies.length) {
      setEnemies(updatedEnemies)
    }

    if (updatedProjectiles.length !== projectiles.length) {
      setProjectiles(updatedProjectiles)
    }
  }

  const checkPowerUpCollisions = () => {
    if (!containerRef.current) return

    const containerHeight = containerRef.current.clientHeight

    setPowerUps((prev) => {
      const remaining = prev.filter((powerUp) => {
        // Check if power-up reached the base area
        if (powerUp.y > containerHeight - 120) {
          // Activate power-up
          setActivePowerUps((active) => ({
            ...active,
            [powerUp.type]: powerUp.duration,
          }))

          // Play power-up sound
          // playSoundSafely("/sounds/powerup.mp3", 0.4)

          return false
        }
        return true
      })

      return remaining
    })
  }

  const fireProjectile = () => {
    if (!containerRef.current || enemies.length === 0) return

    const baseX = containerRef.current.clientWidth / 2
    const baseY = containerRef.current.clientHeight - 80

    // Find closest enemy to target
    let closestEnemy = null
    let closestDistance = Number.POSITIVE_INFINITY

    enemies.forEach((enemy) => {
      const dx = enemy.x - baseX
      const dy = enemy.y - baseY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < closestDistance) {
        closestDistance = distance
        closestEnemy = enemy
      }
    })

    // Create projectile(s)
    const newProjectiles = []

    if (activePowerUps.multishot) {
      // Create 3 projectiles in a spread
      for (let i = -1; i <= 1; i++) {
        newProjectiles.push({
          id: Date.now() + i,
          x: baseX + i * 20,
          y: baseY,
          targetId: closestEnemy?.id || null,
          speed: 5,
        })
      }
    } else {
      // Create single projectile
      newProjectiles.push({
        id: Date.now(),
        x: baseX,
        y: baseY,
        targetId: closestEnemy?.id || null,
        speed: 5,
      })
    }

    setProjectiles((prev) => [...prev, ...newProjectiles])

    // Play shoot sound
    // playSoundSafely("/sounds/shoot.mp3", 0.2)
  }

  const waveComplete = () => {
    setDefenseGameActive(false)
    setDefenseLevel((prev) => prev + 1)
    setWaveMessage("WAVE COMPLETE!")

    // Play wave complete sound
    // playSoundSafely("/sounds/wave-complete.mp3", 0.5)

    // Clear projectiles
    setProjectiles([])

    // Show message for 2 seconds
    setTimeout(() => {
      setWaveMessage("")
    }, 2000)
  }

  const endGame = () => {
    setDefenseGameActive(false)
    setGameOver(true)

    // Update high score if needed
    if (defenseScore > highScore) {
      setHighScore(defenseScore)
      localStorage.setItem("glizzyDefenseHighScore", defenseScore.toString())
    }

    // Play game over sound
    // playSoundSafely("/sounds/game-over.mp3", 0.5)

    // Clear game objects
    setEnemies([])
    setProjectiles([])
    setPowerUps([])
    setActivePowerUps({})

    cancelAnimationFrame(animationRef.current)
  }

  const upgradeDefense = (type: string) => {
    if (defenseScore < upgradeCost) return

    setDefenseScore((prev) => prev - upgradeCost)

    // Apply upgrade based on type
    if (type === "fireRate") {
      setFireRate((prev) => prev + 0.2)
    } else if (type === "damage") {
      setProjectileDamage((prev) => prev + 0.5)
    } else if (type === "health") {
      setBaseHealth((prev) => Math.min(100, prev + 20))
    }

    // Increase upgrade cost
    setUpgradeCost((prev) => Math.floor(prev * 1.5))

    // Play upgrade sound
    // playSoundSafely("/sounds/upgrade.mp3", 0.4)
  }

  const restartGame = () => {
    setDefenseScore(0)
    setDefenseLevel(1)
    setBaseHealth(100)
    setGameOver(false)
    setFireRate(1)
    setProjectileDamage(1)
    setUpgradeCost(50)
    startDefenseGame()
  }

  return (
    <div className="defense-game">
      <div className="game-header">
        <h2 className="game-title">GLIZZY DEFENSE</h2>
        <div className="score-container">
          <div className="score">SCORE: {defenseScore}</div>
          <div className="high-score">HIGH: {highScore}</div>
        </div>
      </div>

      <div className="defense-container" ref={containerRef}>
        {/* Wave message */}
        <AnimatePresence>
          {waveMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="wave-message"
            >
              {waveMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over screen */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="game-over-screen"
            >
              <h3>GAME OVER</h3>
              <p>SCORE: {defenseScore}</p>
              <p>HIGH SCORE: {highScore}</p>
              <button onClick={restartGame} className="restart-btn">
                PLAY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active power-ups */}
        <div className="active-powerups">
          {Object.entries(activePowerUps).map(([type, time]) => (
            <div key={type} className="active-powerup">
              {type === "speed" && "⚡"}
              {type === "damage" && "💪"}
              {type === "shield" && "🛡️"}
              {type === "multishot" && "🔄"}
              <div className="powerup-timer" style={{ width: `${(time / 10000) * 100}%` }}></div>
            </div>
          ))}
        </div>

        {/* Enemies */}
        {enemies.map((enemy) => (
          <motion.div
            key={enemy.id}
            className="enemy"
            style={{
              left: enemy.x,
              top: enemy.y,
              fontSize: `${40 * enemy.size}px`,
              transform: `rotate(${enemy.rotation}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
          >
            {enemy.type}
            <div
              className="enemy-health"
              style={{
                width: `${(enemy.health / (enemyTypes.find((t) => t.emoji === enemy.type)?.health || 1)) * 100}%`,
              }}
            ></div>
          </motion.div>
        ))}

        {/* Projectiles */}
        {projectiles.map((projectile) => (
          <motion.div
            key={projectile.id}
            className="projectile"
            style={{ left: projectile.x, top: projectile.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🌭
          </motion.div>
        ))}

        {/* Power-ups */}
        {powerUps.map((powerUp) => (
          <motion.div
            key={powerUp.id}
            className="power-up"
            style={{ left: powerUp.x, top: powerUp.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
            transition={{ rotate: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }}
          >
            {powerUp.type === "speed" && "⚡"}
            {powerUp.type === "damage" && "💪"}
            {powerUp.type === "shield" && "🛡️"}
            {powerUp.type === "multishot" && "🔄"}
          </motion.div>
        ))}

        {/* Defense base */}
        <div className="defense-base">
          <motion.div
            className="base-emoji"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            🌭
          </motion.div>
          <div className="base-health-container">
            <div
              className="base-health"
              style={{ width: `${baseHealth}%` }}
              data-health={baseHealth <= 30 ? "low" : baseHealth <= 60 ? "medium" : "high"}
            ></div>
          </div>
        </div>
      </div>

      <div className="defense-controls">
        {!defenseGameActive && !gameOver && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startDefenseGame}
            className="start-btn"
          >
            {defenseLevel === 1 ? "START GAME" : "START WAVE " + defenseLevel}
          </motion.button>
        )}

        <div className="upgrade-buttons">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => upgradeDefense("fireRate")}
            className={`upgrade-btn ${defenseScore < upgradeCost ? "disabled" : ""}`}
          >
            UPGRADE FIRE RATE ({upgradeCost} POINTS)
            <div className="upgrade-level">
              {Array(Math.floor(fireRate * 2))
                .fill("🔥")
                .join("")}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => upgradeDefense("damage")}
            className={`upgrade-btn ${defenseScore < upgradeCost ? "disabled" : ""}`}
          >
            UPGRADE DAMAGE ({upgradeCost} POINTS)
            <div className="upgrade-level">
              {Array(Math.floor(projectileDamage * 2))
                .fill("💥")
                .join("")}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => upgradeDefense("health")}
            className={`upgrade-btn ${defenseScore < upgradeCost ? "disabled" : ""}`}
          >
            REPAIR BASE ({upgradeCost} POINTS)
            <div className="upgrade-level">{baseHealth < 30 ? "❤️" : baseHealth < 60 ? "❤️❤️" : "❤️❤️❤️"}</div>
          </motion.div>
        </div>
      </div>

      <div className="meme-references">
        <div className="meme-tag">PSA 10 ANTHONY EDWARDS CARDS</div>
        <div className="meme-tag">TEXAS ROADHOUSE ROLLS</div>
        <div className="meme-tag">CHARIZARDING</div>
      </div>
    </div>
  )
}
