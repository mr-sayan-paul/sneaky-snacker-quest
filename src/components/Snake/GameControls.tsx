
import React from 'react';
import { Direction } from './useSnakeGame';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Play,
  Pause,
  Gauge,
  FastForward,
  Gamepad,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onReset: () => void;
  onStart: () => void;
  onPause?: () => void;
  onSpeedChange?: (speed: number) => void;
  gameStatus: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
  currentSpeed?: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onReset,
  onStart,
  onPause,
  onSpeedChange,
  gameStatus,
  currentSpeed = 150,
}) => {
  // Convert speed to slider value (slider shows 1-10, but speed is 70-150ms)
  const speedValue = Math.round(((150 - currentSpeed) / 80) * 9) + 1;
  
  // Animations for button hover
  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };
  
  return (
    <div className="mt-4">
      {/* Game status text with animation */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 flex justify-center"
      >
        <div className="inline-block px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
          <Gamepad className="inline-block w-4 h-4 mr-1" />
          {gameStatus === 'IDLE' && "Ready to Play"}
          {gameStatus === 'PLAYING' && "Game On!"}
          {gameStatus === 'PAUSED' && "Game Paused"}
          {gameStatus === 'GAME_OVER' && "Game Over"}
        </div>
      </motion.div>
      
      {/* Game control buttons (pause/play/restart) */}
      <div className="flex flex-col gap-3 mb-6 max-w-[280px] mx-auto">
        <div className="flex gap-3">
          {gameStatus === 'PLAYING' && onPause && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              <Button 
                variant="outline"
                className="w-full control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border-slate-200 dark:border-slate-700"
                onClick={onPause}
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            </motion.div>
          )}
          
          {gameStatus === 'PAUSED' && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              <Button 
                variant="outline"
                className="w-full control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border-slate-200 dark:border-slate-700"
                onClick={onStart}
              >
                <Play className="h-5 w-5 mr-2" />
                Resume
              </Button>
            </motion.div>
          )}
          
          {(gameStatus === 'IDLE' || gameStatus === 'GAME_OVER') && (
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full"
            >
              <Button 
                variant="outline"
                className="w-full control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border-slate-200 dark:border-slate-700"
                onClick={onStart}
              >
                <Play className="h-5 w-5 mr-2" />
                {gameStatus === 'IDLE' ? 'Start' : 'Play Again'}
              </Button>
            </motion.div>
          )}
        </div>
        
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="w-full"
        >
          <Button 
            variant="outline"
            className="w-full control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border-slate-200 dark:border-slate-700"
            onClick={onReset}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Restart
          </Button>
        </motion.div>
      </div>
      
      {/* Direction controls */}
      {(gameStatus === 'PLAYING' || gameStatus === 'PAUSED') && (
        <div className="flex flex-col items-center max-w-[280px] mx-auto">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="outline"
              className="w-16 h-16 mb-2 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
              onClick={() => onDirectionChange('UP')}
              disabled={gameStatus === 'PAUSED'}
            >
              <ArrowUp className="h-8 w-8 text-slate-800 dark:text-slate-200" />
            </Button>
          </motion.div>
          
          <div className="flex justify-center gap-2 mb-2">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                className="w-16 h-16 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
                onClick={() => onDirectionChange('LEFT')}
                disabled={gameStatus === 'PAUSED'}
              >
                <ArrowLeft className="h-8 w-8 text-slate-800 dark:text-slate-200" />
              </Button>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                className="w-16 h-16 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
                onClick={() => onDirectionChange('DOWN')}
                disabled={gameStatus === 'PAUSED'}
              >
                <ArrowDown className="h-8 w-8 text-slate-800 dark:text-slate-200" />
              </Button>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                className="w-16 h-16 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
                onClick={() => onDirectionChange('RIGHT')}
                disabled={gameStatus === 'PAUSED'}
              >
                <ArrowRight className="h-8 w-8 text-slate-800 dark:text-slate-200" />
              </Button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Speed control slider - always visible */}
      {onSpeedChange && (
        <div className="mt-6 max-w-[280px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
              <Gauge className="h-4 w-4 mr-1" /> {gameStatus === 'PLAYING' ? 'Speed' : 'Initial Speed'}
            </span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full"
            >
              <FastForward className="h-3 w-3 mr-1 text-slate-700 dark:text-slate-300" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {speedValue}/10
              </span>
            </motion.div>
          </div>
          <Slider
            defaultValue={[speedValue]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => {
              if (onSpeedChange) {
                // Convert slider value (1-10) back to speed (70-150ms)
                const newSpeed = 150 - ((value[0] - 1) / 9) * 80;
                onSpeedChange(Math.round(newSpeed));
              }
            }}
            className="w-full"
            disabled={gameStatus === 'PAUSED'}
          />
        </div>
      )}
    </div>
  );
};

export default GameControls;
