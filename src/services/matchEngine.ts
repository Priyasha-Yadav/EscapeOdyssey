import type { Destination, MoodTag, QuizAnswer } from '../types';
import { DESTINATIONS } from '../data/destinations';

/**
 * Calculates a match score (60-99%) between a destination and selected mood tags.
 */
export function calculateMatchScore(dest: Destination, moods: MoodTag[]): number {
  let score = 75;
  if (moods.length === 0) {
    score += 15;
  } else {
    const matched = dest.moods.filter(m => moods.includes(m));
    const ratio = matched.length / moods.length;
    score += Math.round(ratio * 24);
  }
  if (dest.rating >= 4.9) score += 4;
  return Math.min(99, Math.max(60, score));
}

/**
 * Maps quiz answers to a recommended destination.
 */
export function getQuizRecommendation(answers: QuizAnswer): Destination {
  let targetMood: MoodTag = 'alpine';
  if (answers.environment === 'beach') targetMood = 'coastal';
  else if (answers.environment === 'mountains') targetMood = 'alpine';
  else if (answers.environment === 'city') targetMood = 'urban';
  else if (answers.pace === 'food_centric') targetMood = 'foodie';
  else if (answers.stressLevel && answers.stressLevel > 6) targetMood = 'unplug';

  return DESTINATIONS.find(d => d.moods.includes(targetMood)) || DESTINATIONS[0];
}
