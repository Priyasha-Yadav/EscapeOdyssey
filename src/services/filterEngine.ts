import type { ActivityItem, Destination, FilterState } from '../types';
import { sanitizeInput } from '../utils/security';
import { calculateMatchScore } from './matchEngine';

/**
 * Filters and sorts destinations according to filter state and custom added activities.
 */
export function filterDestinations(
  destinations: Destination[],
  filters: FilterState,
  addedActivities: Record<string, ActivityItem[]> = {}
): Destination[] {
  return destinations
    .map(dest => {
      const extraItems = addedActivities[dest.id] || [];
      const mergedDest: Destination = {
        ...dest,
        itinerary: [...dest.itinerary, ...extraItems],
      };
      const matchScore = calculateMatchScore(mergedDest, filters.selectedMoods);
      return { ...mergedDest, matchScore };
    })
    .filter(dest => {
      // Hub travel time filter
      const hubData = dest.hubDistance[filters.departureHub];
      if (hubData && hubData.durationMinutes > filters.maxTravelMinutes) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery.trim() !== '') {
        const query = sanitizeInput(filters.searchQuery, 100).toLowerCase();
        const matchTitle = dest.title.toLowerCase().includes(query);
        const matchTagline = dest.tagline.toLowerCase().includes(query);
        const matchVibe = dest.vibeSummary.toLowerCase().includes(query);
        if (!matchTitle && !matchTagline && !matchVibe) return false;
      }

      // Mood tag filter
      if (filters.selectedMoods.length > 0) {
        const matchesAnyMood = dest.moods.some(m => filters.selectedMoods.includes(m));
        if (!matchesAnyMood) return false;
      }

      return true;
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
