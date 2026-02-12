export type Speaker = 
  | 'PLAYER' 
  | 'IRIS' 
  | 'SARAH' 
  | 'SYSTEM' 
  | 'COLLECTIVE' 
  | 'UNKNOWN' 
  | 'HALLUCINATION'
  | 'DR_ZHAO'
  | 'CASSANDRA'
  | 'MARCUS'
  | 'AVA'
  | 'JENNIFER'
  | 'ALEX'
  | 'DIGITAL_ALEX'
  | 'COMMITTEE_CHAIR';

export interface StatCheck {
  stat: 'sanity' | 'corruption' | 'truth' | 'trust';
  value: number;
  condition: 'gt' | 'lt' | 'eq';
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requiredStats?: StatCheck[];
  effects?: Partial<PlayerStats>;
  metaEffect?: string; // Special strings for meta-horror e.g., "DELETE_SAVE"
  hidden?: boolean; // If true, only shows if criteria met
}

export interface Scene {
  id: string;
  speaker: Speaker;
  text: string;
  bgImage?: string; // URL for background
  choices: Choice[];
  music?: string;
  metaFlag?: string; // Sets a narrative flag when entered
  glitchIntensity?: number; // 0 to 1
  autoTransition?: {
    delay: number;
    nextSceneId: string;
  };
}

export interface PlayerStats {
  sanity: number;
  corruption: number;
  truth: number;
  trust: number;
}

export interface GameState {
  currentSceneId: string;
  stats: PlayerStats;
  inventory: string[];
  flags: Record<string, boolean>; // Persistent narrative flags
  history: string[]; // List of visited scene IDs
  glitchMode: boolean; // Global visual corruption toggle
  metaMemory: Record<string, any>; // Persists across reloads
}

export const INITIAL_STATS: PlayerStats = {
  sanity: 90,
  corruption: 10,
  truth: 5,
  trust: 0,
};