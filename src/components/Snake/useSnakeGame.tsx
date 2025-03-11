
import { useState, useEffect, useCallback, useRef } from 'react';

// Types for the game
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
export type Position = { x: number; y: number };
export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  gridSize: number;
  speed: number;
}

export const useSnakeGame = (initialGridSize = 20) => {
  // Load high score from localStorage
  const getStoredHighScore = (): number => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem('snakeHighScore');
    return stored ? parseInt(stored, 10) : 0;
  };

  // Initialize game state
  const [state, setState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: null,
    nextDirection: null,
    score: 0,
    highScore: getStoredHighScore(),
    gameStatus: 'IDLE',
    gridSize: initialGridSize,
    speed: 150, // Initial speed in ms
  });

  // Game loop reference
  const gameLoopRef = useRef<number | null>(null);

  // Generate random food position
  const generateFood = useCallback((snake: Position[]): Position => {
    const { gridSize } = state;
    let newFood: Position;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      // Ensure food doesn't appear on snake
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, [state.gridSize]);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    const center = Math.floor(state.gridSize / 2);
    setState(prev => ({
      ...prev,
      snake: [{ x: center, y: center }],
      food: generateFood([{ x: center, y: center }]),
      direction: null,
      nextDirection: null,
      score: 0,
      gameStatus: 'IDLE',
      speed: 150, // Reset speed
    }));
    
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, [state.gridSize, generateFood]);

  // Start the game
  const startGame = useCallback(() => {
    if (state.gameStatus !== 'GAME_OVER') {
      setState(prev => ({
        ...prev,
        gameStatus: 'PLAYING',
        direction: prev.direction || 'RIGHT', // Default to RIGHT if no direction
      }));
    }
  }, [state.gameStatus]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    setState(prev => {
      // Update high score if current score is higher
      const newHighScore = Math.max(prev.score, prev.highScore);
      if (newHighScore > prev.highScore) {
        localStorage.setItem('snakeHighScore', newHighScore.toString());
      }
      
      return {
        ...prev,
        gameStatus: 'GAME_OVER',
        highScore: newHighScore,
      };
    });
    
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // Set direction based on key press
  const setDirection = useCallback((newDirection: Direction) => {
    if (!newDirection) return;
    
    setState(prev => {
      // Don't allow 180-degree turns
      if (
        (prev.direction === 'UP' && newDirection === 'DOWN') ||
        (prev.direction === 'DOWN' && newDirection === 'UP') ||
        (prev.direction === 'LEFT' && newDirection === 'RIGHT') ||
        (prev.direction === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prev;
      }
      
      return {
        ...prev,
        nextDirection: newDirection,
      };
    });
  }, []);

  // Move the snake
  const moveSnake = useCallback(() => {
    setState(prev => {
      if (prev.gameStatus !== 'PLAYING') return prev;
      
      // Use nextDirection if available, otherwise use current direction
      const currentDirection = prev.nextDirection || prev.direction;
      if (!currentDirection) return prev;
      
      const head = { ...prev.snake[0] };
      
      // Calculate new head position based on direction
      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }
      
      // Check for collisions with walls
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= prev.gridSize ||
        head.y >= prev.gridSize
      ) {
        // Game over if hit wall
        setTimeout(() => handleGameOver(), 0);
        return prev;
      }
      
      // Check for collisions with self (except tail which will move)
      for (let i = 0; i < prev.snake.length - 1; i++) {
        if (prev.snake[i].x === head.x && prev.snake[i].y === head.y) {
          // Game over if hit self
          setTimeout(() => handleGameOver(), 0);
          return prev;
        }
      }
      
      // Create new snake array with new head
      const newSnake = [head, ...prev.snake];
      
      // Check if snake eats food
      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;
      
      const ateFood = head.x === prev.food.x && head.y === prev.food.y;
      
      if (ateFood) {
        // Generate new food
        newFood = generateFood(newSnake);
        // Increase score
        newScore = prev.score + 1;
        // Increase speed every 5 points, with a minimum speed of 70ms
        if (newScore % 5 === 0) {
          newSpeed = Math.max(70, prev.speed - 10);
        }
      } else {
        // Remove tail if didn't eat food
        newSnake.pop();
      }
      
      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        direction: currentDirection,
        nextDirection: null, // Reset next direction after applying it
        score: newScore,
        speed: newSpeed,
      };
    });
  }, [generateFood, handleGameOver]);

  // Set up key listeners for controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameStatus === 'IDLE' && (
        e.key === 'ArrowUp' || 
        e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || 
        e.key === 'ArrowRight' ||
        e.key === 'w' ||
        e.key === 's' ||
        e.key === 'a' ||
        e.key === 'd'
      )) {
        startGame();
      }
      
      if (state.gameStatus !== 'PLAYING') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.gameStatus, startGame, setDirection]);

  // Game loop
  useEffect(() => {
    if (state.gameStatus !== 'PLAYING') return;
    
    let lastTime = 0;
    const animationFrame = (time: number) => {
      if (time - lastTime > state.speed) {
        moveSnake();
        lastTime = time;
      }
      gameLoopRef.current = requestAnimationFrame(animationFrame);
    };
    
    gameLoopRef.current = requestAnimationFrame(animationFrame);
    
    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [state.gameStatus, state.speed, moveSnake]);

  return {
    snake: state.snake,
    food: state.food,
    score: state.score,
    highScore: state.highScore,
    gameStatus: state.gameStatus,
    gridSize: state.gridSize,
    direction: state.direction,
    resetGame,
    startGame,
    setDirection,
  };
};
