
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  highScore
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

  return (
    <div className="flex flex-col w-full gap-3">
      <motion.div 
        key={`score-${score}`}
        className="glass-panel py-2 px-4 rounded-lg shadow-lg w-full"
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
        className="glass-panel py-2 px-4 rounded-lg shadow-lg w-full"
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
