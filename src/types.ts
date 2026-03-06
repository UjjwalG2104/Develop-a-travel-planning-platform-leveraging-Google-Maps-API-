export type Interest = 'gourmet' | 'adventure' | 'cultural' | 'relaxation' | 'shopping';
export type Budget = 'economy' | 'standard' | 'luxury';
export type Transportation = 'walking' | 'transit' | 'driving' | 'cycling';
export type Persona = 'solo' | 'couple' | 'family' | 'friends' | 'business';

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
  audio_url?: string | null;
  video_url?: string | null;
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
  transportation: Transportation;
  persona: Persona;
  hero_image?: string;
  audio_url?: string;
  video_url?: string;
  content: string;
  created_at: string;
}
