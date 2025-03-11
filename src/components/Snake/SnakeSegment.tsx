
import React from 'react';
import { motion } from 'framer-motion';
import { Position, Direction } from './useSnakeGame';

interface SnakeSegmentProps {
  type: 'head' | 'body' | 'tail';
  position: Position;
  direction: Direction;
  index?: number;
  totalLength?: number;
}

const SnakeSegment: React.FC<SnakeSegmentProps> = ({ 
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

  if (type === 'head') {
    // Snake head with eyes and tongue
    return (
      <motion.div
        key={`snake-head-${position.x}-${position.y}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.1 }}
        className="snake-cell snake-head relative"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          transform: `rotate(${getRotation()})`,
        }}
      >
        {/* Eyes */}
        <motion.div 
          className="absolute left-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        <motion.div 
          className="absolute right-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        
        {/* Pupils */}
        <motion.div 
          className="absolute left-1/4 top-1/4 w-0.5 h-0.5 bg-black rounded-full translate-x-0.5 translate-y-0.5"
          animate={{ y: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        <motion.div 
          className="absolute right-1/4 top-1/4 w-0.5 h-0.5 bg-black rounded-full -translate-x-0.5 translate-y-0.5"
          animate={{ y: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        
        {/* Tongue (animated) */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-red-500 origin-top"
          animate={{ scaleY: [1, 1.5, 1] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
          style={{ transform: 'translateX(-50%)' }}
        ></motion.div>
      </motion.div>
    );
  } else if (type === 'tail') {
    // Snake tail (last segment) with animation
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="snake-cell snake-tail"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          transform: `rotate(${getRotation()})`,
          borderTopLeftRadius: '40%',
          borderTopRightRadius: '40%',
        }}
      >
        {/* Tail tip animation */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-1 h-1 bg-slate-300 dark:bg-slate-500 rounded-full"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
          style={{ transform: 'translateX(-50%)' }}
        ></motion.div>
      </motion.div>
    );
  } else {
    // Snake body with color gradient based on position
    const opacity = 0.9 - (index / (totalLength * 2));
    const hue = type === 'head' ? 'var(--snake-head)' : 'var(--snake-body)';
    
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.1 }}
        className="snake-cell snake-body"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          opacity: opacity,
          background: `hsl(${hue})`,
        }}
      />
    );
  }
};

export default SnakeSegment;
