import { describe, it, expect } from 'vitest';
import {
  footprintSchema,
  goalSchema,
  calculatorFormSchema,
} from './validators';

describe('footprintSchema', () => {
  it('accepts valid footprint data', () => {
    const result = footprintSchema.safeParse({
      transport: 100,
      energy: 50,
      food: 2000,
      lifestyle: 500,
      total: 2650,
    });
    expect(result.success).toBe(true);
  });

  it('accepts zero values', () => {
    const result = footprintSchema.safeParse({
      transport: 0,
      energy: 0,
      food: 0,
      lifestyle: 0,
      total: 0,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative transport value', () => {
    const result = footprintSchema.safeParse({
      transport: -1,
      energy: 50,
      food: 2000,
      lifestyle: 500,
      total: 2549,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative energy value', () => {
    const result = footprintSchema.safeParse({
      transport: 100,
      energy: -10,
      food: 2000,
      lifestyle: 500,
      total: 2590,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = footprintSchema.safeParse({
      transport: 100,
      energy: 50,
    });
    expect(result.success).toBe(false);
  });

  it('rejects string values', () => {
    const result = footprintSchema.safeParse({
      transport: '100',
      energy: 50,
      food: 2000,
      lifestyle: 500,
      total: 2650,
    });
    expect(result.success).toBe(false);
  });
});

describe('goalSchema', () => {
  it('accepts valid goal data', () => {
    const result = goalSchema.safeParse({
      title: 'Reduce meat consumption',
      targetValue: 100,
      deadline: '2026-12-31',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = goalSchema.safeParse({
      title: '',
      targetValue: 100,
      deadline: '2026-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative target value', () => {
    const result = goalSchema.safeParse({
      title: 'Test goal',
      targetValue: -50,
      deadline: '2026-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero target value', () => {
    const result = goalSchema.safeParse({
      title: 'Test goal',
      targetValue: 0,
      deadline: '2026-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid date format', () => {
    const result = goalSchema.safeParse({
      title: 'Test goal',
      targetValue: 100,
      deadline: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing deadline', () => {
    const result = goalSchema.safeParse({
      title: 'Test goal',
      targetValue: 100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects very long titles', () => {
    const result = goalSchema.safeParse({
      title: 'a'.repeat(201),
      targetValue: 100,
      deadline: '2026-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('accepts title at max length', () => {
    const result = goalSchema.safeParse({
      title: 'a'.repeat(200),
      targetValue: 100,
      deadline: '2026-12-31',
    });
    expect(result.success).toBe(true);
  });
});

describe('calculatorFormSchema', () => {
  it('accepts valid form data', () => {
    const result = calculatorFormSchema.safeParse({
      carMiles: '150',
      flights: '2',
      electricity: '100',
      dietType: 'mixed',
      shoppingFrequency: 'moderate',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string values for numeric fields', () => {
    const result = calculatorFormSchema.safeParse({
      carMiles: '',
      flights: '',
      electricity: '',
      dietType: 'vegan',
      shoppingFrequency: 'low',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid diet type', () => {
    const result = calculatorFormSchema.safeParse({
      carMiles: '0',
      flights: '0',
      electricity: '0',
      dietType: 'invalid',
      shoppingFrequency: 'moderate',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid shopping frequency', () => {
    const result = calculatorFormSchema.safeParse({
      carMiles: '0',
      flights: '0',
      electricity: '0',
      dietType: 'mixed',
      shoppingFrequency: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid diet types', () => {
    for (const diet of ['meat', 'mixed', 'vegetarian', 'vegan']) {
      const result = calculatorFormSchema.safeParse({
        carMiles: '0',
        flights: '0',
        electricity: '0',
        dietType: diet,
        shoppingFrequency: 'moderate',
      });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all valid shopping frequencies', () => {
    for (const freq of ['high', 'moderate', 'low']) {
      const result = calculatorFormSchema.safeParse({
        carMiles: '0',
        flights: '0',
        electricity: '0',
        dietType: 'mixed',
        shoppingFrequency: freq,
      });
      expect(result.success).toBe(true);
    }
  });
});
