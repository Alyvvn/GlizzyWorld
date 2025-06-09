"use client"

import { useState } from "react"
import { GlizzyFlip } from "@/components/glizzy-flip"
import { GlizzyDefense } from "@/components/glizzy-defense"
import { RainingGlizzys } from "@/components/raining-glizzys"
import { MemeSection } from "@/components/meme-section"
import { LGBTMeme } from "@/components/lgbt-meme"
import { ReversePrompt } from "@/components/reverse-prompt"
import { Marquee } from "@/components/marquee"
import { GlitchText } from "@/components/glitch-text"
import { PoweradeBanner } from "@/components/powerade-banner"
import { GameSelector } from "@/components/game-selector"
import { Footer } from "@/components/footer"

export default function GlizzyWorld() {
  const [activeGame, setActiveGame] = useState<string | null>("flip")
  const [isRaining, setIsRaining] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  const toggleRain = () => {
    setIsRaining(!isRaining)
    if (!isRaining) {
      setActiveGame(null)
    }
  }

  const handleGameSelect = (game: string) => {
    setActiveGame(game)
    setIsRaining(false)
  }

  const handleEnterSite = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-logo animate-pulse">🌭</div>
          <button onClick={handleEnterSite} className="enter-button">
            ENTER GLIZZY WORLD
          </button>
          <div className="splash-warning">WARNING: CONTAINS LOUD SOUNDS, FLASHING LIGHTS, AND EXTREME MEMES</div>
        </div>
      </div>
    )
  }

  return (
    <div className="glizzy-world" data-raining={isRaining}>
      {/* Glitch Overlay */}
      <div className="glitch-overlay"></div>

      {/* Raining Glizzys */}
      {isRaining && <RainingGlizzys />}

      {/* Header */}
      <header className="header">
        <Marquee />

        <h1 className="title">
          <GlitchText text="GLIZZY" />
          <span className="world-text">WORLD</span>
        </h1>

        <PoweradeBanner />
      </header>

      {/* Game Selection */}
      <GameSelector
        activeGame={activeGame}
        isRaining={isRaining}
        onGameSelect={handleGameSelect}
        onToggleRain={toggleRain}
      />

      {/* Game Area */}
      <div className="game-area">
        {activeGame === "flip" && <GlizzyFlip />}
        {activeGame === "defense" && <GlizzyDefense />}
      </div>

      {/* Meme Content */}
      <MemeSection />

      {/* LGBT Flag Meme */}
      <LGBTMeme />

      {/* Reverse ChatGPT Prompt */}
      <ReversePrompt />

      {/* Footer */}
      <Footer />
    </div>
  )
}
