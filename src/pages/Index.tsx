
import React, { useEffect } from 'react';
import { useSnakeGame } from '@/components/Snake/useSnakeGame';
import GameBoard from '@/components/Snake/GameBoard';
import GameControls from '@/components/Snake/GameControls';
import ScoreBoard from '@/components/Snake/ScoreBoard';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const gridSize = isMobile ? 15 : 20; // Smaller grid for mobile
  
  const {
    snake,
    food,
    score,
    highScore,
    gameStatus,
    resetGame,
    startGame,
    pauseGame,
    setDirection,
    direction,
    speed,
    setCustomSpeed,
  } = useSnakeGame(gridSize);

  // Adjust layout on window resize
  useEffect(() => {
    const handleResize = () => {
      // Simply trigger a re-render
      if (gameStatus === 'PLAYING') {
        resetGame();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gameStatus, resetGame]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300`}>
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Snake Game
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Use arrow keys or touch controls to navigate the snake. Eat food to grow longer and avoid hitting the walls or yourself.
          </p>
          {gameStatus === 'PAUSED' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              Game Paused
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <ScoreBoard 
            score={score} 
            highScore={highScore} 
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GameBoard
            snake={snake}
            food={food}
            gridSize={gridSize}
            gameStatus={gameStatus}
            score={score}
            highScore={highScore}
            onReset={resetGame}
            onStart={startGame}
            direction={direction}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GameControls
            onDirectionChange={setDirection}
            onReset={resetGame}
            onStart={startGame}
            onPause={pauseGame}
            onSpeedChange={setCustomSpeed}
            currentSpeed={speed}
            gameStatus={gameStatus}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
