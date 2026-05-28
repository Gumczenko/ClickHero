import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { xpToNext } from '../constants/gameData';

const SAVE_KEY = '@clickhero_save';

export type GameState = {
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  gold: number;
  kills: number;
};

type Action =
  | { type: 'TAKE_DAMAGE'; amount: number }
  | { type: 'EARN_REWARDS'; xp: number; gold: number }
  | { type: 'REVIVE' }
  | { type: 'BUY_POTION' }
  | { type: 'UPGRADE_STAT'; stat: 'attack' | 'defense' | 'maxHp' }
  | { type: 'LOAD_STATE'; state: GameState };

const initialState: GameState = {
  level: 1,
  xp: 0,
  xpToNext: xpToNext(1),
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 2,
  gold: 0,
  kills: 0,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'TAKE_DAMAGE': {
      const dmg = Math.max(1, action.amount - state.defense);
      return { ...state, hp: Math.max(0, state.hp - dmg) };
    }
    case 'EARN_REWARDS': {
      let { level, maxHp, attack, defense } = state;
      let newXp = state.xp + action.xp;
      let newXpToNext = state.xpToNext;
      let leveled = false;

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        level++;
        maxHp += 20;
        attack += 3;
        defense += 1;
        newXpToNext = xpToNext(level);
        leveled = true;
      }

      return {
        ...state,
        xp: newXp,
        xpToNext: newXpToNext,
        level,
        maxHp,
        attack,
        defense,
        gold: state.gold + action.gold,
        kills: state.kills + 1,
        hp: leveled ? maxHp : state.hp,
      };
    }
    case 'REVIVE':
      return { ...state, hp: state.maxHp };
    case 'BUY_POTION': {
      if (state.gold < 30) return state;
      return { ...state, gold: state.gold - 30, hp: Math.min(state.hp + 50, state.maxHp) };
    }
    case 'UPGRADE_STAT': {
      const costs = { attack: 50, defense: 40, maxHp: 35 };
      const gains = { attack: 5, defense: 3, maxHp: 20 };
      const cost = costs[action.stat];
      if (state.gold < cost) return state;
      return {
        ...state,
        gold: state.gold - cost,
        [action.stat]: state[action.stat] + gains[action.stat],
      };
    }
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY).then(raw => {
      if (raw) {
        try {
          dispatch({ type: 'LOAD_STATE', state: JSON.parse(raw) });
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
