import type { Speaker } from './types';

export const SPEAKER_COLORS: Record<Speaker, string> = {
  PLAYER: 'text-white',
  IRIS: 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]',
  SARAH: 'text-neon-amber drop-shadow-[0_0_5px_rgba(255,170,0,0.8)]',
  SYSTEM: 'text-neon-red font-mono',
  COLLECTIVE: 'text-neon-purple font-bold tracking-widest',
  UNKNOWN: 'text-slate-400 italic font-serif leading-relaxed',
  HALLUCINATION: 'text-pink-500 blur-[0.5px]',
  DR_ZHAO: 'text-emerald-400',
  CASSANDRA: 'text-yellow-400 font-serif tracking-wide',
  MARCUS: 'text-orange-300',
  AVA: 'text-teal-300',
  JENNIFER: 'text-rose-300',
  ALEX: 'text-indigo-400',
  DIGITAL_ALEX: 'text-cyan-100 drop-shadow-[0_0_8px_rgba(0,243,255,0.6)] font-mono',
  COMMITTEE_CHAIR: 'text-slate-200 font-bold',
};

export const SPEAKER_NAMES: Record<Speaker, string> = {
  PLAYER: 'YOU',
  IRIS: 'DR. IRIS CHEN',
  SARAH: 'DET. SARAH REEVES',
  SYSTEM: 'SYSTEM ALERT',
  COLLECTIVE: 'THE COLLECTIVE',
  UNKNOWN: '', // Narrative often has no speaker label
  HALLUCINATION: '???',
  DR_ZHAO: 'DR. ZHAO',
  CASSANDRA: 'CASSANDRA VALE',
  MARCUS: 'MARCUS WEBB',
  AVA: 'DR. AVA WINTERS',
  JENNIFER: 'JENNIFER PARK',
  ALEX: 'ALEX (FRAGMENT)',
  DIGITAL_ALEX: 'DIGITAL ALEX',
  COMMITTEE_CHAIR: 'COMMITTEE CHAIR',
};

// Key used for localStorage
export const SAVE_KEY = 'FRACTURED_GAME_STATE_V1';
export const META_KEY = 'FRACTURED_META_MEMORY';