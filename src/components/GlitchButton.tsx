import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { calculateGlitchIntensity, corruptText, getRandomScaryWord } from '../services/glitchLogic';
import type { Choice } from '../types';

interface GlitchButtonProps {
    choice: Choice;
    onClick: (choice: Choice) => void;
}

export const GlitchButton: React.FC<GlitchButtonProps> = ({ choice, onClick }) => {
    const { state, currentScene } = useGame();
    const [displayText, setDisplayText] = useState(choice.text);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const intensity = calculateGlitchIntensity(state.stats, currentScene.glitchIntensity);
    const isCritical = state.stats.sanity < 20;

    // --- DETERMINE VISUAL THEME ---
    let themeColor = 'text-white border-white/20';
    let hoverBg = 'group-hover:bg-white/5';
    let icon = null;
    let borderColor = 'border-white/10';
    let shadowColor = '';
    
    // Analyze effects to determine button "flavor"
    const eff = choice.effects || {};
    const isSanityHit = eff.sanity && eff.sanity < 0;
    const isCorruptionGain = eff.corruption && eff.corruption > 0;
    const isTruthGain = eff.truth && eff.truth > 0;
    const isTrustGain = eff.trust && eff.trust > 0;

    if (choice.metaEffect) {
        // META / SYSTEM OVERRIDE
        themeColor = 'text-gray-200 border-white/40';
        borderColor = 'border-white';
        hoverBg = 'group-hover:bg-white/10';
        shadowColor = 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]';
        icon = (
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
        );
    } else if (isSanityHit) {
        // DANGEROUS / TRAUMA
        themeColor = 'text-neon-purple border-neon-purple/30';
        borderColor = 'border-neon-purple/50';
        hoverBg = 'group-hover:bg-neon-purple/10';
        shadowColor = 'group-hover:shadow-[0_0_15px_rgba(188,19,254,0.4)]';
        icon = <span className="text-neon-purple">⚡</span>;
    } else if (isCorruptionGain) {
        // CORRUPTION / RISK
        themeColor = 'text-neon-red border-neon-red/30';
        borderColor = 'border-neon-red/50';
        hoverBg = 'group-hover:bg-neon-red/10';
        shadowColor = 'group-hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]';
        icon = <span className="text-neon-red animate-pulse">☣</span>;
    } else if (isTruthGain) {
        // INVESTIGATIVE / TRUTH
        themeColor = 'text-neon-cyan border-neon-cyan/30';
        borderColor = 'border-neon-cyan/50';
        hoverBg = 'group-hover:bg-neon-cyan/10';
        shadowColor = 'group-hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]';
        icon = <span className="text-neon-cyan">👁</span>;
    } else if (isTrustGain) {
        // EMPATHY / TRUST
        themeColor = 'text-neon-amber border-neon-amber/30';
        borderColor = 'border-neon-amber/50';
        hoverBg = 'group-hover:bg-neon-amber/10';
        shadowColor = 'group-hover:shadow-[0_0_15px_rgba(255,170,0,0.4)]';
        icon = <span className="text-neon-amber">🤝</span>;
    }

    // --- DECRYPTING TEXT ANIMATION ---
    // When hovered, scramble text then resolve to original
    useEffect(() => {
        if (isHovered) {
            let iteration = 0;
            const originalText = choice.text;
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            intervalRef.current = window.setInterval(() => {
                setDisplayText(prev => 
                    originalText.split("")
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        return alphabet[Math.floor(Math.random() * alphabet.length)];
                    })
                    .join("")
                );
                
                if (iteration >= originalText.length) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
                
                iteration += 1; // Speed of decoding
            }, 20); // 20ms per char update
        } else {
            // Reset or maintain glitch state if high intensity
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (intensity > 0.3 && Math.random() < 0.3) {
                setDisplayText(corruptText(choice.text, intensity));
            } else {
                setDisplayText(choice.text);
            }
        }
        
        return () => {
             if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered, choice.text, intensity]);

    const handleClick = () => {
        setIsClicked(true);
        onClick(choice);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isClicked}
            className={`
                group relative w-full text-left overflow-hidden transition-all duration-300
                border-l-4 bg-black/40 backdrop-blur-md
                ${borderColor} ${shadowColor}
                ${isClicked ? 'opacity-50 cursor-wait' : 'hover:pl-6'}
                ${isCritical ? 'animate-shake' : ''}
                mb-3 last:mb-0
            `}
        >
            {/* Background Fill Animation */}
            <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out origin-left transform scale-x-0 group-hover:scale-x-100 ${hoverBg}`} />
            
            {/* Scanline Overlay on Button */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-50" />

            <div className="relative z-10 p-4 md:py-5 md:px-6 flex items-center justify-between">
                <div className="flex-grow pr-4">
                    {/* Header / Meta Label */}
                    <div className="flex items-center gap-2 mb-1 opacity-70">
                         <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${themeColor.split(' ')[0]}`}>
                            {choice.metaEffect ? 'SYSTEM_OVERRIDE' : 'PROTOCOL_OPTION'} 
                            {isSanityHit && ' // HAZARD'}
                            {isCorruptionGain && ' // UNSTABLE'}
                         </span>
                         {/* Dynamic Bar for stat impact visualization */}
                         {(isSanityHit || isCorruptionGain) && (
                             <div className="h-1 w-12 bg-gray-800 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full ${isSanityHit ? 'bg-neon-purple' : 'bg-neon-red'}`} 
                                    style={{ width: isSanityHit ? '70%' : '40%' }} // Arbitrary visual weight
                                 />
                             </div>
                         )}
                    </div>

                    {/* Main Text */}
                    <span className={`
                        block font-sans text-lg md:text-xl font-medium tracking-wide leading-tight transition-all
                        ${isHovered ? 'text-white translate-x-1' : 'text-gray-300'}
                        ${isClicked ? 'text-neon-cyan animate-pulse' : ''}
                    `}>
                        {displayText}
                    </span>
                    
                    {/* Stat Forecast (Only visible on hover or if meta-aware) */}
                    <div className={`
                        mt-2 text-[10px] font-mono flex flex-wrap gap-3 transition-all duration-300 overflow-hidden
                        ${isHovered ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'}
                    `}>
                        {eff.sanity && <span className={`${eff.sanity < 0 ? 'text-neon-purple' : 'text-green-400'}`}>SANITY {eff.sanity > 0 ? '+' : ''}{eff.sanity}</span>}
                        {eff.corruption && <span className="text-neon-red">CORRUPTION +{eff.corruption}</span>}
                        {eff.truth && <span className="text-neon-cyan">TRUTH +{eff.truth}</span>}
                        {eff.trust && <span className="text-neon-amber">TRUST +{eff.trust}</span>}
                    </div>
                </div>

                {/* Right Icon / Status */}
                <div className={`
                    flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-white/10 bg-black/50
                    transition-all duration-300 transform
                    ${isHovered ? 'rotate-90 scale-110 border-white/40' : 'rotate-0'}
                    ${isClicked ? 'bg-neon-cyan/20 border-neon-cyan' : ''}
                `}>
                    {isClicked ? (
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                    ) : (
                        icon || <span className="text-white/50 text-xs">➜</span>
                    )}
                </div>
            </div>

            {/* Corner Brackets */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-300 ${isHovered ? 'border-white' : 'border-white/20'}`} />
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-300 ${isHovered ? 'border-white' : 'border-white/20'}`} />
        </button>
    );
};