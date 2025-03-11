
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Trophy, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  highScore, 
  toggleTheme, 
  isDarkMode = false 
}) => {
  const scoreVariants = {
    initial: { scale: 0.95, opacity: 0.9 },
    animate: { scale: 1, opacity: 1 },
    highlight: { 
      scale: [1, 1.15, 1], 
      boxShadow: ["0 4px 6px rgba(0,0,0,0.1)", "0 10px 15px rgba(0,0,0,0.2)", "0 4px 6px rgba(0,0,0,0.1)"],
      transition: { duration: 0.4 }
    }
  };

  const themeButtonVariants = {
    hover: { 
      scale: 1.1, 
      rotate: isDarkMode ? -30 : 30,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };

  return (
    <div className="flex justify-between items-center w-full max-w-[500px] mx-auto mb-4">
      <motion.div 
        key={`score-${score}`}
        className="glass-panel py-3 px-5 rounded-lg shadow-lg"
        variants={scoreVariants}
        initial="initial"
        animate="animate"
        whileHover="highlight"
      >
        <p className="font-medium text-sm text-slate-500 dark:text-slate-300 flex items-center">
          <Zap className="w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" />
          Score
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</p>
      </motion.div>
      
      <motion.div
        variants={themeButtonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </Button>
      </motion.div>
      
      <motion.div 
        className="glass-panel py-3 px-5 rounded-lg shadow-lg"
        variants={scoreVariants}
        initial="initial"
        animate="animate"
        whileHover="highlight"
      >
        <p className="font-medium text-sm text-slate-500 dark:text-slate-300 flex items-center">
          <Trophy className="w-4 h-4 mr-1 text-amber-500" />
          High Score
        </p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {highScore}
          {highScore > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block ml-2"
            >
              <Star className="w-4 h-4 inline-block text-amber-400" />
            </motion.span>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default ScoreBoard;
