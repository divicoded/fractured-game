import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { SCENES } from '../data/story';
import type { PlayerStats } from '../types';

interface GraphNode {
    id: string;
    sceneId: string;
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    type: 'start' | 'decision' | 'narrative' | 'end';
    label: string;
    impact?: Partial<PlayerStats>;
    phase: number; // Random phase for drifting animation
}

export const AnalysisGraph: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
    const { state } = useGame();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // 1. Build the Graph Data (Organic Layout)
    useEffect(() => {
        const history = state.history;
        const newNodes: GraphNode[] = [];
        const centerX = window.innerWidth / 2;
        const spacingY = 180; // Distance between nodes
        
        history.forEach((sceneId, index) => {
            const scene = SCENES[sceneId];
            if (!scene) return;

            // Determine impact from previous choice
            let impact: Partial<PlayerStats> | undefined;
            if (index > 0) {
                const prevScene = SCENES[history[index - 1]];
                const choice = prevScene?.choices.find(c => c.nextSceneId === sceneId);
                if (choice?.effects) impact = choice.effects;
            }

            // Organic Sway Calculation
            // Creates a "nerve" or "river" shape
            const sway = Math.sin(index * 0.5) * 60 + Math.cos(index * 0.2) * 40;
            const currentX = centerX + sway;
            const currentY = 150 + (index * spacingY);

            let type: GraphNode['type'] = 'narrative';
            if (index === 0) type = 'start';
            else if (index === history.length - 1) type = 'end';
            else if (scene.choices.length > 1) type = 'decision';

            newNodes.push({
                id: `node-${index}`,
                sceneId,
                x: currentX, // Visual X
                y: currentY, // Visual Y
                baseX: currentX,
                baseY: currentY,
                type,
                label: index === 0 ? "INIT_SEQ" : (impact ? "ALTERATION" : "MEM_FRAGMENT"),
                impact,
                phase: Math.random() * Math.PI * 2
            });
        });

        setNodes(newNodes);
    }, [state.history]);

    // 2. Animation Loop (Canvas Connections + Particles)
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || nodes.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const startTime = Date.now();

        const render = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const scrollTop = container.scrollTop;

            // Resize canvas to viewport
            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, width, height);

            const time = (Date.now() - startTime) / 1000;

            // Draw Connections
            ctx.lineCap = 'round';

            for (let i = 0; i < nodes.length - 1; i++) {
                const curr = nodes[i];
                const next = nodes[i+1];

                // Calculate visual positions relative to viewport (including scroll)
                // Apply slight drift based on time
                const currY = curr.baseY - scrollTop + Math.cos(time * 0.5 + curr.phase) * 5;
                const nextY = next.baseY - scrollTop + Math.cos(time * 0.5 + next.phase) * 5;
                
                const currX = curr.baseX + Math.sin(time * 0.5 + curr.phase) * 5;
                const nextX = next.baseX + Math.sin(time * 0.5 + next.phase) * 5;

                // Culling
                if (currY > height + 200 || nextY < -200) continue;

                // Style based on connection type (impact of next node)
                let color = '0, 243, 255'; // Cyan default
                if (next.impact?.corruption) color = '255, 51, 51'; // Red
                else if (next.impact?.sanity && next.impact.sanity < 0) color = '188, 19, 254'; // Purple
                else if (next.impact?.trust) color = '255, 170, 0'; // Amber

                // Draw multiple organic strands
                const strands = 3;
                for (let s = 0; s < strands; s++) {
                    const offset = (s - 1) * 3;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${color}, ${s === 1 ? 0.4 : 0.1})`;
                    ctx.lineWidth = s === 1 ? 2 : 1;

                    // Bezier Control Points for organic flow
                    const cp1x = currX + (Math.sin(time + i) * 30);
                    const cp1y = currY + (nextY - currY) * 0.5;
                    const cp2x = nextX + (Math.cos(time + i) * 30);
                    const cp2y = currY + (nextY - currY) * 0.5;

                    ctx.moveTo(currX + offset, currY);
                    ctx.bezierCurveTo(cp1x + offset, cp1y, cp2x + offset, cp2y, nextX + offset, nextY);
                    ctx.stroke();
                }

                // Draw Signal Particles
                const particleT = (time * 0.5 + i * 0.2) % 1;
                // Simple linear interpolation for particle (good enough for visuals)
                // ideally would follow bezier, but lerp is faster
                const pX = currX + (nextX - currX) * particleT + Math.sin(time * 2 + i)*5;
                const pY = currY + (nextY - currY) * particleT;
                
                ctx.beginPath();
                ctx.fillStyle = `rgba(${color}, 0.8)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgb(${color})`;
                ctx.arc(pX, pY, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, [nodes]);

    return (
        <div className="fixed inset-0 bg-dark-bg z-[60] font-sans text-white overflow-hidden">
             {/* Background Atmosphere */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-90" />
             <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHY0MHptMjAtMjBoMnYyaC0ydjJoiDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYySDB2LTIwaDIwek0wIDIwaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYySDBWMGgyMHoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] animate-pan-grid" />

            {/* Canvas Layer */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

            {/* Header HUD */}
            <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-1">
                        NEURAL TOPOLOGY
                    </h2>
                    <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.2em] text-neon-cyan">
                        <span>SUBJ: 47-GRAY</span>
                        <span className="opacity-50">|</span>
                        <span>SEQ_DEPTH: {nodes.length}</span>
                    </div>
                </div>
                <button 
                    onClick={onRestart}
                    className="pointer-events-auto px-6 py-2 border border-white/20 bg-black/50 hover:bg-neon-red/10 hover:border-neon-red hover:text-neon-red transition-all duration-300 group"
                >
                    <span className="font-mono text-xs tracking-widest">SYSTEM_RESET</span>
                </button>
            </div>

            {/* Scroll Container */}
            <div 
                ref={containerRef}
                className="relative w-full h-full overflow-y-auto overflow-x-hidden z-10 scroll-smooth pt-[20vh] pb-[20vh]"
            >
                {/* Content Height Spacer */}
                <div style={{ height: nodes.length * 180 + 400 }} className="absolute top-0 left-0 w-full pointer-events-none" />

                {/* Interactive Nodes */}
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                        style={{ 
                            left: node.baseX, 
                            top: node.baseY,
                            animation: `float ${3 + Math.random()}s ease-in-out infinite alternate` 
                        }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                         {/* Styles based on Node Type/Impact */}
                         {/* Using a key to force re-render if needed, but CSS is fine */}
                        <div className={`
                            relative transition-all duration-500 group
                            ${node.type === 'start' ? 'scale-125' : ''}
                            ${hoveredNode === node.id ? 'scale-110 z-50' : 'scale-100'}
                        `}>
                            
                            {/* Glow Ring */}
                            <div className={`
                                absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-300
                                ${node.impact?.corruption ? 'bg-neon-red' : 
                                  node.impact?.sanity && node.impact.sanity < 0 ? 'bg-neon-purple' : 'bg-neon-cyan'}
                            `} />

                            {/* Node Core */}
                            <div className={`
                                relative w-4 h-4 rounded-full border-2 bg-black z-10 flex items-center justify-center
                                ${node.type === 'decision' ? 'w-8 h-8 border-[3px]' : ''}
                                ${node.impact?.corruption ? 'border-neon-red' : 
                                  node.impact?.sanity && node.impact.sanity < 0 ? 'border-neon-purple' : 'border-neon-cyan'}
                            `}>
                                {node.type === 'decision' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                            </div>

                            {/* Tooltip Card (Right Side) */}
                            <div className={`
                                absolute left-full ml-6 top-1/2 -translate-y-1/2 w-64
                                bg-black/90 border-l-2 backdrop-blur-xl p-4 rounded-r-sm
                                transition-all duration-300 origin-left
                                ${hoveredNode === node.id ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-4 pointer-events-none'}
                                ${node.impact?.corruption ? 'border-neon-red' : 'border-neon-cyan'}
                            `}>
                                <div className="text-[9px] font-mono text-gray-500 mb-1 tracking-widest uppercase">
                                    {node.type === 'start' ? 'GENESIS' : 'MEMORY_NODE'} // {node.sceneId.split('_')[0]}
                                </div>
                                <div className="text-white font-sans font-bold text-sm leading-tight mb-2">
                                    {SCENES[node.sceneId]?.speaker === 'UNKNOWN' ? 'NARRATIVE EVENT' : `${SCENES[node.sceneId]?.speaker} INTERACTION`}
                                </div>
                                
                                {node.impact && (
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                        {node.impact.sanity !== undefined && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${node.impact.sanity < 0 ? 'bg-neon-purple/20 text-neon-purple' : 'bg-green-500/20 text-green-400'}`}>
                                                SANITY {node.impact.sanity > 0 ? '+' : ''}{node.impact.sanity}
                                            </span>
                                        )}
                                        {node.impact.corruption !== undefined && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-neon-red/20 text-neon-red">
                                                CORR +{node.impact.corruption}
                                            </span>
                                        )}
                                        {node.impact.truth !== undefined && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-neon-cyan/20 text-neon-cyan">
                                                TRUTH +{node.impact.truth}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes float {
                    0% { transform: translate(-50%, -50%) translateY(0px); }
                    100% { transform: translate(-50%, -50%) translateY(-10px); }
                }
            `}</style>
        </div>
    );
};
