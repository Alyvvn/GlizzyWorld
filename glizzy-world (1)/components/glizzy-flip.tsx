"use client"

import { useState, useRef } from "react"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function GlizzyFlip() {
  const [flipBalance, setFlipBalance] = useState(100)
  const [betAmount, setBetAmount] = useState(10)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipResult, setFlipResult] = useState("")
  const [resultColor, setResultColor] = useState("")
  const [coinSide, setCoinSide] = useState("heads")
  const [streak, setStreak] = useState(0)
  const [showBonus, setShowBonus] = useState(false)
  const coinRef = useRef<HTMLDivElement>(null)

  const flipCoin = (choice: string) => {
    if (isFlipping || betAmount > flipBalance) return

    setIsFlipping(true)
    setFlipResult("")

    // Simulate coin flip with realistic physics
    const flips = 5 + Math.floor(Math.random() * 5)
    let currentFlip = 0

    const flipInterval = setInterval(() => {
      setCoinSide((prev) => (prev === "heads" ? "tails" : "heads"))
      currentFlip++

      if (currentFlip >= flips) {
        clearInterval(flipInterval)
        finishFlip(choice)
      }
    }, 150)
  }

  const finishFlip = (choice: string) => {
    // Determine result with slight house edge (48% win chance)
    const result = Math.random() > 0.52 ? choice : choice === "heads" ? "tails" : "heads"
    setCoinSide(result)

    setTimeout(() => {
      if (result === choice) {
        // Win
        const winAmount = betAmount
        setFlipBalance((prev) => prev + winAmount)
        setFlipResult(`YOU WON ${winAmount} GLIZZY COINS! BEST RETARDS!`)
        setResultColor("text-green-400")
        setStreak((prev) => prev + 1)

        // Shoot confetti for wins
        if (coinRef.current) {
          const rect = coinRef.current.getBoundingClientRect()
          confetti({
            particleCount: 100,
            spread: 70,
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight,
            },
          })
        }

        // Check for streak bonus
        if (streak + 1 >= 3) {
          const bonusAmount = Math.floor(betAmount * 0.5)
          setFlipBalance((prev) => prev + bonusAmount)
          setShowBonus(true)
          setTimeout(() => setShowBonus(false), 3000)
        }
      } else {
        // Loss
        setFlipBalance((prev) => prev - betAmount)
        setFlipResult(`YOU LOST ${betAmount} GLIZZY COINS! F*** BIG PHARMA!`)
        setResultColor("text-red-400")
        setStreak(0)
      }

      setIsFlipping(false)
    }, 500)
  }

  // Max bet button
  const handleMaxBet = () => {
    setBetAmount(flipBalance)
  }

  // Double bet button
  const handleDoubleBet = () => {
    const doubled = betAmount * 2
    if (doubled <= flipBalance) {
      setBetAmount(doubled)
    } else {
      setBetAmount(flipBalance)
    }
  }

  return (
    <div className="flip-game">
      <div className="game-header">
        <h2 className="game-title">GLIZZY FLIP</h2>
        <div className="balance">BALANCE: {flipBalance} GLIZZY COINS</div>
      </div>

      <div className="flip-container">
        <div ref={coinRef} className={`coin ${isFlipping ? "flipping" : ""}`} data-side={coinSide}>
          <div className="coin-side heads">
            {/* Updated to use the new image */}
            <Image
              src="/images/glizzy-character.png"
              alt="Glizzy Character"
              width={140}
              height={140}
              className="bun-img"
            />
          </div>
          <div className="coin-side tails">🌭</div>
        </div>

        <div className="bet-controls">
          <div className="bet-amount-controls">
            <button
              onClick={() => setBetAmount((prev) => Math.max(1, prev - 5))}
              className="bet-adjust-btn"
              disabled={isFlipping}
            >
              -5
            </button>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.min(flipBalance, Math.max(1, Number.parseInt(e.target.value) || 1)))}
              className="bet-input"
              min="1"
              max={flipBalance}
              disabled={isFlipping}
            />
            <button
              onClick={() => setBetAmount((prev) => Math.min(flipBalance, prev + 5))}
              className="bet-adjust-btn"
              disabled={isFlipping}
            >
              +5
            </button>
          </div>

          <div className="bet-quick-actions">
            <button onClick={handleMaxBet} className="quick-bet-btn max-btn" disabled={isFlipping}>
              MAX BET
            </button>
            <button
              onClick={handleDoubleBet}
              className="quick-bet-btn double-btn"
              disabled={isFlipping || betAmount * 2 > flipBalance}
            >
              2X BET
            </button>
          </div>

          <div className="bet-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => flipCoin("heads")}
              disabled={isFlipping || betAmount > flipBalance}
              className="bet-btn heads-btn"
            >
              BET ON GLIZZY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => flipCoin("tails")}
              disabled={isFlipping || betAmount > flipBalance}
              className="bet-btn tails-btn"
            >
              BET ON WEENIE
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {flipResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flip-result ${resultColor}`}
            >
              {flipResult}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBonus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 10, -10, 0] }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bonus-notification"
            >
              🔥 3X STREAK BONUS! 🔥
            </motion.div>
          )}
        </AnimatePresence>

        <div className="meme-quote">"Being on Discord while eating garlic bread at Olive Garden" - Sun Tzu</div>
      </div>
    </div>
  )
}
