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
  | { type: 'RESET' }
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

// cały stan gry w jednym miejscu zamiast rozrzucać po ekranach
function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'TAKE_DAMAGE': {
      // Math.max(1) żeby zawsze zadać chociaż 1 dmg nawet jak obrona jest wysoka
      const dmg = Math.max(1, action.amount - state.defense);
      return { ...state, hp: Math.max(0, state.hp - dmg) };
    }
    case 'EARN_REWARDS': {
      let { level, maxHp, attack, defense } = state;
      let newXp = state.xp + action.xp;
      let newXpToNext = state.xpToNext;
      let leveled = false;

      // pętla bo można wbić kilka lvl naraz jak się dużo xp dostanie
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
        // po awansie leczymy do pełna jako bonus
        hp: leveled ? maxHp : state.hp,
      };
    }
    case 'REVIVE':
      return { ...state, hp: state.maxHp };
    case 'BUY_POTION': {
      if (state.gold < 30) return state;
      // Math.min żeby hp nie przekroczyło maksimum
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
    case 'RESET':
      return initialState;
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  loading: boolean;
};

// dzięki temu każdy ekran ma dostęp do stanu bez przekazywania przez props
const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = React.useState(true);

  // wczytujemy zapis tylko raz przy starcie
  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY).then(raw => {
      if (raw) {
        try {
          dispatch({ type: 'LOAD_STATE', state: JSON.parse(raw) });
        } catch {}
      }
      setLoading(false);
    });
  }, []);

  // zapisujemy po każdej zmianie, guard na loading żeby nie nadpisać zapisu pustym stanem
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }
  }, [state, loading]);

  return <GameContext.Provider value={{ state, dispatch, loading }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
