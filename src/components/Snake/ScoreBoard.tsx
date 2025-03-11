
import React from 'react';
import { motion } from 'framer-motion';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-[500px] mx-auto mb-4">
      <motion.div 
        key={score}
        className="glass-panel py-3 px-5 rounded-lg"
        initial={{ scale: 0.95, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-medium text-sm text-slate-500">Score</p>
        <p className="text-2xl font-bold text-slate-900">{score}</p>
      </motion.div>
      
      <div className="glass-panel py-3 px-5 rounded-lg">
        <p className="font-medium text-sm text-slate-500">High Score</p>
        <p className="text-2xl font-bold text-slate-900">{highScore}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
