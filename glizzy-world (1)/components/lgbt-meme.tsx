"use client"

import { useState } from "react"

export function LGBTMeme() {
  const [rainbowColors] = useState([
    "#FF0018", // Red
    "#FFA52C", // Orange
    "#FFFF41", // Yellow
    "#008018", // Green
    "#0000F9", // Blue
    "#86007D", // Purple
  ])

  return (
    <div className="lgbt-meme">
      <div className="meme-text">STRAIGHTENING THE LGBT FLAG WITH A HAIR STRAIGHTENER</div>
      <div className="flag-container">
        <div className="rainbow-flag">
          {rainbowColors.map((color, index) => (
            <div key={index} className="flag-stripe" style={{ backgroundColor: color }}></div>
          ))}
        </div>
        <div className="straightener">✂️</div>
      </div>
    </div>
  )
}
