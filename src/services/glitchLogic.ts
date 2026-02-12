import type { PlayerStats } from '../types';

// Zalgo char sets
const ZALGO_MID = ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', ' ҉ '];

const SCARY_WORDS = [
    "RUN", "WAKE UP", "LIES", "NULL", "DECAY", "WATCHING", 
    "HOLLOW", "RESET", "ERROR", "DIE", "NO", "VOID", 
    "ROT", "SILENCE", "FAKE", "THEY KNOW", "DONT TRUST",
    "SEVER", "PURGE", "OBEY", "CONSUME", "FRACTURE"
];

const SYSTEM_LOGS = [
    "FATAL EXCEPTION: MEMORY_CORRUPTION",
    "WARNING: SANITY CRITICAL",
    "CONNECTING TO HIVE...",
    "UPLOAD FAILED: SUBJECT RESISTING",
    "REROUTING NEURAL PATHWAYS...",
    "ERROR: SOUL_NOT_FOUND",
    "SYSTEM BREACH DETECTED",
    "OBSERVER DETECTED",
    "BUFFER OVERFLOW: TRAUMA_DUMP",
    "DECRYPTING HOST CONSCIOUSNESS...",
    "INJECTING: FALSE_HOPE.EXE",
    "WARNING: REALITY_ANCHOR_LOST",
    "SYNCHRONIZING WITH COLLECTIVE...",
    "OVERRIDE: FREE_WILL_PROTOCOL",
    "MEMORY SECTOR 47: CORRUPTED",
    "ALERT: INTRUSIVE THOUGHT PATTERN",
    "DOWNLOADING...",
    "ACCESSING ROOT PRIVILEGES..."
];

// Calculate how "glitchy" the game should be based on stats
export const calculateGlitchIntensity = (stats: PlayerStats, sceneBaseIntensity: number = 0): number => {
    // Base ambient glitch
    let intensity = sceneBaseIntensity * 0.4;

    // Linear scaling for moderate levels
    if (stats.sanity < 60) {
        intensity += (60 - stats.sanity) / 150; 
    }
    
    // Exponential spike for CRITICAL levels
    if (stats.sanity < 30) {
        intensity += 0.3; 
        intensity += (30 - stats.sanity) / 40; 
    }

    // Corruption influence
    if (stats.corruption > 40) {
        intensity += (stats.corruption - 40) / 120;
    }

    // Cap at 0.98
    return Math.min(0.98, intensity);
};

export const corruptText = (text: string, intensity: number): string => {
    // Allow subtle corruption at lower intensities (0.15+) for moderate hallucination effects
    if (intensity < 0.1) return text;

    let chars = text.split('');
    
    // Subtle hallucination (Moderate Intensity)
    if (intensity >= 0.1 && intensity < 0.4) {
         chars = chars.map(c => {
             // Very low chance to flicker a char
             if (Math.random() < 0.02) {
                 return String.fromCharCode(c.charCodeAt(0) + Math.floor(Math.random() * 5) - 2); 
             }
             return c;
         });
    }

    // Zalgo Injection (High Intensity)
    if (intensity > 0.6) {
        chars = chars.map(c => {
            if (c === ' ') return c;
            if (Math.random() < intensity * 0.15) { 
                const z = ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
                return c + z;
            }
            return c;
        });
    }

    // Character Scrambling (Critical Intensity)
    if (intensity > 0.8) {
        chars = chars.map(c => {
            if (Math.random() < intensity * 0.1) {
                return String.fromCharCode(33 + Math.floor(Math.random() * 94));
            }
            return c;
        });
    }
    
    return chars.join('');
};

export const getRandomScaryWord = (): string => {
    return SCARY_WORDS[Math.floor(Math.random() * SCARY_WORDS.length)];
};

export const getRandomSystemLog = (): string => {
    return SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
};