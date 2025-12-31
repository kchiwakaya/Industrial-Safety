
import { GoogleGenAI, Type } from "@google/genai";
import { IndustrySector, SafetyAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "A safety score from 0 to 100" },
    level: { type: Type.STRING, description: "One of: 'Critical', 'Warning', 'Good'" },
    summary: { type: Type.STRING, description: "A brief summary of the overall safety situation" },
    violations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hazard: { type: Type.STRING },
          severity: { type: Type.STRING },
          category: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["hazard", "severity", "category", "recommendation"]
      }
    },
    ppeCheck: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          detected: { type: Type.BOOLEAN },
          compliant: { type: Type.BOOLEAN }
        },
        required: ["item", "detected", "compliant"]
      }
    },
    generalRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["score", "level", "summary", "violations", "ppeCheck", "generalRecommendations"]
};

export const analyzeSiteSafety = async (
  imageData: string,
  sector: IndustrySector,
  customGuidelines?: string
): Promise<SafetyAnalysis> => {
  const prompt = `
    Analyze this image of a ${sector} site for safety compliance.
    ${customGuidelines ? `Special Site Guidelines to follow: ${customGuidelines}` : `Use industry standard safety protocols for ${sector}.`}
    
    Check for:
    1. Proper use of PPE (hard hats, high-vis vests, eyewear, boots).
    2. Environmental hazards (tripping hazards, unstable structures, spills).
    3. Machine safety (guards, proper operation).
    4. Fire safety (extinguishers visible, clear exits).
    5. Fall protection (harnesses, guardrails).

    Return the analysis in a strictly structured JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData.split(',')[1] // Strip prefix
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    }
  });

  return JSON.parse(response.text || '{}') as SafetyAnalysis;
};
