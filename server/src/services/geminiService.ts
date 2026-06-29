import { GoogleGenAI } from '@google/genai';

export async function generateInsights(colors: {name: string, percentage: number}[], dominantColor: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY' || apiKey.trim() === '') {
    return null; // AI insights disabled if key is absent
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const colorSummary = colors.map(c => `${c.name}: ${c.percentage}%`).join(', ');
    const prompt = `Analyze this color distribution for an image and provide a very brief, natural-language insight (1-2 sentences). 
    Dominant Color: ${dominantColor}. 
    Colors: ${colorSummary}. 
    Example insight: "This image contains mostly blue tones suggesting outdoor scenery."`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text ? response.text.trim() : null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null; // Fallback to normal execution if AI fails
  }
}
