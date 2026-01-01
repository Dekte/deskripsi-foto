
import { GoogleGenAI, Type } from "@google/genai";
import { StockMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeStockImage(base64Image: string): Promise<StockMetadata> {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Act as a world-class stock photography metadata specialist. Analyze the provided image and generate:
1. A concise, descriptive, and SEO-friendly Title (Caption).
2. A detailed Description (maximum 1000 characters) that includes the mood, lighting, colors, and subject matter, suitable for a professional stock contributor profile.
3. A comprehensive list of at least 30-50 relevant keywords that would help this photo rank high in search results.

IMPORTANT: The response MUST be in English. The description MUST be under 1000 characters.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy SEO title for the photo" },
          description: { type: Type.STRING, description: "A detailed description under 1000 characters" },
          keywords: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of 30-50 relevant search keywords"
          }
        },
        required: ["title", "description", "keywords"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No response received from the AI.");
  }

  return JSON.parse(resultText) as StockMetadata;
}
