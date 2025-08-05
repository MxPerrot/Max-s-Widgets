import React from 'react';
import { SnakeWidget } from './widgets/SnakeGame';
import { Game2048 } from './widgets/Game2048';
import { TetrisWidget } from './widgets/TetrisWidget';

export const WidgetGallery = () => {
    return (
        <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Max's Widgets</h1>

            <div
                style={{
                    display: 'flex',
                    gap: '2rem', // Space between widgets
                    justifyContent: 'center', // Center widgets horizontally
                    alignItems: 'flex-start', // Align widgets at the top
                    flexWrap: 'wrap', // Wrap widgets if the screen is too small
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2>Snake Widget</h2>
                    <SnakeWidget />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h2>2048 Game</h2>
                    <Game2048 />
                </div>
                {/* <div style={{ textAlign: 'center' }}>
                    <h2>Tetris Widget</h2>
                    <TetrisWidget />
                </div> */}
            </div>
        </main>
    );
};