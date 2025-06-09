export function playSoundSafely(soundPath: string, volume = 0.5) {
  try {
    const sound = new Audio(soundPath)
    sound.volume = volume
    sound.play().catch((err) => console.warn(`Couldn't play sound ${soundPath}:`, err))
    return sound
  } catch (error) {
    console.warn("Audio creation failed:", error)
    return null
  }
}
