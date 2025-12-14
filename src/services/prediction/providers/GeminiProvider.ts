import axios from 'axios';
import type { IPredictionProvider } from '../interfaces';

export class GeminiProvider implements IPredictionProvider {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async getPrediction(symbol: string, currentPrice: number, history?: string): Promise<string> {
    if (!this.apiKey) {
      return 'Configuration Error: VITE_GEMINI_API_KEY is missing.';
    }

    const prompt = `
      You are a financial analyst AI.
      Analyze the stock ${symbol} currently trading at ${currentPrice}.
      
      ${history ? `Recent market context: ${history}` : ''}
      
      Please provide a concise "Next Week Outlook" prediction.
      Focus on potential trends (Bullish/Bearish/Neutral) and 1 key reason why.
      Keep it short (max 3 sentences).
    `;

    try {
      const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || 'No prediction tailored by Gemini.';
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'Failed to fetch AI prediction from Gemini.';
    }
  }
}
