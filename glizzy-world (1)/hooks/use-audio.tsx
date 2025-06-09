"use client"

import { useState, useEffect, useRef } from "react"

export function useAudio(url: string) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    try {
      audioRef.current = new Audio()
      audioRef.current.loop = true
      audioRef.current.volume = 0.3

      // Add event listeners for error handling
      audioRef.current.addEventListener("error", (e) => {
        console.warn("Audio failed to load:", e)
        setAudioLoaded(false)
      })

      audioRef.current.addEventListener("canplaythrough", () => {
        setAudioLoaded(true)
      })

      // Only set src after adding event listeners
      audioRef.current.src = url
    } catch (error) {
      console.warn("Audio initialization failed:", error)
      setAudioLoaded(false)
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [url])

  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((e) => {
              console.warn("Audio playback failed:", e)
              setIsPlaying(false)
            })
        }
      }
    } catch (error) {
      console.warn("Toggle play failed:", error)
    }
  }

  return { isPlaying, togglePlay, audioLoaded }
}
