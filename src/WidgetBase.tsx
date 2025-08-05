import React, { useRef, useEffect } from 'react';

interface WidgetBaseProps {
    children: React.ReactNode;
    onStart: () => void;
    onStop: () => void;
    isRunning: boolean;
    width?: number; // Optional width for the widget
    height?: number; // Optional height for the widget
}

export const WidgetBase: React.FC<WidgetBaseProps> = ({
    children,
    onStart,
    onStop,
    isRunning,
    width = 400, // Default width
    height = 400, // Default height
}) => {
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                onStop(); // Stop the widget if clicked outside
            }
        };

        if (isRunning) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isRunning, onStop]);

    return (
        <div
            ref={widgetRef}
            style={{
                position: 'relative',
                width: `${width}px`,
                height: `${height}px`,
                overflow: 'hidden',
                background: '#f0f0f0', // Optional background for visibility
            }}
        >
            {!isRunning && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <button
                        onClick={onStart}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        Play
                    </button>
                </div>
            )}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    filter: isRunning ? 'none' : 'blur(5px)',
                }}
            >
                {children}
            </div>
        </div>
    );
};