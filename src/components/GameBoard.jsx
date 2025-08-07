import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './GameBoard.css'

const GameBoard = ({ board, squares, setSquareValue }) => {
  const [lastClickTime, setLastClickTime] = useState(0)
  const [lastClickCell, setLastClickCell] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartSquare, setDragStartSquare] = useState(null)
  const [dragAction, setDragAction] = useState(null)
  const boardRef = useRef(null)

  const handleMouseDown = (row, col) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastClickTime
    const squareState = getSquareState(row, col)

    if (timeDiff < 300 && lastClickTime > 0 && lastClickCell === `${row}-${col}`) {
      // Double click detected - place or remove queen
      setLastClickTime(0)
      setSquareValue(row, col, squareState === 'queen' ? 'empty' : 'queen')
    } else {
      // Start drag state
      setIsDragging(true)
      setDragStartSquare({ row, col })

      // Determine drag action based on initial square state
      if (squareState === 'queen') {
        setDragAction('remove')
      } else {
        setDragAction(squareState === 'x' ? 'remove' : 'add')
      }

      // Apply action to first square immediately
      if (squareState === 'queen') {
        setSquareValue(row, col, 'empty') // Remove queen
      } else {
        setSquareValue(row, col, squareState === 'x' ? 'empty' : 'x') // Toggle X mark
      }
      setLastClickTime(currentTime)
      setLastClickCell(`${row}-${col}`)
    }

  }

  const handleMouseEnter = (row, col) => {
    if (isDragging && dragStartSquare && dragAction) {
      const squareKey = `${row}-${col}`
      const squareValue = squares[squareKey];
      // Apply the same action that was applied to the first square
      if (squareValue === 'queen') {
        // Do nothing
      } else if (dragAction === 'remove') {
        setSquareValue(row, col, 'empty') // Remove queen
      } else {
        setSquareValue(row, col, 'x') // Add X mark
      }
    }
  }

  const handleMouseUp = () => {
    // Reset drag state
    setIsDragging(false)
    setDragStartSquare(null)
    setDragAction(null)
  }

  const getSquareState = (row, col) => {
    return squares[`${row}-${col}`] || 'empty'
  }

  const isQueen = (row, col) => {
    return getSquareState(row, col) === 'queen'
  }

  const isExcluded = (row, col) => {
    return getSquareState(row, col) === 'x'
  }

  return (
    <div className="game-board-container">
      <div
        className="game-board"
        ref={boardRef}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const isQueenSquare = isQueen(rowIndex, colIndex)
              const isExcludedSquare = isExcluded(rowIndex, colIndex)

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`board-square ${isQueenSquare ? 'queen' : ''} ${isExcludedSquare ? 'excluded' : ''}`}
                  style={{ backgroundColor: cell.color }}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  whileHover={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: (rowIndex + colIndex) * 0.05,
                    duration: 0.3
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isQueenSquare && (
                      <motion.div
                        key="queen"
                        className="queen-icon"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                      >
                        👑
                      </motion.div>
                    )}

                    {isExcludedSquare && (
                      <motion.div
                        key="excluded"
                        className="excluded-icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ✗
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="board-instructions">
        <div className="instruction-item">
          <span className="instruction-icon">👑</span>
          <span>Double click to place/remove queen</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">✗</span>
          <span>Single click or drag to mark as impossible (no queen)</span>
        </div>
      </div>

      <div className="game-rules">
        <h3>Rules:</h3>
        <ul>
          <li>Place 1 queen on each row, column, and color region</li>
          <li>2 queens cannot be adjacent horizontally, vertically, or diagonally</li>
        </ul>
        <p>
          Note: The name of the game is a bit confusing when thinking in chess terms.
          The constraints are Rook + King moves instead of how the Queen moves.
        </p>
      </div>
    </div>
  )
}

export default GameBoard 