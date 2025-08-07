import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameBoard from './components/GameBoard'
import LevelSelector from './components/LevelSelector'
import GameStats from './components/GameStats'
import levels from './levels.js'
import './App.css'

const DIFFICULTY_LEVELS = [
  { name: 'Beginner', size: 7, colors: 4, description: 'Perfect for learning the basics' },
  { name: 'Easy', size: 8, colors: 5, description: 'A bit more challenging' },
  { name: 'Medium', size: 9, colors: 6, description: 'Requires strategic thinking' },
  { name: 'Hard', size: 10, colors: 7, description: 'For experienced players' },
  { name: 'Expert', size: 11, colors: 8, description: 'The ultimate challenge' }
]

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function App() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'won'
  const [board, setBoard] = useState([])
  const [squares, setSquares] = useState({}) // { "row-col": "queen" | "x" | "empty" }
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [puzzleCompletionTrigger, setPuzzleCompletionTrigger] = useState(0)

  const startNewGame = (levelIndex) => {
    const level = levels[levelIndex]

    const newBoard = generateBoardFromLevel(level)

    setCurrentLevel(levelIndex)
    setBoard(newBoard)
    setSquares({})
    setMoves(0)
    setStartTime(Date.now())
    setGameState('playing')
  }

  const setSquareValue = (row, col, value) => {
    if (gameState !== 'playing') return

    const squareKey = `${row}-${col}`
    setSquares(prev => ({ ...prev, [squareKey]: value }))
    setMoves(moves + 1)
  }

  const checkWinCondition = () => {
    // Get all queens from squares
    const queens = Object.entries(squares)
      .filter(([key, state]) => state === 'queen')
      .map(([key]) => {
        const [row, col] = key.split('-').map(Number)
        return { row, col }
      })

    if (queens.length === 0) {
      return false
    }

    // Check if all queens are valid (no conflicts)
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        const q1 = queens[i]
        const q2 = queens[j]

        if (q1.row === q2.row) {
          return false
        }
        if (q1.col === q2.col) {
          return false
        }
        if (Math.abs(q1.row - q2.row) + Math.abs(q1.col - q2.col) <= 2) {
          return false
        }
      }
    }

    // Check if we have the right number of queens (one per row/column)
    const level = levels[currentLevel]
    return queens.length === level.size
  }

  React.useEffect(() => {
    if (gameState === 'playing' && checkWinCondition()) {
      setGameState('won')
      // Mark puzzle as completed in localStorage
      const saved = localStorage.getItem('queens-completed-puzzles')
      const completedPuzzles = saved ? new Set(JSON.parse(saved)) : new Set()
      console.log(saved, completedPuzzles);
      completedPuzzles.add(currentLevel)
      localStorage.setItem('queens-completed-puzzles', JSON.stringify([...completedPuzzles]))
      // Trigger LevelSelector refresh
      setPuzzleCompletionTrigger(prev => prev + 1)
    }
  }, [squares, gameState, currentLevel])

  return (
    <div className="app">
      <motion.div
        className="game-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="game-title">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Queens
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="puzzle-text"
          >
            Puzzle
          </motion.span>
        </h1>

        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <LevelSelector
                key={`${gameState}-${puzzleCompletionTrigger}`}
                levels={levels}
                onLevelSelect={startNewGame}
              />
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GameStats
                level={levels[currentLevel]}
                levelIndex={currentLevel}
                moves={moves}
                startTime={startTime}
                squares={squares}
              />

              <GameBoard
                board={board}
                squares={squares}
                setSquareValue={setSquareValue}
              />

              <motion.button
                className="menu-button"
                onClick={() => setGameState('menu')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Menu
              </motion.button>
            </motion.div>
          )}

          {gameState === 'won' && (
            <motion.div
              key="won"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="win-screen"
            >
              <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🎉 Congratulations! 🎉
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                You solved the puzzle in {formatTime(Math.floor((Date.now() - startTime) / 1000))}!
              </motion.p>
              <motion.button
                className="play-again-button"
                onClick={() => setGameState('menu')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// Generate a board from a predefined level
function generateBoardFromLevel(level) {
  if (!level || !level.colorRegions) {
    console.error('Invalid level structure:', level)
    return []
  }

  const colors = [
    '#FF6B6B',
    '#FFD93D',
    '#6BCF7F',
    '#4D96FF',
    '#FF8E72',
    '#A8E6CF',
    '#FFB3BA',
    '#00AECC',
    '#FF69B4',
    '#9370DB',
    '#FFDDBB',
];

  return level.colorRegions.map(row =>
    row.map(region => {
      const colorIndex = region.charCodeAt(0) - 65 // Convert A=0, B=1, etc.
      return {
        color: colors[colorIndex % colors.length],
        region: region
      }
    })
  )
}

export default App 