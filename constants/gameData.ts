export type Monster = {
  id: string;
  name: string;
  image: any;
  maxHp: number;
  attack: number;
  xpReward: number;
  goldReward: number;
  minLevel: number;
};

export const MONSTERS: Monster[] = [
  { id: 'slime',  name: 'Slime',  image: require('../assets/slime.png'),  maxHp: 20,  attack: 4,  xpReward: 10,  goldReward: 5,   minLevel: 1  },
  { id: 'goblin', name: 'Goblin', image: require('../assets/goblin.png'), maxHp: 50,  attack: 10, xpReward: 25,  goldReward: 14,  minLevel: 2  },
  { id: 'troll',  name: 'Troll',  image: require('../assets/troll.png'),  maxHp: 110, attack: 20, xpReward: 55,  goldReward: 30,  minLevel: 4  },
  { id: 'demon',  name: 'Demon',  image: require('../assets/demon.png'),  maxHp: 220, attack: 38, xpReward: 110, goldReward: 60,  minLevel: 7  },
  { id: 'dragon', name: 'Smok',   image: require('../assets/smok.png'),   maxHp: 420, attack: 70, xpReward: 220, goldReward: 120, minLevel: 11 },
];

export function pickMonster(heroLevel: number): Monster {
  const available = MONSTERS.filter(m => m.minLevel <= heroLevel);
  return available[Math.floor(Math.random() * available.length)];
}

export function xpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}
