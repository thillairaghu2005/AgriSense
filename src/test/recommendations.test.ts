import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '@/lib/recommendationRules';
import type { CropRecommendationInput } from '@/types';

describe('Crop Recommendation Engine', () => {
  it('recommends kharif crops like rice for alluvial/clay soil in Tamil Nadu', () => {
    const input: CropRecommendationInput = {
      state: 'tn',
      district: 'tn-thanjavur',
      landArea: 2,
      landAreaUnit: 'acres',
      season: 'kharif',
      soilType: 'alluvial',
      soilPh: 6.8,
    };

    const recs = generateRecommendations(input);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.length).toBeLessThanOrEqual(3);

    const hasRice = recs.some(r => r.cropId === 'rice');
    expect(hasRice).toBe(true);
    expect(recs[0].score).toBeGreaterThanOrEqual(70);
  });

  it('recommends rabi crops like wheat for northern plains in winter', () => {
    const input: CropRecommendationInput = {
      state: 'pb',
      district: 'pb-ludhiana',
      landArea: 5,
      landAreaUnit: 'acres',
      season: 'rabi',
      soilType: 'loamy',
      soilPh: 7.0,
    };

    const recs = generateRecommendations(input);
    expect(recs.length).toBeGreaterThan(0);
    const hasWheat = recs.some(r => r.cropId === 'wheat');
    expect(hasWheat).toBe(true);
  });

  it('identifies missing soil metrics accurately', () => {
    const input: CropRecommendationInput = {
      state: 'mh',
      district: 'mh-pune',
      landArea: 3,
      landAreaUnit: 'acres',
      season: 'kharif',
      soilType: 'black',
    };

    const recs = generateRecommendations(input);
    expect(recs[0].missingData).toContain('soil pH');
    expect(recs[0].missingData).toContain('nitrogen level');
  });
});
