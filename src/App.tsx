import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { MetaLayer } from './components/MetaLayer';
import { StatMonitor } from './components/StatMonitor';
import { Typewriter } from './components/Typewriter';
import { GlitchButton } from './components/GlitchButton';
import { AnalysisGraph } from './components/AnalysisGraph';
import { SPEAKER_COLORS, SPEAKER_NAMES } from './constants';
import { SCENES } from './data/story';
import type { Choice } from './types';

// --- DYNAMIC BACKGROUND COMPONENT ---
const DynamicBackground: React.FC = () => {
    const { state } = useGame();
    const { sanity, corruption } = state.stats;

    // Calculate dynamic styles
    const saturation = Math.max(0, sanity); // 0 to 100
    const darkness = Math.max(0, (100 - sanity) * 0.8); // 0 to 80% opacity black overlay
    const corruptionPulse = corruption > 30 ? 'animate-pulse-slow' : '';
    const corruptionOpacity = Math.min(0.6, corruption / 150);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out">
            {/* Base Fog/Atmosphere */}
            <div className="absolute inset-0 bg-dark-bg" />
            
            {/* Sanity Effect: Desaturation & Vignette */}
            {/* We apply a backdrop filter to the whole scene effectively by overlaying this div */}
            <div 
                className="absolute inset-0 transition-all duration-1000"
                style={{ 
                    backdropFilter: `grayscale(${100 - saturation}%) contrast(${100 + (100 - saturation) * 0.5}%)`,
                    backgroundColor: `rgba(0,0,0,${darkness / 100})`
                }}
            />

            {/* Corruption Effect: Red/Purple Bleed */}
            <div 
                className={`absolute inset-0 bg-gradient-to-t from-neon-purple/20 via-transparent to-neon-red/10 mix-blend-overlay ${corruptionPulse}`}
                style={{ opacity: corruptionOpacity }}
            />
            
            {/* Low Sanity Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-0 transition-opacity duration-1000 mix-blend-multiply"
                style={{ 
                    opacity: sanity < 30 ? 0.4 : 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-2v4h2v4h2v-4h2v-4h-2zM36 34V30h4v4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            {/* High Corruption Glitch Overlay */}
            {corruption > 60 && (
                <div className="absolute inset-0 bg-noise opacity-10 animate-glitch-2 mix-blend-color-dodge" />
            )}
        </div>
    );
};

// --- LOADING SCREEN COMPONENT ---
const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState("INITIALIZING KERNEL...");

    const logs = [
        "LOADING NEURAL MAPS...",
        "VERIFYING SUBJECT IDENTITY...",
        "CHECKING INTEGRITY...",
        "FRAGMENTATION DETECTED...",
        "BYPASSING SECURITY...",
        "ESTABLISHING LINK..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return Math.min(100, p + Math.random() * 15);
            });
            
            if (Math.random() > 0.6) {
                setLog(logs[Math.floor(Math.random() * logs.length)]);
            }
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono text-neon-cyan p-8">
            <div className="w-full max-w-md mb-8">
                <div className="flex justify-between mb-2 text-xs tracking-widest opacity-70">
                    <span>SYS_BOOT_SEQ_47</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
                <div className="w-full h-1 bg-gray-900 overflow-hidden relative">
                    <div 
                        className="h-full bg-neon-cyan shadow-[0_0_15px_#00f3ff] transition-all duration-100 ease-linear relative z-10"
                        style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)] z-20 opacity-30" />
                </div>
            </div>
            <div className="h-6 text-sm tracking-wider text-center animate-pulse">
                {log}
            </div>
        </div>
    );
};

// --- START SCREEN COMPONENT ---
const StartScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,rgba(0,0,0,0.9)_70%)]" />
            <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] opacity-20" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-12 animate-fade-in-up">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        FRACTURED
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-neon-cyan/60 font-mono tracking-[0.5em] text-sm md:text-base">
                        <span>GHOST</span>
                        <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
                        <span>IN</span>
                        <span className="w-1 h-1 bg-current rounded-full animate-pulse delay-75" />
                        <span>THE</span>
                        <span className="w-1 h-1 bg-current rounded-full animate-pulse delay-150" />
                        <span>MACHINE</span>
                    </div>
                </div>

                <button 
                    onClick={onStart}
                    className="group relative px-12 py-4 bg-transparent border border-white/20 hover:border-neon-cyan/80 transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                    <span className="relative z-10 font-mono text-white tracking-widest group-hover:text-neon-cyan transition-colors duration-300">
                        INITIALIZE_EXPERIENCE
                    </span>
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-0 group-hover:opacity-100 transition-all duration-300 text-neon-cyan" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-0 group-hover:opacity-100 transition-all duration-300 text-neon-cyan" />
                </button>
            </div>
            
            <div className="absolute bottom-8 text-white/20 font-mono text-xs tracking-widest">
                AUDIO RECOMMENDED // IMMERSIVE MODE
            </div>
        </div>
    );
};

// --- MAIN GAME INTERFACE ---
const GameInterface: React.FC<{ onViewAnalysis: () => void }> = ({ onViewAnalysis }) => {
  const { state, currentScene, dispatch } = useGame();
  const [typingComplete, setTypingComplete] = useState(false);
  const [transitionEffect, setTransitionEffect] = useState<'CORRUPTION' | 'SANITY' | 'TRUTH' | 'CRT_SWEEP' | 'INVERT' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [footerText, setFooterText] = useState("Made by div.. experiment Tya Shi... hehe");
  const [horrorFlash, setHorrorFlash] = useState(false);

  // Red Alert State for Critical Sanity
  const isCriticalSanity = state.stats.sanity < 20;
  const isHighCorruption = state.stats.corruption > 60;

  // Random Horror Flash Trigger for High Stress
  useEffect(() => {
    if (isCriticalSanity || isHighCorruption) {
        const interval = setInterval(() => {
            if (Math.random() < 0.15) { // 15% chance every 2.5s
                setHorrorFlash(true);
                setTimeout(() => setHorrorFlash(false), 200 + Math.random() * 200);
            }
        }, 2500);
        return () => clearInterval(interval);
    }
  }, [isCriticalSanity, isHighCorruption]);

  // Meta-horror: Footer manipulation
  useEffect(() => {
    if (isHighCorruption) {
        setFooterText("Made by THE COLLECTIVE");
    } else if (isCriticalSanity) {
        setFooterText("Made by NO ONE");
    } else {
        setFooterText("Made by div.. experiment Tya Shi... hehe");
    }
  }, [isHighCorruption, isCriticalSanity]);

  // Reset typing state when scene changes
  React.useEffect(() => {
    setTypingComplete(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentSceneId]);

  const handleChoice = (choice: Choice) => {
    // Check if this is the restart choice from epilogue
    if (choice.id === 'restart') {
         dispatch({ type: 'RESET' });
         // Reset will be handled by context
         return;
    }

    let delay = 0;
    const nextScene = SCENES[choice.nextSceneId];

    if (choice.effects) {
        const dSanity = choice.effects.sanity || 0;
        const dCorruption = choice.effects.corruption || 0;
        const dTruth = choice.effects.truth || 0;

        // --- THRESHOLD LOGIC & SHAKE ---
        // Trigger shake if Sanity drops by more than 15 OR Corruption rises by more than 10
        if (dSanity < -15 || dCorruption > 10) {
            setIsShaking(true);
            // Longer shake for bigger impacts
            setTimeout(() => setIsShaking(false), 600);
        }

        if (dCorruption > 15) {
            setTransitionEffect('INVERT');
            delay = 600;
        } else if (dCorruption > 0) {
            setTransitionEffect('CORRUPTION');
            delay = 800;
        } else if (dSanity < 0) {
            setTransitionEffect('SANITY');
            delay = 800;
        } else if (dTruth > 0) {
            setTransitionEffect('TRUTH');
            delay = 600;
        } else if (Object.keys(choice.effects).length > 0) {
            delay = 400;
        }
    }

    if (nextScene && (nextScene.glitchIntensity || 0) > (currentScene.glitchIntensity || 0) + 0.3) {
        setTransitionEffect('CRT_SWEEP');
        delay = Math.max(delay, 800);
    }

    if (choice.metaEffect) {
        delay = 600;
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
    }

    setTimeout(() => {
        if (choice.effects) dispatch({ type: 'UPDATE_STATS', stats: choice.effects });
        if (choice.metaEffect) {
            if (choice.metaEffect === 'SEE_DOOR') dispatch({ type: 'UPDATE_META', key: 'hasSeenDoor', value: true });
        }
        dispatch({ type: 'TRANSITION', sceneId: choice.nextSceneId });
        setTransitionEffect(null);
    }, delay);
  };

  const getSpeakerStyle = (speaker: string) => {
    return SPEAKER_COLORS[speaker as keyof typeof SPEAKER_COLORS] || 'text-gray-400';
  };

  const bgStyle = currentScene.bgImage ? {
    backgroundImage: `url(${currentScene.bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  const availableChoices = currentScene.choices.filter(choice => {
    if (choice.hidden && !state.flags[choice.id]) return false;
    if (!choice.requiredStats) return true;
    return choice.requiredStats.every(req => {
        const currentVal = state.stats[req.stat];
        if (req.condition === 'gt') return currentVal > req.value;
        if (req.condition === 'lt') return currentVal < req.value;
        return currentVal === req.value;
    });
  });

  const isEpilogue = state.currentSceneId === 'epilogue';

  // Dynamic Header Styles based on stats
  const headerFx = (state.stats.sanity < 40 || state.stats.corruption > 50) 
        ? "transition-all duration-700 blur-[1px] contrast-125 saturate-50 hue-rotate-15" 
        : "transition-all duration-700";

  return (
    <MetaLayer>
        <div className={`relative w-full min-h-screen bg-transparent text-white flex flex-col font-sans overflow-x-hidden ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Dynamic Background Layer */}
        <DynamicBackground />

        {/* Horror Flash Overlay (Localized Red Glitch / Screen Horror) */}
        {horrorFlash && (
            <div className="fixed inset-0 z-[100] bg-red-900/40 mix-blend-color-dodge pointer-events-none">
               <div className="absolute inset-0 bg-noise animate-glitch-1 opacity-60"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-black opacity-30 animate-shake whitespace-nowrap">
                   {["ERROR", "RUN", "HELP", "NO", "0xDEAD"][Math.floor(Math.random()*5)]}
               </div>
               <div className="absolute inset-0 border-[20px] border-neon-red/50 animate-pulse"></div>
           </div>
        )}

        {/* Critical Sanity Red Alert Overlay */}
        {isCriticalSanity && (
            <div className="fixed inset-0 z-0 pointer-events-none animate-pulse-slow">
                <div className="absolute inset-0 bg-red-900/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,0,0,0.15)_100%)]" />
                <div className="absolute top-0 w-full h-1 bg-neon-red animate-glitch-1" />
                <div className="absolute bottom-0 w-full h-1 bg-neon-red animate-glitch-2" />
            </div>
        )}

        {/* Fullscreen Transition Effects Overlay */}
        {transitionEffect === 'CORRUPTION' && (
            <div className="fixed inset-0 z-[100] bg-neon-red/20 mix-blend-overlay animate-pulse pointer-events-none">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neon-red font-mono text-4xl font-bold tracking-widest animate-glitch-1">
                    SYSTEM_CORRUPTION_DETECTED
                </div>
            </div>
        )}
        {transitionEffect === 'INVERT' && (
            <div className="fixed inset-0 z-[100] bg-white animate-invert-flash mix-blend-difference pointer-events-none" />
        )}
        {transitionEffect === 'CRT_SWEEP' && (
            <div className="fixed inset-0 z-[100] pointer-events-none">
                <div className="w-full h-[20vh] bg-white/10 blur-xl absolute top-0 animate-crt-sweep mix-blend-overlay" />
                <div className="absolute inset-0 bg-noise opacity-20 animate-pulse" />
            </div>
        )}
        {transitionEffect === 'SANITY' && (
            <div className="fixed inset-0 z-[100] backdrop-blur-sm backdrop-grayscale transition-all duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-neon-purple/10 mix-blend-color-dodge animate-pulse-slow" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 font-mono text-2xl tracking-[1em] blur-[1px]">
                    DISSOCIATING...
                </div>
            </div>
        )}
        {transitionEffect === 'TRUTH' && (
            <div className="fixed inset-0 z-[100] bg-white/40 mix-blend-overlay animate-[ping_0.5s_ease-out] pointer-events-none" />
        )}

        {/* Content Wrapper */}
        <div className="relative z-10 w-full min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-4 md:p-6 lg:p-8">
            
            {/* Top HUD Area */}
            <header className={`w-full shrink-0 relative z-30 pt-2 pb-4 ${headerFx}`}>
                 <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none" />
                 <StatMonitor />
            </header>

            {/* Narrative Area */}
            <main className="flex-grow flex flex-col relative w-full max-w-4xl mx-auto mb-8">
                
                {currentScene.speaker !== 'UNKNOWN' && (
                    <div className="w-full mb-1 flex justify-start animate-slide-in-left pl-2 md:pl-0 shrink-0">
                        <div className={`
                            inline-flex items-center px-4 md:px-6 py-1 md:py-1.5 
                            bg-black/80 backdrop-blur-xl border-l-[4px] border-current shadow-[0_4px_15px_rgba(0,0,0,0.5)]
                            ${getSpeakerStyle(currentScene.speaker)}
                        `}>
                            <span className="font-mono font-bold tracking-widest text-sm md:text-base uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                {SPEAKER_NAMES[currentScene.speaker as keyof typeof SPEAKER_NAMES] || currentScene.speaker}
                            </span>
                        </div>
                    </div>
                )}

                <div className={`w-full bg-gradient-to-b from-white/5 to-black/60 border-t border-b border-white/10 p-6 md:p-10 lg:p-12 relative group shadow-2xl backdrop-blur-sm ${currentScene.speaker === 'UNKNOWN' ? 'border-l-0' : ''}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10" />
                    
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neon-cyan/40" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neon-cyan/40" />
                    
                    <div className={`text-lg md:text-2xl lg:text-3xl font-light tracking-wide leading-relaxed drop-shadow-md`}>
                        <Typewriter 
                            key={currentScene.text}
                            text={currentScene.text} 
                            speaker={currentScene.speaker} 
                            onComplete={() => setTypingComplete(true)}
                        />
                    </div>
                </div>
            </main>

            {/* Choices Footer */}
            <footer className="w-full max-w-3xl mx-auto mt-auto pb-8 relative z-20 shrink-0">
                {(typingComplete || currentScene.autoTransition) && (
                    <div className="flex flex-col gap-4 animate-fade-in-up">
                        {availableChoices.map((choice) => (
                            <GlitchButton 
                                key={choice.id} 
                                choice={choice} 
                                onClick={handleChoice} 
                            />
                        ))}
                    </div>
                )}
                
                {/* Analysis Button on Epilogue */}
                {isEpilogue && typingComplete && (
                    <div className="mt-8 flex justify-center animate-fade-in">
                        <button
                            onClick={onViewAnalysis}
                            className="px-8 py-3 bg-neon-purple/20 border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-all duration-300 font-mono tracking-widest uppercase shadow-[0_0_15px_#bc13fe]"
                        >
                            VIEW NEURAL ANALYSIS
                        </button>
                    </div>
                )}
                
                {currentScene.autoTransition && (
                    <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_#00f3ff]" 
                            style={{ 
                                animation: `width ${currentScene.autoTransition.delay}ms linear forwards`,
                                width: '0%' 
                            }} 
                        />
                    </div>
                )}
            </footer>

            {/* Sentient Footer */}
            <div className={`
                w-full text-center py-6 font-mono text-[10px] tracking-widest uppercase transition-colors cursor-default
                ${isHighCorruption ? 'text-neon-purple animate-pulse' : 'text-white/10 hover:text-white/30'}
                ${isCriticalSanity ? 'animate-glitch-1' : ''}
            `}>
                {footerText}
            </div>
        </div>
        </div>
    </MetaLayer>
  );
};

// --- APP CONTENT MANAGER ---
const AppContent: React.FC = () => {
    const [view, setView] = useState<'loading' | 'start' | 'game' | 'analysis'>('loading');
    const { dispatch } = useGame();

    const handleRestart = () => {
        dispatch({ type: 'RESET' });
        setView('loading');
    };

    if (view === 'loading') {
        return <LoadingScreen onComplete={() => setView('start')} />;
    }

    if (view === 'start') {
        return <StartScreen onStart={() => setView('game')} />;
    }

    if (view === 'analysis') {
        return <AnalysisGraph onRestart={handleRestart} />;
    }

    return <GameInterface onViewAnalysis={() => setView('analysis')} />;
};

// --- ROOT APP COMPONENT ---
const App: React.FC = () => {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    );
};

export default App;