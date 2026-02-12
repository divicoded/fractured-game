import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export const GlitchOverlay: React.FC = () => {
    const { state, currentScene } = useGame();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const baseIntensity = currentScene.glitchIntensity || 0;
    // Cap intensity heavily
    const totalIntensity = Math.min(0.4, baseIntensity * 0.5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // Lower frame rate for effect
            if (Math.random() > 0.2) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (totalIntensity > 0.1) {
                // Very subtle noise lines
                if (Math.random() < totalIntensity * 0.1) {
                    ctx.fillStyle = `rgba(${Math.random() * 50 + 200}, 255, 255, ${0.03})`;
                    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, canvas.width, 1);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [totalIntensity, state.stats.sanity]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-overlay opacity-30"
        />
    );
};