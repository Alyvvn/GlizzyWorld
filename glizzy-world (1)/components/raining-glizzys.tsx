"use client"

import { useState, useEffect } from "react"

interface Glizzy {
  id: number
  x: number
  y: number
  rotation: number
  speed: number
  scale: number
}

export function RainingGlizzys() {
  const [rainingGlizzys, setRainingGlizzys] = useState<Glizzy[]>([])

  useEffect(() => {
    // Create initial glizzys
    createRainingGlizzys()

    // Animation frame handling
    let animationFrame: number
    const animateRain = () => {
      setRainingGlizzys((prev) => {
        const updated = prev.map((glizzy) => ({
          ...glizzy,
          y: glizzy.y + glizzy.speed,
        }))

        // Remove glizzys that fall out of view and add new ones
        const filtered = updated.filter((glizzy) => glizzy.y < window.innerHeight)
        if (filtered.length < updated.length) {
          for (let i = 0; i < updated.length - filtered.length; i++) {
            filtered.push(createGlizzy())
          }
        }

        return filtered
      })

      animationFrame = requestAnimationFrame(animateRain)
    }

    // Start animation
    animationFrame = requestAnimationFrame(animateRain)

    // Add more glizzys periodically
    const interval = setInterval(() => {
      setRainingGlizzys((prev) => [...prev, createGlizzy()])
    }, 200)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame)
      clearInterval(interval)
    }
  }, [])

  const createRainingGlizzys = () => {
    const initialGlizzys = []
    for (let i = 0; i < 50; i++) {
      initialGlizzys.push(createGlizzy())
    }
    setRainingGlizzys(initialGlizzys)
  }

  const createGlizzy = (): Glizzy => {
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: -100 - Math.random() * 500,
      rotation: Math.random() * 360,
      speed: 3 + Math.random() * 7,
      scale: 0.5 + Math.random() * 2,
    }
  }

  return (
    <div className="rain-container">
      {rainingGlizzys.map((glizzy) => (
        <div
          key={glizzy.id}
          className="raining-glizzy"
          style={{
            left: `${glizzy.x}px`,
            top: `${glizzy.y}px`,
            transform: `rotate(${glizzy.rotation}deg) scale(${glizzy.scale})`,
          }}
        >
          🌭
        </div>
      ))}
    </div>
  )
}
