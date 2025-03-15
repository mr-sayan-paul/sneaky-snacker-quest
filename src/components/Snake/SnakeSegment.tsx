
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
    // Snake head with eyes and tongue - enhanced animations
    return (
      <motion.div
        key={`snake-head-${position.x}-${position.y}`}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, type: "spring", stiffness: 300 }}
        className="snake-cell snake-head relative bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
        style={{ 
          gridColumn: position.x + 1, 
          gridRow: position.y + 1,
          transform: `rotate(${getRotation()})`,
          boxShadow: '0 0 8px rgba(0, 0, 255, 0.3)',
        }}
      >
        {/* Eyes with enhanced animations */}
        <motion.div 
          className="absolute left-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        <motion.div 
          className="absolute right-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        
        {/* Pupils with more lively movement */}
        <motion.div 
          className="absolute left-1/4 top-1/4 w-0.5 h-0.5 bg-black rounded-full translate-x-0.5 translate-y-0.5"
          animate={{ y: [0, 0.3, 0], x: [0, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        <motion.div 
          className="absolute right-1/4 top-1/4 w-0.5 h-0.5 bg-black rounded-full -translate-x-0.5 translate-y-0.5"
          animate={{ y: [0, 0.3, 0], x: [0, -0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        
        {/* Tongue with more dynamic animation */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-red-500 origin-top"
          animate={{ 
            scaleY: [1, 1.7, 1], 
            rotate: [0, 3, -3, 0]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            repeatType: "reverse",
            times: [0, 0.4, 0.8, 1]
          }}
          style={{ transform: 'translateX(-50%)' }}
        ></motion.div>
      </motion.div>
    );
  } else if (type === 'tail') {
    // Snake tail (last segment) with enhanced animation
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
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
          animate={{ 
            y: [0, -1, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{ transform: 'translateX(-50%)' }}
        ></motion.div>
      </motion.div>
    );
  } else {
    // Snake body with color gradient based on position
    const opacity = 0.9 - (index / (totalLength * 2));
    // Fixed: Use a string value directly
    const hue = 'var(--snake-body)';
    
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
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
};

export default SnakeSegment;
