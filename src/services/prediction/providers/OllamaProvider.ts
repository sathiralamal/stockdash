import axios from 'axios';
import type { IPredictionProvider } from '../interfaces';

export class OllamaProvider implements IPredictionProvider {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434';
    // Default to a common model, but this could also be configurable
    this.model = import.meta.env.VITE_OLLAMA_MODEL || 'llama3'; 
  }

  async getPrediction(symbol: string, currentPrice: number, history?: string): Promise<string> {
    const prompt = `
      You are a financial analyst AI.
      Analyze the stock ${symbol} currently trading at ${currentPrice}.
      ${history || ''}
      Please provide a concise "Next Week Outlook".
      Focus on potential trends (Bullish/Bearish/Neutral) and 1 key reason why.
      Keep it short (max 3 sentences). Do not start with "Here is the outlook".
    `;

    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false
      });

      return response.data.response || 'No prediction tailored by Ollama.';
    } catch (error) {
      console.error('Ollama API Error:', error);
      return 'Failed to fetch AI prediction from Ollama. Ensure Ollama is running.';
    }
  }
}
