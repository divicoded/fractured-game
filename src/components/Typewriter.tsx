import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { SPEAKER_COLORS } from '../constants';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  speaker: string;
}

interface StyledChar {
  char: string;
  className: string;
  id: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 20, onComplete, speaker }) => {
  const [chars, setChars] = useState<StyledChar[]>([]);
  const { state } = useGame();
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete prop changes, but don't trigger re-renders or effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reset state for new text
    setChars([]);
    indexRef.current = 0;
    
    // Determine base speed
    const baseSpeed = speaker === 'SYSTEM' ? 10 : speed;
    
    // Check if narrative mode (UNKNOWN usually implies narrative description)
    const isNarrative = speaker === 'UNKNOWN';
    const baseClass = isNarrative 
      ? "inline-block transition-opacity duration-500" 
      : "inline-block transition-transform duration-100";

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        const char = text.charAt(indexRef.current);
        const sanity = state.stats.sanity;
        const corruption = state.stats.corruption;
        
        let className = baseClass;
        let displayChar = char;
        
        // --- Dynamic Stat-Based Styling ---
        
        // 1. Sanity Effects (Blur, Jitter, Opacity) - Only for non-system text
        if (speaker !== 'SYSTEM' && sanity < 50) {
            if (Math.random() < 0.05) className += " blur-[1px] opacity-70";
            if (sanity < 30 && Math.random() < 0.08) className += " translate-y-0.5 rotate-6"; 
            
            // New: Momentary Distortion (Higher chance as sanity drops)
            if (sanity < 40 && Math.random() < (40 - sanity) / 100) {
                className += " animate-text-distort";
            }
        }

        // 2. Corruption Effects (Color, Font, Char Swap)
        if (corruption > 15) {
             // Random colored characters
             if (Math.random() < (corruption / 500)) {
                 className += " text-neon-red font-mono font-bold drop-shadow-[0_0_4px_red]";
             }
             // Random glitch characters
             if (corruption > 40 && Math.random() < 0.02) {
                displayChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                className += " text-neon-purple animate-text-distort"; 
             }
        }
        
        // 3. Speaker Specific Overrides
        if (speaker === 'SYSTEM') {
            className += " font-mono text-neon-red";
        } else if (speaker === 'COLLECTIVE') {
            className += " font-bold text-neon-purple tracking-widest uppercase";
        } else if (speaker === 'HALLUCINATION') {
             className += " text-pink-500 blur-[0.5px] italic font-serif";
        } else if (isNarrative) {
             className += " font-serif italic text-slate-400";
        }

        setChars(prev => [...prev, { char: displayChar, className, id: indexRef.current }]);
        indexRef.current++;
      } else {
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, baseSpeed);

    return () => clearInterval(interval);
  }, [text, speed, speaker, state.stats.sanity, state.stats.corruption]);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed break-words min-h-[1.5em] relative z-10 ${SPEAKER_COLORS[speaker as keyof typeof SPEAKER_COLORS] || ''}`}>
        {chars.map((item) => (
            <span key={item.id} className={item.className}>{item.char}</span>
        ))}
    </div>
  );
};