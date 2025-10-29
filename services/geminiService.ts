
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    conditionName: {
      type: Type.STRING,
      description: "The name of the potential skin condition detected. If none, say 'No specific condition detected'."
    },
    description: {
      type: Type.STRING,
      description: "A brief, easy-to-understand description of the condition."
    },
    homeRemedies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of suggested home remedies. If not applicable, provide general skin care tips."
    },
    advice: {
      type: Type.STRING,
      description: "Crucial advice, including whether to consult a doctor. Start with a disclaimer that this is not medical advice."
    },
    severity: {
      type: Type.STRING,
      description: "An estimated severity level: 'Low', 'Medium', 'High', or 'Unknown'."
    }
  },
  required: ["conditionName", "description", "homeRemedies", "advice", "severity"]
};

export const analyzeSkinImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const prompt = `
    Analyze the provided image of human skin. Act as a helpful AI dermatology assistant.
    1. Identify any potential skin conditions visible in the image.
    2. Provide a simple description of the condition.
    3. List some common and safe home remedies.
    4. Give clear advice, emphasizing that this is not a substitute for professional medical diagnosis and they should consult a dermatologist for any concerns.
    5. Estimate the severity.
    
    If the image is not of skin or is unclear, state that and ask for a better image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    // A simple check to ensure we got a JSON object
    if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
        return JSON.parse(jsonText) as AnalysisResult;
    } else {
        throw new Error("Invalid JSON response from API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze image. The AI model may be temporarily unavailable.");
  }
};
