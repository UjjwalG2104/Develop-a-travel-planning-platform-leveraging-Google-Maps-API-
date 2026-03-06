import { GoogleGenAI } from "@google/genai";
import { Interest, Location, ItineraryResponse, Budget, Transportation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateItinerary(
  interests: Interest[],
  location: Location | null,
  destination?: string,
  duration: number = 1,
  budget: Budget = 'standard',
  transportation: Transportation = 'transit'
): Promise<ItineraryResponse> {
  const model = "gemini-2.5-flash";
  
  const interestLabels = interests.join(", ");
  const locationContext = location 
    ? `near my current location (lat: ${location.lat}, lng: ${location.lng})`
    : destination ? `in ${destination}` : "in a popular travel destination";

  const prompt = `Plan a personalized ${duration}-day travel itinerary focused on ${interestLabels} ${locationContext}. 
  
  Context:
  - Budget: ${budget}
  - Primary Transportation: ${transportation}
  
  Instructions:
  1. For each day, provide a clear heading (e.g., Day 1: Exploration).
  2. Include specific places to visit, eat, and explore for morning, afternoon, and evening.
  3. Optimize the route for ${transportation}.
  4. For each place, provide a brief description and why it fits the selected interests, ${budget} budget, and is accessible via ${transportation}.
  5. Include a "Weather & Packing Advice" section at the end based on the typical climate of ${destination || 'the location'}.
  6. Format the response in Markdown with clear structure.
  7. Use Google Maps to find real, existing places.`;

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng,
        },
      },
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config,
  });

  const text = response.text || "Sorry, I couldn't generate an itinerary at this time.";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const places = chunks
    .filter((chunk: any) => chunk.maps)
    .map((chunk: any) => ({
      title: chunk.maps.title,
      uri: chunk.maps.uri,
    }));

  return {
    itinerary: text,
    places,
  };
}
