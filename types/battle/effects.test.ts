import { getRandomEffectCost, effectCostsDictionary, EffectKeys } from './effects';
import { describe, test, expect } from '@jest/globals';

describe('getRandomEffectCost', () => {
  test('returns a valid effect when no effectKeys provided', () => {
    const result = getRandomEffectCost();
    
    // Check structure
    expect(result).toHaveProperty('key');
    expect(result).toHaveProperty('methodArgs');
    expect(result).toHaveProperty('stages');
    
    // Check if returned key exists in dictionary
    expect(effectCostsDictionary.has(result.key)).toBe(true);
    
    // Check stages structure
    expect(result.stages).toHaveProperty('pre');
    expect(result.stages).toHaveProperty('after');
    expect(typeof result.stages.pre).toBe('number');
    expect(typeof result.stages.after).toBe('number');
  });

  test('returns specified effect when effectKeys provided', () => {
    const effectKeys: EffectKeys[] = ['buffActiveEffect'];
    const result = getRandomEffectCost(effectKeys);
    
    expect(result.key).toBe('buffActiveEffect');
    expect(result.methodArgs).toEqual(effectCostsDictionary.get('buffActiveEffect')?.methodArgs);
  });

  test('handles multiple effectKeys correctly', () => {
    const effectKeys: EffectKeys[] = ['buffActiveEffect', 'debuffActiveEffect'];
    const result = getRandomEffectCost(effectKeys);
    
    expect(effectKeys).toContain(result.key);
  });

  test('returned methodArgs match dictionary entry', () => {
    const result = getRandomEffectCost();
    const dictionaryEntry = effectCostsDictionary.get(result.key);
    
    expect(result.methodArgs).toEqual(dictionaryEntry?.methodArgs);
  });
});