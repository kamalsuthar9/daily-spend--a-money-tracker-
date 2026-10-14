
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, LeakInsight } from "../types";

export const analyzeExpenses = async (expenses: Expense[]): Promise<LeakInsight[]> => {
  if (expenses.length < 3) {
    return [{
      type: 'info',
      title: 'Not enough data',
      message: 'Add more expenses for AI-powered leak detection.'
    }];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze the following expense history for "money leaks" (repetitive small expenses, unnecessary subscriptions, or high category spending). 
  Return exactly 3 insights in JSON format.
  
  Expenses: ${JSON.stringify(expenses)}
  
  Focus on:
  1. Repetitive small transactions (e.g. coffee, snacks).
  2. Subscriptions that seem redundant.
  3. Sharp increases in specific categories.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Must be 'leak', 'warning', or 'info'" },
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              potentialSaving: { type: Type.NUMBER }
            },
            required: ["type", "title", "message"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as LeakInsight[];
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [{
      type: 'warning',
      title: 'Analysis Offline',
      message: 'Could not connect to AI advisor. Check your logs.'
    }];
  }
};
