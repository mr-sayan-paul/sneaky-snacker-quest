
import { useState, useEffect, useCallback, useRef } from 'react';

// Types for the game
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
export type Position = { x: number; y: number };
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

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
  baseSpeed: number;
  lastRender: number;
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
    snake: [{ x: Math.floor(initialGridSize / 2), y: Math.floor(initialGridSize / 2) }],
    food: { x: 5, y: 5 },
    direction: null,
    nextDirection: null,
    score: 0,
    highScore: getStoredHighScore(),
    gameStatus: 'IDLE',
    gridSize: initialGridSize,
    speed: 150, // Initial speed in ms
    baseSpeed: 150, // Base speed that can be adjusted by the slider
    lastRender: 0,
  });

  // Game loop reference
  const gameLoopRef = useRef<number | null>(null);
  
  // Store refs for performance optimization
  const stateRef = useRef(state);
  stateRef.current = state;

  // Generate random food position - optimized
  const generateFood = useCallback((snake: Position[]): Position => {
    const gridSize = stateRef.current.gridSize;
    const gridMatrix = new Array(gridSize * gridSize).fill(false);
    
    // Mark snake positions in the matrix
    snake.forEach(segment => {
      const index = segment.y * gridSize + segment.x;
      if (index >= 0 && index < gridSize * gridSize) {
        gridMatrix[index] = true;
      }
    });
    
    // Find all empty positions
    const emptyPositions: number[] = [];
    gridMatrix.forEach((occupied, index) => {
      if (!occupied) {
        emptyPositions.push(index);
      }
    });
    
    // Select a random empty position
    if (emptyPositions.length === 0) return { x: 0, y: 0 }; // Fallback
    
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const position = emptyPositions[randomIndex];
    
    return {
      x: position % gridSize,
      y: Math.floor(position / gridSize)
    };
  }, []);

  // Allow user to set a custom base speed
  const setCustomSpeed = useCallback((newBaseSpeed: number) => {
    setState(prev => ({
      ...prev,
      baseSpeed: newBaseSpeed,
      // Also update current speed if not affected by score yet
      speed: prev.score < 5 ? newBaseSpeed : Math.max(70, newBaseSpeed - (Math.floor(prev.score / 5) * 10)),
    }));
  }, []);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    const center = Math.floor(stateRef.current.gridSize / 2);
    setState(prev => ({
      ...prev,
      snake: [{ x: center, y: center }],
      food: generateFood([{ x: center, y: center }]),
      direction: null,
      nextDirection: null,
      score: 0,
      gameStatus: 'IDLE',
      speed: prev.baseSpeed, // Reset speed to base speed
      lastRender: 0,
    }));
    
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, [generateFood]);

  // Start the game
  const startGame = useCallback(() => {
    if (stateRef.current.gameStatus === 'IDLE' || stateRef.current.gameStatus === 'PAUSED') {
      setState(prev => ({
        ...prev,
        gameStatus: 'PLAYING',
        direction: prev.direction || 'RIGHT', // Default to RIGHT if no direction
        lastRender: 0,
      }));
    }
  }, []);

  // Pause the game
  const pauseGame = useCallback(() => {
    if (stateRef.current.gameStatus === 'PLAYING') {
      setState(prev => ({
        ...prev,
        gameStatus: 'PAUSED',
      }));
      
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, []);

  // Handle game over
  const handleGameOver = useCallback(() => {
    const currentState = stateRef.current;
    
    // Update high score if current score is higher
    const newHighScore = Math.max(currentState.score, currentState.highScore);
    if (newHighScore > currentState.highScore) {
      localStorage.setItem('snakeHighScore', newHighScore.toString());
    }
    
    setState(prev => ({
      ...prev,
      gameStatus: 'GAME_OVER',
      highScore: newHighScore,
    }));
    
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

  // Move the snake - optimized
  const moveSnake = useCallback(() => {
    const currentState = stateRef.current;
    if (currentState.gameStatus !== 'PLAYING') return;
    
    // Use nextDirection if available, otherwise use current direction
    const currentDirection = currentState.nextDirection || currentState.direction;
    if (!currentDirection) return;
    
    const head = { ...currentState.snake[0] };
    
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
      head.x >= currentState.gridSize ||
      head.y >= currentState.gridSize
    ) {
      // Game over if hit wall
      handleGameOver();
      return;
    }
    
    // Check for collisions with self (except tail which will move)
    for (let i = 0; i < currentState.snake.length - 1; i++) {
      if (currentState.snake[i].x === head.x && currentState.snake[i].y === head.y) {
        // Game over if hit self
        handleGameOver();
        return;
      }
    }
    
    // Create new snake array with new head
    const newSnake = [head, ...currentState.snake];
    
    // Check if snake eats food
    let newFood = currentState.food;
    let newScore = currentState.score;
    let newSpeed = currentState.speed;
    
    const ateFood = head.x === currentState.food.x && head.y === currentState.food.y;
    
    if (ateFood) {
      // Generate new food
      newFood = generateFood(newSnake);
      // Increase score
      newScore = currentState.score + 1;
      // Increase speed every 5 points, with a minimum speed of 70ms
      if (newScore % 5 === 0) {
        newSpeed = Math.max(70, currentState.baseSpeed - Math.floor(newScore / 5) * 10);
      }
    } else {
      // Remove tail if didn't eat food
      newSnake.pop();
    }
    
    setState(prev => ({
      ...prev,
      snake: newSnake,
      food: newFood,
      direction: currentDirection,
      nextDirection: null, // Reset next direction after applying it
      score: newScore,
      speed: newSpeed,
    }));
  }, [generateFood, handleGameOver]);

  // Set up key listeners for controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentState = stateRef.current;
      
      if (currentState.gameStatus === 'IDLE' && (
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
      
      // Add pause functionality for 'p' or 'space' key
      if (e.key === 'p' || e.key === ' ') {
        e.preventDefault(); // Prevent spacebar from scrolling
        if (currentState.gameStatus === 'PLAYING') {
          pauseGame();
        } else if (currentState.gameStatus === 'PAUSED') {
          startGame();
        }
      }
      
      if (currentState.gameStatus !== 'PLAYING') return;
      
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
  }, [setDirection, startGame, pauseGame]);

  // Game loop - optimized performance
  useEffect(() => {
    if (state.gameStatus !== 'PLAYING') return;
    
    // Use request animation frame for consistent performance
    const animateGame = (timestamp: number) => {
      // Calculate time elapsed since last frame
      const elapsed = timestamp - stateRef.current.lastRender;
      
      // Only update if enough time has passed (based on speed)
      if (elapsed > stateRef.current.speed) {
        moveSnake();
        setState(prev => ({ ...prev, lastRender: timestamp }));
      }
      
      // Request next frame
      gameLoopRef.current = requestAnimationFrame(animateGame);
    };
    
    // Start the animation loop
    gameLoopRef.current = requestAnimationFrame(animateGame);
    
    // Cleanup on unmount
    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [state.gameStatus, moveSnake]);

  return {
    snake: state.snake,
    food: state.food,
    score: state.score,
    highScore: state.highScore,
    gameStatus: state.gameStatus,
    gridSize: state.gridSize,
    direction: state.direction,
    speed: state.speed,
    resetGame,
    startGame,
    pauseGame,
    setDirection,
    setCustomSpeed,
  };
};
