
import React, { useMemo } from 'react';
import { Position, GameStatus, Direction } from './useSnakeGame';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import SnakeSegment from './SnakeSegment';
import { Pause, Play, Trophy, Flame } from 'lucide-react';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  gameStatus: GameStatus;
  score: number;
  highScore: number;
  onReset: () => void;
  onStart: () => void;
  direction: Direction;
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  gridSize,
  gameStatus,
  score,
  highScore,
  onReset,
  onStart,
  direction,
}) => {
  // Create empty grid cells
  const emptyCells = useMemo(() => {
    const cells = [];
    const totalCells = gridSize * gridSize;
    
    for (let i = 0; i < totalCells; i++) {
      const x = i % gridSize;
      const y = Math.floor(i / gridSize);
      
      // Skip cells that are part of the snake or food
      if (
        snake.some(segment => segment.x === x && segment.y === y) ||
        (food.x === x && food.y === y)
      ) {
        continue;
      }
      
      cells.push({ x, y });
    }
    
    return cells;
  }, [snake, food, gridSize]);

  return (
    <div 
      className="relative w-full max-w-[500px] mx-auto aspect-square" 
      style={{ '--grid-size': gridSize } as React.CSSProperties}
    >
      <div className="snake-grid w-full h-full">
        {/* Render empty cells */}
        {emptyCells.map(({ x, y }) => (
          <div
            key={`${x}-${y}`}
            className="snake-cell"
            style={{ gridColumn: x + 1, gridRow: y + 1 }}
          />
        ))}
        
        {/* Render snake body segments */}
        {snake.slice(1, -1).map((segment, index) => (
          <SnakeSegment
            key={`snake-body-${index}`}
            type="body"
            position={segment}
            direction={direction}
            index={index}
            totalLength={snake.length}
          />
        ))}
        
        {/* Render snake tail (last segment) */}
        {snake.length > 1 && (
          <SnakeSegment
            type="tail"
            position={snake[snake.length - 1]}
            direction={direction}
          />
        )}
        
        {/* Render snake head (first segment) */}
        {snake.length > 0 && (
          <SnakeSegment
            type="head"
            position={snake[0]}
            direction={direction}
          />
        )}
        
        {/* Render food with animation */}
        <motion.div
          key={`food-${food.x}-${food.y}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="snake-cell snake-food"
          style={{ 
            gridColumn: food.x + 1, 
            gridRow: food.y + 1,
          }}
        />
      </div>
      
      {/* Game over, paused, or start overlay - improved transitions */}
      <AnimatePresence mode="wait">
        {gameStatus !== 'PLAYING' && (
          <motion.div 
            key={`overlay-${gameStatus}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 flex flex-col items-center justify-center game-over-overlay dark:bg-slate-900/85 ${gameStatus === 'PAUSED' ? 'paused-overlay' : ''}`}
          >
            {gameStatus === 'GAME_OVER' ? (
              <motion.div 
                className="text-center space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <motion.h2 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  Game Over
                </motion.h2>
                <div className="space-y-2">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Flame className="h-5 w-5 text-red-500" />
                    <p className="text-lg text-slate-700 dark:text-slate-300">
                      Score: <span className="font-semibold">{score}</span>
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <p className="text-lg text-slate-700 dark:text-slate-300">
                      High Score: <span className="font-semibold">{highScore}</span>
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={onReset}
                    variant="default" 
                    size="lg"
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Again
                  </Button>
                </motion.div>
              </motion.div>
            ) : gameStatus === 'PAUSED' ? (
              <motion.div 
                className="text-center space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0, -10, 0] }}
                  transition={{ 
                    duration: 0.5,
                    rotate: { repeat: Infinity, repeatDelay: 2, duration: 1.5 }
                  }}
                  className="bg-white/20 dark:bg-slate-800/20 p-6 rounded-full backdrop-blur-sm"
                >
                  <Pause className="h-12 w-12 text-slate-800 dark:text-white opacity-80" />
                </motion.div>
                <motion.h2 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  Game Paused
                </motion.h2>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={onStart}
                    variant="default" 
                    size="lg"
                    className="mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Resume Game
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <motion.h2 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { duration: 0.3 }
                  }}
                  className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                >
                  Snake Game
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-lg text-slate-700 dark:text-slate-300 max-w-xs mx-auto"
                >
                  Use arrow keys or WASD to move the snake. Eat food to grow longer.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={onStart}
                    variant="default" 
                    size="lg"
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Game
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;
