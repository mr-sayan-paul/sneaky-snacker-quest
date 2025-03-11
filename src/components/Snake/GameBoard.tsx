
import React, { useMemo } from 'react';
import { Position, GameStatus, Direction } from './useSnakeGame';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SnakeSegment from './SnakeSegment';

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
        
        {/* Render food */}
        <motion.div
          key={`food-${food.x}-${food.y}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="snake-cell snake-food"
          style={{ 
            gridColumn: food.x + 1, 
            gridRow: food.y + 1,
          }}
        />
      </div>
      
      {/* Game over or start overlay */}
      {gameStatus !== 'PLAYING' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center game-over-overlay dark:bg-slate-900/85">
          {gameStatus === 'GAME_OVER' ? (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white score-text delay-[0ms]">
                Game Over
              </h2>
              <div className="space-y-2">
                <p className="text-lg text-slate-700 dark:text-slate-300 score-text delay-[100ms]">
                  Score: <span className="font-semibold">{score}</span>
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 score-text delay-[200ms]">
                  High Score: <span className="font-semibold">{highScore}</span>
                </p>
              </div>
              <Button 
                onClick={onReset}
                variant="default" 
                size="lg"
                className="mt-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 score-text delay-[300ms]"
              >
                Play Again
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white score-text delay-[0ms]">
                Snake Game
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 max-w-xs mx-auto score-text delay-[100ms]">
                Use arrow keys or WASD to move the snake. Eat food to grow longer.
              </p>
              <Button 
                onClick={onStart}
                variant="default" 
                size="lg"
                className="mt-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 score-text delay-[200ms]"
              >
                Start Game
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
