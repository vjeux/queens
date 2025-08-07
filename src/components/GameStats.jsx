import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './GameStats.css'

const GameStats = ({ level, levelIndex, moves, startTime, squares }) => {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div 
      className="game-stats"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="stats-grid">
        <motion.div 
          className="stat-item"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-label">Level</div>
          <div className="stat-value">{levelIndex + 1}</div>
        </motion.div>

        <motion.div 
          className="stat-item"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-label">Queens</div>
          <div className="stat-value">
            {Object.values(squares).filter(state => state === 'queen').length}/{level.size}
          </div>
        </motion.div>

        <motion.div 
          className="stat-item"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stat-label">Moves</div>
          <div className="stat-value">{moves}</div>
        </motion.div>

        <motion.div 
          className="stat-item"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="stat-label">Time</div>
          <div className="stat-value">{formatTime(elapsedTime)}</div>
        </motion.div>
      </div>


    </motion.div>
  )
}

export default GameStats 