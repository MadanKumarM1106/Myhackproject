import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export interface AIResponse {
  distance: string;
  duration: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  tacticalNotes: string;
  waypoints: {x: number, y: number, label?: string}[];
}

export const generateRouteAnalysis = async (
  start: string, 
  end: string, 
  priority: string
): Promise<AIResponse> => {
  
  // Mock fallback if no API key
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          distance: "145 KM",
          duration: "2h 15m",
          riskLevel: "Medium",
          summary: `Optimal route generated from ${start} to ${end}. Avoids major civilian congestion sectors.`,
          tacticalNotes: "Proceed with caution through Sector 4 due to recent weather alerts. Maintain radio silence in Valley Region.",
          waypoints: [
            { x: 20, y: 80, label: 'START' },
            { x: 35, y: 65 },
            { x: 50, y: 60, label: 'CHECKPOINT' },
            { x: 65, y: 40 },
            { x: 80, y: 20, label: 'END' }
          ]
        });
      }, 2000);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as a military logistics AI. Plan a transport route from ${start} to ${end} with priority level: ${priority}. 
      Analyze the route for distance, duration, and tactical risk.
      Also generate 5-7 abstract coordinate waypoints (x, y values between 10 and 90) to plot on a tactical grid 100x100.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distance: { type: Type.STRING, description: "Total distance (e.g., 150 km)" },
            duration: { type: Type.STRING, description: "Estimated travel time" },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            summary: { type: Type.STRING, description: "Brief route summary" },
            tacticalNotes: { type: Type.STRING, description: "Safety or tactical advice" },
            waypoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  label: { type: Type.STRING, nullable: true }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIResponse;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("AI Generation failed:", error);
    return {
      distance: "N/A",
      duration: "N/A",
      riskLevel: "High",
      summary: "AI Analysis failed. Manual routing required.",
      tacticalNotes: "System offline or API key invalid.",
      waypoints: []
    };
  }
};

export const sendTacticalQuery = async (message: string): Promise<string> => {
  if (!apiKey) return "COMM LINK OFFLINE. KEY MISSING.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are WARCOM, an advanced military logistics AI. Respond with brevity, military jargon (Roger, Copy, Solid Copy, Oscar Mike), and tactical precision. Do not use markdown formatting like **bold**, just plain text suitable for a raw terminal output. Keep responses under 40 words.",
      }
    });
    return response.text || "NO DATA RECEIVED.";
  } catch (e) {
    return "TRANSMISSION ERROR.";
  }
};