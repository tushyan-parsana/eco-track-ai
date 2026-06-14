import { describe, it, expect } from 'vitest';
import {
  calculateFootprint,
  computeCarbonScore,
  CAR_EMISSION_PER_MILE,
  FLIGHT_EMISSION_PER_TRIP,
  ELECTRICITY_EMISSION_PER_DOLLAR,
  DIET_EMISSIONS,
  SHOPPING_EMISSIONS,
  MAX_CARBON_SCORE,
  DEFAULT_FORM_DATA,
  type CalculatorFormData,
} from './constants';

describe('calculateFootprint', () => {
  it('calculates correctly with known inputs', () => {
    const data: CalculatorFormData = {
      carMiles: '150',
      flights: '2',
      electricity: '100',
      dietType: 'mixed',
      shoppingFrequency: 'moderate',
    };

    const result = calculateFootprint(data);

    const expectedTransport =
      150 * CAR_EMISSION_PER_MILE + 2 * FLIGHT_EMISSION_PER_TRIP;
    const expectedEnergy = 100 * ELECTRICITY_EMISSION_PER_DOLLAR;
    const expectedFood = DIET_EMISSIONS.mixed;
    const expectedLifestyle = SHOPPING_EMISSIONS.moderate;
    const expectedTotal =
      expectedTransport + expectedEnergy + expectedFood + expectedLifestyle;

    expect(result.transport).toBe(expectedTransport);
    expect(result.energy).toBe(expectedEnergy);
    expect(result.food).toBe(expectedFood);
    expect(result.lifestyle).toBe(expectedLifestyle);
    expect(result.total).toBe(expectedTotal);
  });

  it('handles zero / empty inputs gracefully', () => {
    const result = calculateFootprint(DEFAULT_FORM_DATA);

    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.food).toBe(DIET_EMISSIONS.mixed);
    expect(result.lifestyle).toBe(SHOPPING_EMISSIONS.moderate);
    expect(result.total).toBe(DIET_EMISSIONS.mixed + SHOPPING_EMISSIONS.moderate);
  });

  it('handles meat diet type', () => {
    const result = calculateFootprint({
      ...DEFAULT_FORM_DATA,
      dietType: 'meat',
    });
    expect(result.food).toBe(DIET_EMISSIONS.meat);
  });

  it('handles vegetarian diet type', () => {
    const result = calculateFootprint({
      ...DEFAULT_FORM_DATA,
      dietType: 'vegetarian',
    });
    expect(result.food).toBe(DIET_EMISSIONS.vegetarian);
  });

  it('handles vegan diet type', () => {
    const result = calculateFootprint({
      ...DEFAULT_FORM_DATA,
      dietType: 'vegan',
    });
    expect(result.food).toBe(DIET_EMISSIONS.vegan);
  });

  it('handles high shopping frequency', () => {
    const result = calculateFootprint({
      ...DEFAULT_FORM_DATA,
      shoppingFrequency: 'high',
    });
    expect(result.lifestyle).toBe(SHOPPING_EMISSIONS.high);
  });

  it('handles low shopping frequency', () => {
    const result = calculateFootprint({
      ...DEFAULT_FORM_DATA,
      shoppingFrequency: 'low',
    });
    expect(result.lifestyle).toBe(SHOPPING_EMISSIONS.low);
  });

  it('handles very large inputs', () => {
    const result = calculateFootprint({
      carMiles: '10000',
      flights: '50',
      electricity: '5000',
      dietType: 'meat',
      shoppingFrequency: 'high',
    });

    expect(result.transport).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(result.transport);
  });

  it('handles non-numeric string inputs as zero', () => {
    const result = calculateFootprint({
      ...DEFAULT_FORM_DATA,
      carMiles: 'abc',
      flights: '',
      electricity: 'invalid',
    });

    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
  });
});

describe('computeCarbonScore', () => {
  it('returns max score for zero emissions', () => {
    expect(computeCarbonScore(0)).toBe(MAX_CARBON_SCORE);
  });

  it('returns 0 for very high emissions', () => {
    expect(computeCarbonScore(10000)).toBe(0);
    expect(computeCarbonScore(50000)).toBe(0);
  });

  it('returns intermediate scores for moderate emissions', () => {
    const score = computeCarbonScore(5000);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(MAX_CARBON_SCORE);
    expect(score).toBe(MAX_CARBON_SCORE - Math.min(MAX_CARBON_SCORE, Math.round(5000 / 100)));
  });

  it('never returns negative values', () => {
    expect(computeCarbonScore(999999)).toBeGreaterThanOrEqual(0);
  });

  it('never exceeds MAX_CARBON_SCORE', () => {
    expect(computeCarbonScore(0)).toBeLessThanOrEqual(MAX_CARBON_SCORE);
    expect(computeCarbonScore(-100)).toBeLessThanOrEqual(MAX_CARBON_SCORE);
  });
});
