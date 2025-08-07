# Queens Puzzle Game

A Sudoku-like puzzle game where you place queens on a colored board so that no two queens threaten each other.

## How to Play

1. **Objective**: Place queens on the board so that no two queens can attack each other
2. **Rules**:
   - Queens can move any number of squares horizontally, vertically, or diagonally
   - Only one queen can be placed per row and column
   - Queens cannot be placed adjacent to each other
   - The board is divided into colored regions that must be respected

## Controls

- **Single Click**: Mark a square as impossible (shows an X)
- **Double Click**: Place or remove a queen (shows a crown 👑)
- **Visual Indicators**:
  - Red border: Square is threatened by a queen
  - Golden border: Square contains a queen
  - Red X: Square marked as impossible

## Difficulty Levels

- **Beginner**: 6×6 board with 3 colored regions - Perfect for learning the basics
- **Easy**: 7×7 board with 4 colored regions - A bit more challenging
- **Medium**: 8×8 board with 5 colored regions - Requires strategic thinking
- **Hard**: 9×9 board with 6 colored regions - For experienced players
- **Expert**: 10×10 board with 7 colored regions - The ultimate challenge

Each difficulty level uses predefined puzzle layouts from the `levels.js` file, ensuring consistent and well-designed challenges.

## Features

- ✨ Beautiful animations and transitions
- 🎯 Multiple difficulty levels
- 📊 Real-time game statistics
- 🎨 Colorful contiguous regions
- 📱 Responsive design for mobile devices
- ⏱️ Timer and move counter
- 🏆 Progress tracking

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Technologies Used

- React 18
- Framer Motion for animations
- Vite for build tooling
- Prettier for code formatting

## Game Logic

The game uses predefined puzzle layouts from the `levels.js` file, which contains carefully designed boards with contiguous colored regions. Each region is a different color and represents a constraint that must be considered when placing queens.

The win condition is checked by ensuring:
- No two queens are in the same row
- No two queens are in the same column  
- No two queens are on the same diagonal
- The correct number of queens are placed (one per row/column)

Enjoy the puzzle! 🧩 