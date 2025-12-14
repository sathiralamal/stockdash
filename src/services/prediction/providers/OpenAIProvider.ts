import axios from 'axios';
import type { IPredictionProvider } from '../interfaces';

export class OpenAIProvider implements IPredictionProvider {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async getPrediction(symbol: string, currentPrice: number, history?: string): Promise<string> {
    if (!this.apiKey) {
      return 'Configuration Error: VITE_OPENAI_API_KEY is missing.';
    }

    const messages = [
      { role: "system", content: "You are a helpful financial analyst." },
      { role: "user", content: `Analyze ${symbol} at $${currentPrice}. ${history || ''}. Give a short next-week outlook.` }
    ];

    try {
      const response = await axios.post(this.baseUrl, {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content || 'No specific forecast.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'Failed to fetch AI prediction from OpenAI.';
    }
  }
}
