
import React from 'react';
import { Direction } from './useSnakeGame';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, Play } from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onReset: () => void;
  onStart: () => void;
  gameStatus: 'IDLE' | 'PLAYING' | 'GAME_OVER';
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onReset,
  onStart,
  gameStatus,
}) => {
  return (
    <div className="mt-8">
      {/* Direction controls */}
      {gameStatus === 'PLAYING' && (
        <div className="flex flex-col items-center max-w-[280px] mx-auto">
          <Button
            variant="outline"
            className="w-16 h-16 mb-2 control-button bg-white shadow-sm"
            onClick={() => onDirectionChange('UP')}
          >
            <ArrowUp className="h-8 w-8 text-slate-800" />
          </Button>
          
          <div className="flex justify-center gap-2 mb-2">
            <Button
              variant="outline"
              className="w-16 h-16 control-button bg-white shadow-sm"
              onClick={() => onDirectionChange('LEFT')}
            >
              <ArrowLeft className="h-8 w-8 text-slate-800" />
            </Button>
            
            <Button
              variant="outline"
              className="w-16 h-16 control-button bg-white shadow-sm"
              onClick={() => onDirectionChange('DOWN')}
            >
              <ArrowDown className="h-8 w-8 text-slate-800" />
            </Button>
            
            <Button
              variant="outline"
              className="w-16 h-16 control-button bg-white shadow-sm"
              onClick={() => onDirectionChange('RIGHT')}
            >
              <ArrowRight className="h-8 w-8 text-slate-800" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Game control buttons */}
      {gameStatus !== 'PLAYING' && (
        <div className="flex justify-center mt-4 gap-4">
          {gameStatus === 'GAME_OVER' ? (
            <Button 
              variant="outline"
              size="lg"
              className="control-button bg-white shadow-sm border-slate-200"
              onClick={onReset}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Restart
            </Button>
          ) : (
            <Button 
              variant="outline"
              size="lg"
              className="control-button bg-white shadow-sm border-slate-200"
              onClick={onStart}
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default GameControls;
