import { describe, it, expect } from 'vitest';
import { calculateMatchScore, getQuizRecommendation } from '../services/matchEngine';
import { DESTINATIONS } from '../data/destinations';

describe('matchEngine', () => {
  it('calculates default score when no moods are selected', () => {
    const dest = DESTINATIONS[0];
    const score = calculateMatchScore(dest, []);
    expect(score).toBeGreaterThanOrEqual(60);
    expect(score).toBeLessThanOrEqual(99);
  });

  it('increases match score when destination matches selected moods', () => {
    const dest = DESTINATIONS[0]; // Big Sur has alpine, coastal, unplug
    const scoreWithMatchingMood = calculateMatchScore(dest, ['coastal']);
    const scoreWithNoMatchingMood = calculateMatchScore(dest, ['urban']);
    expect(scoreWithMatchingMood).toBeGreaterThan(scoreWithNoMatchingMood);
  });

  it('returns quiz recommendation based on environment', () => {
    const beachRec = getQuizRecommendation({ environment: 'beach' });
    expect(beachRec.moods).toContain('coastal');

    const mountainRec = getQuizRecommendation({ environment: 'mountains' });
    expect(mountainRec.moods).toContain('alpine');
  });
});
