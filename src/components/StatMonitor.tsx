import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { formatSystemTime, corruptText } from '../services/textUtils';
import { calculateGlitchIntensity } from '../services/glitchLogic';

export const StatMonitor: React.FC = () => {
  const { state, currentScene } = useGame();
  const [time, setTime] = useState(formatSystemTime());
  const [sysVersion, setSysVersion] = useState("v4.02.1");
  const [isGlitching, setIsGlitching] = useState(false);

  const intensity = calculateGlitchIntensity(state.stats, currentScene.glitchIntensity);
  const isCritical = state.stats.sanity < 20;

  useEffect(() => {
    const t = setInterval(() => {
        setTime(formatSystemTime());
        
        // Random System Version Glitches
        if (state.stats.corruption > 30 && Math.random() < 0.1) {
            const versions = ["v4.02.1", "v6.6.6", "NULL", "ERROR", "RUN", "HELP", "47-GRAY"];
            setSysVersion(versions[Math.floor(Math.random() * versions.length)]);
        } else {
             setSysVersion("v4.02.1");
        }

        // Random HUD Shake
        if (intensity > 0.4 && Math.random() < 0.05) {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);
        }

    }, 1000);
    return () => clearInterval(t);
  }, [state.stats.corruption, intensity]);

  const getChapterTitle = () => {
      const id = state.currentSceneId;
      if (id.includes('prologue')) return "PROLOGUE // AWAKENING";
      if (id.includes('dive')) return "INTERLUDE // DEEP_DIVE";
      if (id.includes('ending')) return "TERMINAL // SEQUENCE";
      return "CHAPTER 1 // GHOST_CODE";
  };

  const StatRow = ({ label, value, color, warningThreshold = 0 }: { label: string, value: number, color: string, warningThreshold?: number }) => {
    const isWarning = warningThreshold > 0 && value < warningThreshold;
    const [displayLabel, setDisplayLabel] = useState(label);

    // Meta-horror: Labels change when sanity is low
    useEffect(() => {
        if (state.stats.sanity < 30) {
            const interval = setInterval(() => {
                if (Math.random() < 0.1) {
                    const variants: Record<string, string[]> = {
                        "Truth": ["LIES", "PAIN", "VOID", "DATA"],
                        "Sanity": ["AGONY", "GONE", "FEAR", "BREAK"],
                        "Corruption": ["ROT", "US", "THEM", "FEED"],
                        "Trust": ["BETRAY", "ALONE", "NULL", "FAKE"]
                    };
                    const options = variants[label] || [];
                    setDisplayLabel(options[Math.floor(Math.random() * options.length)] || label);
                } else {
                    setDisplayLabel(label);
                }
            }, 500);
            return () => clearInterval(interval);
        } else {
            setDisplayLabel(label);
        }
    }, [state.stats.sanity, label]);

    const barColor = isWarning ? 'bg-neon-red shadow-[0_0_10px_#ff3333]' : `bg-${color} shadow-[0_0_8px_currentColor]`;
    const textColor = isWarning ? 'text-neon-red animate-pulse' : `text-${color}`;
    
    return (
        <div className="flex items-center gap-4 group/row cursor-default">
            {/* Label with micro-interaction tilt/shift */}
            <div className={`
                w-24 font-mono text-[10px] tracking-widest uppercase text-right opacity-60 
                transition-all duration-300 ease-out
                group-hover/row:opacity-100 group-hover/row:translate-x-1 group-hover/row:text-white
                ${textColor}
                ${isWarning ? 'animate-glitch-1' : ''}
            `}>
                <span key={displayLabel} className={displayLabel !== label ? "animate-text-distort inline-block text-neon-red font-bold" : "inline-block"}>
                    {displayLabel}
                </span>
            </div>
            
            {/* Bar Container */}
            <div className="flex-grow h-2 bg-white/5 relative skew-x-[-10deg] overflow-hidden border border-white/5 group-hover/row:border-white/20 transition-colors duration-300">
                {/* Background Grid in Bar */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,#000_2px)] bg-[size:4px_100%] opacity-30" />
                
                {/* Fill with Pulse Effect */}
                <div 
                    className={`h-full ${barColor} transition-all duration-700 ease-out relative group-hover/row:brightness-125`}
                    style={{ width: `${value}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white opacity-50" />
                    {/* Animated shine effect on bar hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/row:animate-[shimmer_1s_infinite]" />
                    
                    {/* Corruption Leak Effect */}
                    {label === "Corruption" && value > 50 && (
                         <div className="absolute right-0 top-0 h-full w-4 bg-neon-purple blur-md opacity-50 animate-pulse" />
                    )}
                </div>
            </div>
            
            <div className={`w-8 font-mono text-xs font-bold text-right transition-all duration-300 group-hover/row:scale-110 ${textColor}`}>
                {Math.round(value)}
            </div>
        </div>
    );
  };

  return (
    <div className={`w-full max-w-5xl mx-auto mb-8 relative group perspective-1000 ${isGlitching ? 'translate-x-1 skew-x-1' : ''}`}>
        
        {/* Holographic Container with Tilt Effect on Hover */}
        <div className={`
            relative bg-dark-bg/80 backdrop-blur-xl border-y border-white/10 md:border md:rounded-sm overflow-hidden 
            transition-all duration-500 hover:border-neon-cyan/30 hover:shadow-[0_0_30px_rgba(0,243,255,0.1)] 
            hover:scale-[1.01] hover:rotate-x-2 transform-gpu
            ${isCritical ? 'border-neon-red/20 animate-pulse' : ''}
        `}>
            
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,243,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.3)_1px,transparent_1px)] bg-[size:40px_40px] animate-pan-grid pointer-events-none" />
            
            {/* Noise Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            
            {/* Scanline Animation */}
            <div className={`absolute inset-0 w-full h-[2px] ${isCritical ? 'bg-neon-red/30' : 'bg-neon-cyan/20'} animate-scan-vertical pointer-events-none z-0 mix-blend-screen`} />

            {/* Corner Markers with Glow on Hover */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity duration-300 group-hover:drop-shadow-[0_0_5px_#00f3ff]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity duration-300 group-hover:drop-shadow-[0_0_5px_#00f3ff]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity duration-300 group-hover:drop-shadow-[0_0_5px_#00f3ff]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity duration-300 group-hover:drop-shadow-[0_0_5px_#00f3ff]" />

            {/* Content Layout */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch p-4 md:p-6 gap-6 md:gap-12">
                
                {/* Left Module: Identification & Narrative Context */}
                <div className="flex-grow flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                             <div className={`w-1.5 h-6 ${isCritical ? 'bg-neon-red shadow-[0_0_8px_#ff0000]' : 'bg-neon-cyan shadow-[0_0_8px_#00f3ff]'} animate-pulse`} />
                             <h1 className="text-3xl md:text-5xl font-sans font-black tracking-[0.1em] text-white uppercase drop-shadow-md">
                                {isCritical ? corruptText("FRACTURED", 0.5) : "FRACTURED"}
                             </h1>
                        </div>
                        <div className="text-neon-cyan/60 font-mono text-xs tracking-[0.2em] pl-4 border-l border-white/10 ml-0.5 group-hover:text-neon-cyan transition-colors duration-300">
                            {getChapterTitle()}
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                        <div className="flex flex-col group/item">
                            <span className="text-white/30 group-hover/item:text-neon-cyan transition-colors">Subject</span>
                            <span className="text-neon-cyan group-hover/item:text-white transition-colors">47-GRAY</span>
                        </div>
                        <div className="flex flex-col group/item">
                            <span className="text-white/30 group-hover/item:text-neon-cyan transition-colors">System</span>
                            <span className={`group-hover/item:text-white transition-colors ${sysVersion === 'ERROR' ? 'text-neon-red' : ''}`}>{sysVersion}</span>
                        </div>
                         <div className="flex flex-col group/item">
                            <span className="text-white/30 group-hover/item:text-neon-cyan transition-colors">Local Time</span>
                            <span className="text-white">{time.replace(/[\[\]]/g, '')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Module: Tactical Biometrics */}
                <div className="w-full md:w-[320px] flex flex-col justify-center gap-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
                         <span className="text-[10px] font-mono text-white/40 tracking-[0.3em]">BIOMETRICS</span>
                         <span className={`text-[10px] font-mono tracking-wider ${state.stats.sanity < 40 ? 'text-neon-red animate-pulse' : 'text-green-500'}`}>
                            {state.stats.sanity < 40 ? 'CRITICAL' : 'STABLE'}
                         </span>
                    </div>

                    <StatRow label="Truth" value={Math.min(100, state.stats.truth * 10)} color="neon-cyan" />
                    <StatRow label="Sanity" value={state.stats.sanity} color="neon-cyan" warningThreshold={40} />
                    <StatRow label="Corruption" value={state.stats.corruption} color="neon-purple" />
                    <StatRow label="Trust" value={Math.max(0, 50 + state.stats.trust)} color="neon-amber" />
                </div>
            </div>
        </div>
    </div>
  );
};