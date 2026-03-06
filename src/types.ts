export type Interest = 'gourmet' | 'adventure' | 'cultural' | 'relaxation' | 'shopping';

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
