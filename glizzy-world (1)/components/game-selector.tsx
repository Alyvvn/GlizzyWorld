"use client"

interface GameSelectorProps {
  activeGame: string | null
  isRaining: boolean
  onGameSelect: (game: string) => void
  onToggleRain: () => void
}

export function GameSelector({ activeGame, isRaining, onGameSelect, onToggleRain }: GameSelectorProps) {
  return (
    <div className="game-selector">
      <button onClick={() => onGameSelect("flip")} className={`game-btn ${activeGame === "flip" ? "active" : ""}`}>
        GLIZZY FLIP 🪙
      </button>
      <button onClick={onToggleRain} className={`game-btn ${isRaining ? "active" : ""}`}>
        MAKE IT RAIN GLIZZYS 🌧️
      </button>
      <button
        onClick={() => onGameSelect("defense")}
        className={`game-btn ${activeGame === "defense" ? "active" : ""}`}
      >
        GLIZZY DEFENSE 🛡️
      </button>
    </div>
  )
}
