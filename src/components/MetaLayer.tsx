import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { calculateGlitchIntensity, getRandomSystemLog } from '../services/glitchLogic';

interface SystemLog {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
    driftX: number;
    driftY: number;
}

export const MetaLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, currentScene } = useGame();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<SystemLog[]>([]);
    
    const intensity = calculateGlitchIntensity(state.stats, currentScene.glitchIntensity);
    const corruption = state.stats.corruption;
    const sanity = state.stats.sanity;

    // Canvas Rendering Loop (Dynamic Grid & Tearing)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const render = () => {
            time += 0.02 + (intensity * 0.1);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // 1. Base Scanlines (Subtle)
            if (intensity > 0.1) {
                ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
                for (let i = 0; i < h; i += 4) {
                    ctx.fillRect(0, i, w, 1);
                }
            }

            // 2. Dynamic Grid Distortion
            // Color shifts from Cyan (Tech) to Red (Corruption)
            const r = Math.min(255, corruption * 4);
            const g = Math.max(0, 243 - corruption * 2);
            const b = Math.max(0, 255 - corruption * 2);
            
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.03 + (intensity * 0.08)})`;
            ctx.lineWidth = 1;
            
            const gridSize = 50;
            // Warp factor increases with intensity
            const warpFactor = intensity * 20;

            // Draw Vertical Lines
            for (let x = 0; x <= w; x += gridSize) {
                ctx.beginPath();
                // Random jitter on X position if intensity high
                const jitter = (intensity > 0.6 && Math.random() < 0.1) ? (Math.random() - 0.5) * 10 : 0;
                
                for (let y = 0; y <= h; y += 20) {
                    const wave = Math.sin(time * 2 + y * 0.02) * warpFactor;
                    ctx.lineTo(x + wave + jitter, y);
                }
                ctx.stroke();
            }

            // 3. Glitch Slices / Tearing (Visual Artifacts)
            if (intensity > 0.3) {
                const sliceProbability = intensity * 0.1;
                if (Math.random() < sliceProbability) {
                    const sliceH = Math.random() * 50 + 10;
                    const sliceY = Math.random() * h;
                    const offsetX = (Math.random() - 0.5) * 40;
                    
                    // Draw a "tear"
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
                    ctx.fillRect(0, sliceY, w, sliceH);
                    
                    // Simulate RGB Shift in the tear
                    if (intensity > 0.7) {
                        ctx.fillStyle = `rgba(255, 0, 0, 0.2)`;
                        ctx.fillRect(offsetX, sliceY, w, 2);
                        ctx.fillStyle = `rgba(0, 255, 255, 0.2)`;
                        ctx.fillRect(-offsetX, sliceY + sliceH - 2, w, 2);
                    }
                }
            }

            // 4. Noise patches (High corruption)
            if (corruption > 60 && Math.random() < 0.05) {
                 const x = Math.random() * w;
                 const y = Math.random() * h;
                 const size = Math.random() * 100;
                 ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
                 ctx.fillRect(x, y, size, size);
            }

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, [intensity, corruption]);

    // DOM Log Injection Logic
    useEffect(() => {
        // Frequency scales with intensity: Low intensity = rare logs, High = spam
        const intervalTime = Math.max(200, 4000 - (intensity * 3500));
        
        const interval = setInterval(() => {
            if (intensity > 0.2 && Math.random() < 0.4) {
                const isError = Math.random() < 0.3;
                const isCorruption = corruption > 50 && Math.random() < 0.5;
                
                let color = 'text-neon-cyan';
                if (isError) color = 'text-neon-red';
                else if (isCorruption) color = 'text-neon-purple';
                else if (sanity < 30) color = 'text-gray-400';

                const newLog: SystemLog = {
                    id: Date.now() + Math.random(),
                    text: getRandomSystemLog(),
                    x: Math.random() * (window.innerWidth - 250),
                    y: Math.random() * (window.innerHeight - 100),
                    color: color,
                    driftX: (Math.random() - 0.5) * 2,
                    driftY: (Math.random() - 0.5) * 2
                };
                
                setLogs(prev => [...prev.slice(-4), newLog]); // Keep last 5
                
                // Remove log after duration (shorter duration for higher intensity to create "flash" feel)
                setTimeout(() => {
                    setLogs(prev => prev.filter(l => l.id !== newLog.id));
                }, 2000 + Math.random() * 1500);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [intensity, corruption, sanity]);

    // Update Log Drift Positions
    useEffect(() => {
        let animationId: number;
        const drift = () => {
            setLogs(prevLogs => prevLogs.map(log => ({
                ...log,
                x: log.x + log.driftX * 0.5,
                y: log.y + log.driftY * 0.5
            })));
            animationId = requestAnimationFrame(drift);
        };
        drift();
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Global Container Filters (Chromatic Aberration)
    useEffect(() => {
        if (containerRef.current) {
            // Apply SVG filter defined in index.html if intensity is high
            // This blurs/shifts the entire game UI
            if (intensity > 0.6 && Math.random() < 0.1) {
                containerRef.current.style.filter = `url(#chromatic-aberration) contrast(1.2)`;
                containerRef.current.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;
            } else if (intensity > 0.8 && Math.random() < 0.05) {
                 containerRef.current.style.filter = `invert(1)`; // Flash invert
            } else {
                containerRef.current.style.filter = 'none';
                containerRef.current.style.transform = 'none';
            }
        }
    }, [intensity, Date.now()]); // Trigger often via render loop implied by parent, but using effect here dependent on intensity is safer

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden bg-black selection:bg-neon-cyan selection:text-black">
            {/* Main App Content Container */}
            <div ref={containerRef} className="relative w-full min-h-screen transition-all duration-100 ease-linear z-10 will-change-transform">
                {children}
            </div>

            {/* Canvas Overlay (Grid/Artifacts) */}
            <canvas 
                ref={canvasRef}
                className="pointer-events-none fixed inset-0 z-0 mix-blend-screen opacity-60"
            />

            {/* Floating System Logs Layer */}
            <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
                {logs.map(log => (
                    <div 
                        key={log.id}
                        className={`
                            absolute font-mono text-xs px-2 py-1 
                            bg-black/80 backdrop-blur-sm border-l-2 border-current shadow-lg
                            ${log.color}
                            animate-fade-in
                        `}
                        style={{ 
                            left: log.x, 
                            top: log.y,
                            maxWidth: '300px'
                        }}
                    >
                        <span className="opacity-50 mr-2 text-[10px] uppercase tracking-wider">{`// SYSTEM_MSG_${Math.floor(Math.random()*999)}`}</span>
                        <div className="leading-tight">{log.text}</div>
                    </div>
                ))}
            </div>
            
            {/* Static Vignette */}
            <div 
                className="pointer-events-none fixed inset-0 z-20"
                style={{ 
                    background: `radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 120%)`,
                }} 
            />
        </div>
    );
};