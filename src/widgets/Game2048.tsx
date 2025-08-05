import React, { useState, useEffect } from 'react';
import { WidgetBase } from '../WidgetBase';

const BOARD_SIZE = 4; // 4x4 grid

export const Game2048 = () => {
    const [board, setBoard] = useState<number[][]>(generateInitialBoard());
    const [isRunning, setIsRunning] = useState(false);

    const handleStart = () => {
        setIsRunning(true);
        setBoard(generateInitialBoard());
    };

    const handleStop = () => {
        setIsRunning(false);
        setBoard(generateInitialBoard());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isRunning) return;

        let newBoard = [...board];
        switch (e.key) {
            case 'ArrowUp':
                newBoard = moveUp(newBoard);
                break;
            case 'ArrowDown':
                newBoard = moveDown(newBoard);
                break;
            case 'ArrowLeft':
                newBoard = moveLeft(newBoard);
                break;
            case 'ArrowRight':
                newBoard = moveRight(newBoard);
                break;
            default:
                return;
        }

        // Only update the board if it has changed
        if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
            addRandomTile(newBoard);
            setBoard(newBoard);

            // Check if the game is over
            if (isGameOver(newBoard)) {
                // Stop the game
                handleStop();
            }
        }
    };

    const isGameOver = (board: number[][]): boolean => {
        // Check for any empty tiles
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === 0) {
                    return false; // Game is not over if there's an empty tile
                }
            }
        }
    
        // Check for possible merges horizontally
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE - 1; j++) {
                if (board[i][j] === board[i][j + 1]) {
                    return false; // Game is not over if adjacent horizontal tiles can merge
                }
            }
        }
    
        // Check for possible merges vertically
        for (let i = 0; i < BOARD_SIZE - 1; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === board[i + 1][j]) {
                    return false; // Game is not over if adjacent vertical tiles can merge
                }
            }
        }
    
        // No empty tiles and no possible merges
        return true;
    };

    useEffect(() => {
        if (isRunning) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRunning, board]);

    return (
        <WidgetBase onStart={handleStart} onStop={handleStop} isRunning={isRunning} width={400} height={400}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                    gap: '5px',
                    width: '100%',
                    height: '100%',
                    background: '#bbada0',
                    padding: '10px',
                    boxSizing: 'border-box',
                }}
            >
                {board.flat().map((value, index) => (
                    <div
                        key={index}
                        style={{
                            background: value ? getTileColor(value) : '#cdc1b4',
                            color: value > 4 ? '#f9f6f2' : '#776e65',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '5px',
                            transition: 'all 0.2s ease-in-out', // Smooth animation
                            transform: value ? 'scale(1.1)' : 'scale(1)', // Slight pop effect
                        }}
                    >
                        {value || ''}
                    </div>
                ))}
            </div>
        </WidgetBase>
    );
};

// Helper functions
const generateInitialBoard = (): number[][] => {
    const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    addRandomTile(board);
    addRandomTile(board);
    return board;
};

const addRandomTile = (board: number[][]) => {
    const emptyTiles: { x: number; y: number }[] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) emptyTiles.push({ x: i, y: j });
        }
    }
    if (emptyTiles.length > 0) {
        const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
};

const moveUp = (board: number[][]): number[][] => {
    const newBoard = transpose(board).map((row) => slideAndMerge(row));
    return transpose(newBoard);
};

const moveDown = (board: number[][]): number[][] => {
    const newBoard = transpose(board).map((row) => slideAndMerge(row.reverse()).reverse());
    return transpose(newBoard);
};

const moveLeft = (board: number[][]): number[][] => {
    return board.map((row) => slideAndMerge(row));
};

const moveRight = (board: number[][]): number[][] => {
    return board.map((row) => slideAndMerge(row.reverse()).reverse());
};

const slideAndMerge = (row: number[]): number[] => {
    const nonZeroTiles = row.filter((value) => value !== 0);
    const mergedRow: number[] = [];

    for (let i = 0; i < nonZeroTiles.length; i++) {
        if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
            mergedRow.push(nonZeroTiles[i] * 2);
            i++; // Skip the next tile since it was merged
        } else {
            mergedRow.push(nonZeroTiles[i]);
        }
    }

    while (mergedRow.length < row.length) {
        mergedRow.push(0);
    }

    return mergedRow;
};

const transpose = (board: number[][]): number[][] => {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
};

// Dynamically calculate tile colors based on their value
const getTileColor = (value: number): string => {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
    };

    // For values greater than 2048, use a gradient towards red
    if (value > 2048) {
        return `rgb(${255 - Math.min(value / 10, 200)}, 0, 0)`; // Gradually approach red
    }

    return colors[value] || '#cdc1b4'; // Default to empty tile color
};