import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeHistoricalText(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: text,
    config: {
      systemInstruction: `Analiziraj sljedeći povijesni tekst o Domovinskom ratu u Hrvatskoj. 
Identificiraj ključne političke aktere (pojedince, vlade, međunarodne organizacije) i kategoriziraj njihove međusobne odnose (diplomacija, sukob, sporazum). 
Odgovor vrati isključivo u JSON formatu. 
Polje 'type' za aktere mora biti jedan od: 'Individual', 'Government', 'InternationalOrganization', 'Other'. 
Polje 'type' za odnose mora biti jedan od: 'Diplomacy', 'Conflict', 'Agreement', 'Other'.
Opisi bi trebali biti na hrvatskom jeziku.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          actors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Individual', 'Government', 'InternationalOrganization', 'Other'] },
                description: { type: Type.STRING }
              },
              required: ['id', 'name', 'type']
            }
          },
          relations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Diplomacy', 'Conflict', 'Agreement', 'Other'] },
                description: { type: Type.STRING }
              },
              required: ['source', 'target', 'type']
            }
          }
        },
        required: ['actors', 'relations']
      }
    }
  });

  const analysisResult = JSON.parse(response.text || '{}') as AnalysisResult;
  return analysisResult;
}
