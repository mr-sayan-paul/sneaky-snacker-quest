
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
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
  return (
    <div className="flex justify-between items-center w-full max-w-[500px] mx-auto mb-4">
      <motion.div 
        key={score}
        className="glass-panel py-3 px-5 rounded-lg shadow-lg"
        initial={{ scale: 0.95, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-medium text-sm text-slate-500 dark:text-slate-300">Score</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</p>
      </motion.div>
      
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
      
      <div className="glass-panel py-3 px-5 rounded-lg shadow-lg">
        <p className="font-medium text-sm text-slate-500 dark:text-slate-300">High Score</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{highScore}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
