
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
  Gauge 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onReset: () => void;
  onStart: () => void;
  onSpeedChange?: (speed: number) => void;
  gameStatus: 'IDLE' | 'PLAYING' | 'GAME_OVER';
  currentSpeed?: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onReset,
  onStart,
  onSpeedChange,
  gameStatus,
  currentSpeed = 150,
}) => {
  // Convert speed to slider value (slider shows 1-10, but speed is 70-150ms)
  const speedValue = Math.round(((150 - currentSpeed) / 80) * 9) + 1;
  
  return (
    <div className="mt-8">
      {/* Direction controls */}
      {gameStatus === 'PLAYING' && (
        <div className="flex flex-col items-center max-w-[280px] mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="w-16 h-16 mb-2 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
              onClick={() => onDirectionChange('UP')}
            >
              <ArrowUp className="h-8 w-8 text-slate-800 dark:text-slate-200" />
            </Button>
          </motion.div>
          
          <div className="flex justify-center gap-2 mb-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="w-16 h-16 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
                onClick={() => onDirectionChange('LEFT')}
              >
                <ArrowLeft className="h-8 w-8 text-slate-800 dark:text-slate-200" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="w-16 h-16 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
                onClick={() => onDirectionChange('DOWN')}
              >
                <ArrowDown className="h-8 w-8 text-slate-800 dark:text-slate-200" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="w-16 h-16 control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
                onClick={() => onDirectionChange('RIGHT')}
              >
                <ArrowRight className="h-8 w-8 text-slate-800 dark:text-slate-200" />
              </Button>
            </motion.div>
          </div>
          
          {/* Speed control slider */}
          {onSpeedChange && (
            <div className="mt-6 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <Gauge className="h-4 w-4 mr-1" /> Speed
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {speedValue}/10
                </span>
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
              />
            </div>
          )}
        </div>
      )}
      
      {/* Game control buttons */}
      {gameStatus !== 'PLAYING' && (
        <div className="flex justify-center mt-4 gap-4">
          {gameStatus === 'GAME_OVER' ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline"
                size="lg"
                className="control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border-slate-200 dark:border-slate-700"
                onClick={onReset}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Restart
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline"
                size="lg"
                className="control-button bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border-slate-200 dark:border-slate-700"
                onClick={onStart}
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameControls;
