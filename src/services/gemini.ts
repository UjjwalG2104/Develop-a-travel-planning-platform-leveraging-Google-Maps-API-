import { GoogleGenAI, Modality } from "@google/genai";
import { Interest, Location, ItineraryResponse, Budget, Transportation, Persona } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAudioItinerary(text: string): Promise<string | null> {
  try {
    const summaryPrompt = `Summarize this travel itinerary in a cheerful, inviting tone for a short audio guide (max 100 words). Focus on the highlights: ${text.substring(0, 1000)}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: summaryPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("Audio generation failed:", error);
    return null;
  }
}

export async function generateDestinationVideo(destination: string): Promise<string | null> {
  try {
    // Create a new instance for Veo to use the selected API key
    const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || "" });
    
    let operation = await veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, high-quality aerial drone shot of ${destination}. Vibrant colors, professional lighting, 4k, travel documentary style.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion (limited attempts for UI responsiveness)
    let attempts = 0;
    while (!operation.done && attempts < 12) { // Max 2 minutes
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await veoAi.operations.getVideosOperation({ operation: operation });
      attempts++;
    }

    if (operation.done && operation.response?.generatedVideos?.[0]?.video?.uri) {
      const downloadLink = operation.response.generatedVideos[0].video.uri;
      // Fetch with the API key in headers
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': process.env.API_KEY || process.env.GEMINI_API_KEY || "",
        },
      });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Video generation failed:", error);
    return null;
  }
}

export async function generateDestinationImage(destination: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A cinematic, high-quality travel photography shot of ${destination}. Vibrant colors, wide angle, professional lighting, no text, no people.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
}

export async function generateItinerary(
  interests: Interest[],
  location: Location | null,
  destination?: string,
  duration: number = 1,
  budget: Budget = 'standard',
  transportation: Transportation = 'transit',
  persona: Persona = 'solo'
): Promise<ItineraryResponse> {
  const model = "gemini-3-flash-preview";
  
  const interestLabels = interests.join(", ");
  const locationContext = location 
    ? `near my current location (lat: ${location.lat}, lng: ${location.lng})`
    : destination ? `in ${destination}` : "in a popular travel destination";

  const prompt = `Plan a personalized ${duration}-day travel itinerary focused on ${interestLabels} ${locationContext}. 
  
  Context:
  - Budget: ${budget}
  - Primary Transportation: ${transportation}
  - Traveler Type: ${persona}
  
  Instructions:
  1. For each day, provide a clear heading (e.g., Day 1: Exploration).
  2. Include specific places to visit, eat, and explore for morning, afternoon, and evening.
  3. Optimize the route for ${transportation} and ensure activities are suitable for a ${persona} traveler.
  4. For each place, provide a brief description and why it fits the selected interests, ${budget} budget, and ${persona} persona.
  5. Include a "Weather & Packing Advice" section at the end based on CURRENT real-time weather data for ${destination || 'the location'}.
  6. Format the response in Markdown with clear structure.
  7. Use Google Maps to find real, existing places.
  8. Use Google Search to find real-time events or seasonal highlights happening now in ${destination || 'the location'}.`;

  const config: any = {
    tools: [{ googleMaps: {} }, { googleSearch: {} }],
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
