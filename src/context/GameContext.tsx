import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { GameState, PlayerStats, Scene } from '../types';
import { INITIAL_STATS } from '../types';
import { SCENES } from '../data/story';
import { SAVE_KEY, META_KEY } from '../constants';

type Action = 
  | { type: 'TRANSITION'; sceneId: string }
  | { type: 'UPDATE_STATS'; stats: Partial<PlayerStats> }
  | { type: 'SET_FLAG'; key: string; value: boolean }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'UPDATE_META'; key: string; value: any }
  | { type: 'RESET' };

const initialState: GameState = {
  currentSceneId: 'start',
  stats: INITIAL_STATS,
  inventory: [],
  flags: {},
  history: [],
  glitchMode: false,
  metaMemory: {},
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
  currentScene: Scene;
}>({
  state: initialState,
  dispatch: () => null,
  currentScene: SCENES['start'],
});

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'TRANSITION':
      return {
        ...state,
        currentSceneId: action.sceneId,
        history: [...state.history, action.sceneId],
        glitchMode: SCENES[action.sceneId]?.glitchIntensity ? SCENES[action.sceneId]!.glitchIntensity! > 0.5 : false
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
            sanity: Math.max(0, Math.min(100, state.stats.sanity + (action.stats.sanity || 0))),
            corruption: Math.max(0, Math.min(100, state.stats.corruption + (action.stats.corruption || 0))),
            truth: state.stats.truth + (action.stats.truth || 0),
            trust: state.stats.trust + (action.stats.trust || 0),
        }
      };
    case 'SET_FLAG':
        return {
            ...state,
            flags: { ...state.flags, [action.key]: action.value }
        };
    case 'UPDATE_META':
        const newMeta = { ...state.metaMemory, [action.key]: action.value };
        localStorage.setItem(META_KEY, JSON.stringify(newMeta));
        return {
            ...state,
            metaMemory: newMeta
        };
    case 'LOAD_GAME':
        return action.state;
    case 'RESET':
        return { ...initialState, metaMemory: state.metaMemory };
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load meta memory on mount
  const meta = localStorage.getItem(META_KEY);
  const startState = meta ? { ...initialState, metaMemory: JSON.parse(meta) } : initialState;

  const [state, dispatch] = useReducer(gameReducer, startState);

  // Auto-save on every transition
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  const currentScene = SCENES[state.currentSceneId] || SCENES['start'];

  // Handle auto-transition scenes
  useEffect(() => {
    if (currentScene.autoTransition) {
        const timer = setTimeout(() => {
            dispatch({ type: 'TRANSITION', sceneId: currentScene.autoTransition!.nextSceneId });
        }, currentScene.autoTransition.delay);
        return () => clearTimeout(timer);
    }
  }, [currentScene]);

  return (
    <GameContext.Provider value={{ state, dispatch, currentScene }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);