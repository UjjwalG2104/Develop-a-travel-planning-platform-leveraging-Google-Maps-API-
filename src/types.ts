export type Interest = 'gourmet' | 'adventure' | 'cultural' | 'relaxation' | 'shopping';
export type Budget = 'economy' | 'standard' | 'luxury';

export interface Location {
  lat: number;
  lng: number;
}

export interface ItineraryItem {
  title: string;
  description: string;
  location?: string;
  mapsUrl?: string;
}

export interface ItineraryResponse {
  itinerary: string;
  places: Array<{
    title: string;
    uri: string;
  }>;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface SavedItinerary extends ItineraryResponse {
  id: number;
  user_id: number;
  destination: string;
  interests: Interest[];
  duration: number;
  budget: Budget;
  content: string;
  created_at: string;
}
