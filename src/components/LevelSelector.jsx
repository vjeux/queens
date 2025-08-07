import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './LevelSelector.css'

const LevelSelector = ({ levels, onLevelSelect }) => {
  const [hoveredPuzzle, setHoveredPuzzle] = useState(null)

  const completedPuzzlesJSON = localStorage.getItem('queens-completed-puzzles');
  const completedPuzzles = new Set(JSON.parse(completedPuzzlesJSON || '[]'));

  const handlePuzzleClick = (puzzleIndex) => {
    onLevelSelect(puzzleIndex)
  }

  const handlePuzzleHover = (puzzleIndex) => {
    setHoveredPuzzle(puzzleIndex)
  }

  const handlePuzzleLeave = () => {
    setHoveredPuzzle(null)
  }

  const getPuzzleInfo = (puzzleIndex) => {
    const puzzle = levels[puzzleIndex]
    return {
      size: puzzle.size,
      colors: new Set(puzzle.colorRegions.flat()).size,
      isCompleted: completedPuzzles.has(puzzleIndex)
    }
  }

  // Group puzzles by size
  const groupedPuzzles = levels.reduce((groups, puzzle, index) => {
    const size = puzzle.size
    if (!groups[size]) {
      groups[size] = []
    }
    groups[size].push({ ...puzzle, index })
    return groups
  }, {})

  // Color scheme for different sizes
  const sizeColors = {
    7: '#FF6B6B',   // Red
    8: '#4ECDC4',   // Teal
    9: '#45B7D1',   // Blue
    10: '#96CEB4',  // Green
    11: '#FFEAA7'   // Yellow
  }

  // Sort sizes and calculate grid dimensions for each group
  const sortedSizes = Object.keys(groupedPuzzles).sort((a, b) => parseInt(a) - parseInt(b))

  return (
    <div className="level-selector">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="level-title"
      >
        Choose a Puzzle
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="level-description"
      >
        {completedPuzzles.size} of {levels.length} puzzles completed
      </motion.p>
      
      <div className="puzzle-groups">
        {sortedSizes.map((size, groupIndex) => {
          const puzzles = groupedPuzzles[size]
          const puzzlesPerRow = Math.ceil(Math.sqrt(puzzles.length))
          
          return (
            <motion.div
              key={size}
              className="puzzle-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + groupIndex * 0.1 }}
            >
              <motion.h3
                className="group-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + groupIndex * 0.1 }}
              >
                {size}×{size} Puzzles ({puzzles.length})
              </motion.h3>
              
              <div 
                className="puzzles-grid"
                style={{ 
                  margin: '0 auto'
                }}
              >
                {puzzles.map((puzzle, puzzleIndex) => {
                  const globalIndex = puzzle.index
                  const info = getPuzzleInfo(globalIndex)
                  const isCompleted = info.isCompleted
                  const isHovered = hoveredPuzzle === globalIndex
                  
                  return (
                    <motion.div
                      key={globalIndex}
                      className={`puzzle-square ${isCompleted ? 'completed' : ''} ${isHovered ? 'hovered' : ''}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (groupIndex * 0.1) + (puzzleIndex * 0.01) }}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                      }}
                      onClick={() => handlePuzzleClick(globalIndex)}
                      onMouseEnter={() => handlePuzzleHover(globalIndex)}
                      onMouseLeave={handlePuzzleLeave}
                      style={{
                        backgroundColor: isCompleted ? '#4CAF50' : sizeColors[size] || '#f0f0f0',
                        border: isCompleted ? '2px solid #2E7D32' : `2px solid ${sizeColors[size] || '#ddd'}`,
                        color: isCompleted ? 'white' : 'white'
                      }}
                    >
                      {isCompleted && (
                        <motion.div
                          className="completion-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            fontSize: '0.6rem'
                          }}
                        >
                          ✓
                        </motion.div>
                                            )}
                      
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {globalIndex + 1}
                      </div>
                      
                      {isHovered && (
                        <motion.div
                          className="puzzle-tooltip"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#333',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            whiteSpace: 'nowrap',
                            zIndex: 1000,
                            marginBottom: '8px'
                          }}
                        >
                          Puzzle #{globalIndex + 1} - {size}×{size} board
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default LevelSelector 