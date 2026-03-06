import { GoogleGenAI } from "@google/genai";
import { Interest, Location, ItineraryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateItinerary(
  interests: Interest[],
  location: Location | null,
  destination?: string
): Promise<ItineraryResponse> {
  const model = "gemini-2.5-flash";
  
  const interestLabels = interests.join(", ");
  const locationContext = location 
    ? `near my current location (lat: ${location.lat}, lng: ${location.lng})`
    : destination ? `in ${destination}` : "in a popular travel destination";

  const prompt = `Plan a personalized 1-day travel itinerary focused on ${interestLabels} ${locationContext}. 
  Include specific places to visit, eat, and explore. 
  For each place, provide a brief description and why it fits the selected interests.
  Format the response in Markdown with clear headings for Morning, Afternoon, and Evening.
  Use Google Maps to find real, existing places.`;

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
