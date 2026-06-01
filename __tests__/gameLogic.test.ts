/**
 * @jest-environment node
 */
import { xpToNext, pickMonster } from '../constants/gameData';

describe('xpToNext', () => {
  it('returns 100 for level 1', () => {
    expect(xpToNext(1)).toBe(100);
  });

  it('increases with each level', () => {
    expect(xpToNext(2)).toBeGreaterThan(xpToNext(1));
    expect(xpToNext(5)).toBeGreaterThan(xpToNext(3));
  });
});

describe('pickMonster', () => {
  it('returns a monster at level 1', () => {
    const m = pickMonster(1);
    expect(m).toBeDefined();
    expect(m.minLevel).toBeLessThanOrEqual(1);
  });

  it('returns stronger monster at higher level', () => {
    const low = pickMonster(1);
    const high = pickMonster(11);
    expect(high.maxHp).toBeGreaterThan(low.maxHp);
  });

  it('does not return dragon at level 1', () => {
    expect(pickMonster(1).id).not.toBe('dragon');
  });

  it('can return dragon at level 11', () => {
    const ids = Array.from({ length: 20 }, () => pickMonster(11).id);
    expect(ids).toContain('dragon');
  });
});

function applyTakeDamage(hp: number, defense: number, amount: number): number {
  const dmg = Math.max(1, amount - defense);
  return Math.max(0, hp - dmg);
}

describe('TAKE_DAMAGE', () => {
  it('reduces hp after taking damage', () => {
    expect(applyTakeDamage(100, 2, 15)).toBeLessThan(100);
  });

  it('defense reduces incoming damage', () => {
    const withDef = applyTakeDamage(100, 5, 10);
    const noDef = applyTakeDamage(100, 0, 10);
    expect(withDef).toBeGreaterThan(noDef);
  });

  it('hp never goes below 0', () => {
    expect(applyTakeDamage(100, 0, 9999)).toBe(0);
  });

  it('minimum 1 damage even with high defense', () => {
    expect(applyTakeDamage(100, 999, 1)).toBe(99);
  });
});
