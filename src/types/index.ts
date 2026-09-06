export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

export type CurrencyOption = {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type TravelHub = {
  id: string;
  name: string;
  code: string;
  country: string;
  lat: number;
  lng: number;
};

export type MoodTag = 
  | 'alpine'
  | 'coastal'
  | 'foodie'
  | 'unplug'
  | 'urban'
  | 'adventure'
  | 'romantic'
  | 'stargazing';

export type MoodOption = {
  id: MoodTag;
  label: string;
  icon: string;
  description: string;
  gradient: string;
};

export type TravelMode = 'drive' | 'flight' | 'train';

export type ActivityCategory = 'dining' | 'nature' | 'culture' | 'stay' | 'hidden_gem' | 'wellness' | 'adventure';

export type ActivityItem = {
  id: string;
  timeSlot: string;
  period: 'Friday Night' | 'Saturday Morning' | 'Saturday Afternoon' | 'Saturday Evening' | 'Sunday Morning' | 'Sunday Afternoon';
  title: string;
  description: string;
  category: ActivityCategory;
  duration: string;
  estimatedCost: number;
  locationName: string;
  isOptional?: boolean;
};

export type PackingCategory = 'clothing' | 'gear' | 'essentials' | 'vibe';

export type PackingItem = {
  id: string;
  name: string;
  category: PackingCategory;
  checked: boolean;
};

export type BudgetTier = 'budget' | 'comfortable' | 'luxury';

export type Destination = {
  id: string;
  title: string;
  tagline: string;
  heroImage: string;
  gallery: string[];
  hubDistance: Record<string, { mode: TravelMode; durationMinutes: number; formatted: string }>;
  lat: number;
  lng: number;
  moods: MoodTag[];
  rating: number;
  reviewsCount: number;
  matchScore?: number;
  weather: {
    tempF: number;
    tempC: number;
    condition: string;
    icon: string;
    forecast: string;
  };
  bestMonths: string[];
  vibeSummary: string;
  highlights: string[];
  baseCostPerPerson: number;
  itinerary: ActivityItem[];
  packingList: PackingItem[];
  insiderTips: string[];
  accommodationName: string;
  accommodationType: string;
};

export type FilterState = {
  departureHub: string;
  maxTravelMinutes: number;
  selectedMoods: MoodTag[];
  budgetTier: BudgetTier;
  searchQuery: string;
  viewMode: 'grid' | 'deck' | 'map';
  currency: CurrencyCode;
  theme: ThemeMode;
};

export type QuizAnswer = {
  stressLevel?: number;
  environment?: 'mountains' | 'beach' | 'city' | 'forest';
  pace?: 'chilled' | 'action_packed' | 'food_centric';
  companion?: 'solo' | 'couple' | 'friends';
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  destinationTitle: string;
  quote: string;
  rating: number;
  date: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type Collection = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  mood: MoodTag;
  count: number;
};
