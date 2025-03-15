
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Position, Direction } from './useSnakeGame';

interface SnakeSegmentProps {
  type: 'head' | 'body' | 'tail';
  position: Position;
  direction: Direction;
  index?: number;
  totalLength?: number;
}

const SnakeSegment: React.FC<SnakeSegmentProps> = memo(({ 
  type, 
  position, 
  direction, 
  index = 0, 
  totalLength = 1
}) => {
  // Get rotation angle based on direction
  const getRotation = () => {
    switch (direction) {
      case 'UP': return '270deg';
      case 'DOWN': return '90deg';
      case 'LEFT': return '180deg';
      case 'RIGHT': return '0deg';
      default: return '0deg';
    }
  };

  // Optimize animations by reducing complexity
  const baseTransition = { duration: 0.15, type: "spring", stiffness: 300 };
  
  if (type === 'head') {
    // Snake head with eyes and tongue - optimized animations
    return (
      <motion.div
        key={`snake-head-${position.x}-${position.y}`}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={baseTransition}
        className="snake-cell snake-head relative bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          transform: `rotate(${getRotation()})`,
          boxShadow: '0 0 8px rgba(0, 0, 255, 0.3)',
        }}
      >
        {/* Eyes - simplified animation */}
        <div className="absolute left-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute right-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"></div>
        
        {/* Pupils - simplified animation */} 
        <div className="absolute left-1/4 top-1/4 w-0.5 h-0.5 bg-black rounded-full translate-x-0.5 translate-y-0.5"></div>
        <div className="absolute right-1/4 top-1/4 w-0.5 h-0.5 bg-black rounded-full -translate-x-0.5 translate-y-0.5"></div>
        
        {/* Tongue - simplified animation */}
        <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-red-500 origin-top" style={{ transform: 'translateX(-50%)' }}></div>
      </motion.div>
    );
  } else if (type === 'tail') {
    // Snake tail (last segment) with simplified animation
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={baseTransition}
        className="snake-cell snake-tail"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          transform: `rotate(${getRotation()})`,
          borderTopLeftRadius: '40%',
          borderTopRightRadius: '40%',
        }}
      >
        {/* Tail tip - simplified */}
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-slate-300 dark:bg-slate-500 rounded-full" 
             style={{ transform: 'translateX(-50%)' }}></div>
      </motion.div>
    );
  } else {
    // Snake body with color gradient based on position - simplified
    const opacity = 0.9 - (index / (totalLength * 2));
    // Use variable directly
    const hue = 'var(--snake-body)';
    
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={baseTransition}
        className="snake-cell snake-body"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          opacity: opacity,
          background: `hsl(${hue})`,
          boxShadow: '0 0 5px rgba(0, 0, 255, 0.2)',
        }}
      />
    );
  }
});

SnakeSegment.displayName = 'SnakeSegment';

export default SnakeSegment;
