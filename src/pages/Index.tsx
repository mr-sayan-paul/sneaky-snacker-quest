
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
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300`}>
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            <motion.span 
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, 0, -1, 0], 
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="inline-block bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient"
            >
              Snake Game
            </motion.span>
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
          className="mb-4"
        >
          <ScoreBoard 
            score={score} 
            highScore={highScore} 
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              className="rounded-lg overflow-hidden"
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
          </div>
          
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              className="glass-panel p-4 rounded-lg"
            >
              <h3 className="font-semibold text-lg mb-3 text-center text-slate-800 dark:text-slate-200">Game Controls</h3>
              <GameControls
                onDirectionChange={setDirection}
                onReset={resetGame}
                onStart={startGame}
                onPause={pauseGame}
                onSpeedChange={setCustomSpeed}
                currentSpeed={speed}
                gameStatus={gameStatus}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500"
        >
          <p>Use keyboard arrows or WASD to control. Press P or Space to pause.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
