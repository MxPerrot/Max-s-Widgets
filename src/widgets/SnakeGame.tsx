import React, { useState, useEffect, useRef } from 'react';
import { WidgetBase } from '../WidgetBase';

const BOARD_SIZE = 10; // 10x10 grid
const INITIAL_SNAKE = [{ x: 5, y: 5 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving up initially

export const SnakeWidget = () => {
    const generateFood = (snake: { x: number; y: number }[]) => {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * BOARD_SIZE),
                y: Math.floor(Math.random() * BOARD_SIZE),
            };
        } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    };

    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(() => generateFood(INITIAL_SNAKE));
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [isRunning, setIsRunning] = useState(false); // Tracks whether the game is running
    const directionRef = useRef(direction);
    const [canChangeDirection, setCanChangeDirection] = useState(true); // Lock for direction changes

    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        directionRef.current = direction; // Update the ref whenever direction changes
    }, [direction]);

    useEffect(() => {
        if (!isRunning || gameOver) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!canChangeDirection) return; // Ignore key presses if the snake hasn't moved yet

            const currentDirection = directionRef.current;

            // Prevent reversing direction
            switch (e.key) {
                case 'ArrowUp':
                    if (currentDirection.y === 0) {
                        setDirection({ x: 0, y: -1 });
                        setCanChangeDirection(false); // Lock direction changes
                    }
                    break;
                case 'ArrowDown':
                    if (currentDirection.y === 0) {
                        setDirection({ x: 0, y: 1 });
                        setCanChangeDirection(false); // Lock direction changes
                    }
                    break;
                case 'ArrowLeft':
                    if (currentDirection.x === 0) {
                        setDirection({ x: -1, y: 0 });
                        setCanChangeDirection(false); // Lock direction changes
                    }
                    break;
                case 'ArrowRight':
                    if (currentDirection.x === 0) {
                        setDirection({ x: 1, y: 0 });
                        setCanChangeDirection(false); // Lock direction changes
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canChangeDirection, isRunning]);

    useEffect(() => {
        if (!isRunning || gameOver) return;

        const interval = setInterval(() => {
            setSnake((prevSnake) => {
                const newHead = {
                    x: (prevSnake[0].x + direction.x + BOARD_SIZE) % BOARD_SIZE,
                    y: (prevSnake[0].y + direction.y + BOARD_SIZE) % BOARD_SIZE,
                };

                // Check for collisions with itself
                if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    handleStop(); // Send stop signal on game over
                    clearInterval(interval);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check if food is eaten
                if (newHead.x === food.x && newHead.y === food.y) {
                    setFood(generateFood(newSnake)); // Pass the updated snake to avoid overlap
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                setCanChangeDirection(true); // Unlock direction changes after the snake moves
                return newSnake;
            });
        }, 200);

        return () => clearInterval(interval);
    }, [direction, food, gameOver, isRunning]);

    const handleStart = () => {
        setIsRunning(true);
        setGameOver(false);
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(generateFood(INITIAL_SNAKE));
    };

    const handleStop = () => {
        setIsRunning(false);
        setGameOver(false);
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(generateFood(INITIAL_SNAKE));
    };

    return (
        <WidgetBase onStart={handleStart} onStop={handleStop} isRunning={isRunning} width={400} height={400}>
            <div
                ref={boardRef}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#222',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                    position: 'relative',
                }}
            >
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        style={{
                            gridColumnStart: segment.x + 1,
                            gridRowStart: segment.y + 1,
                            background: 'lime',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                ))}
                <div
                    style={{
                        gridColumnStart: food.x + 1,
                        gridRowStart: food.y + 1,
                        background: 'red',
                        width: '100%',
                        height: '100%',
                    }}
                />
                {gameOver && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                        }}
                    >
                        Game Over
                    </div>
                )}
            </div>
        </WidgetBase>
    );
};