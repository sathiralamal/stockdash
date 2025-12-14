import type { IPredictionProvider } from './interfaces';
import { GeminiProvider } from './providers/GeminiProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';

import { OllamaProvider } from './providers/OllamaProvider';

class MockProvider implements IPredictionProvider {
  async getPrediction(symbol: string, currentPrice: number): Promise<string> {
    return `[MOCK] Based on technical patterns, ${symbol} (currently $${currentPrice}) is showing consolidation. A breakout above resistance is possible next week. Please configure a valid AI Key to get real insights.`;
  }
}

export const getAIProvider = (): IPredictionProvider => {
  const provider = import.meta.env.VITE_AI_PROVIDER?.toLowerCase();

  switch (provider) {
    case 'gemini':
      return new GeminiProvider();
    case 'openai':
      return new OpenAIProvider();
    case 'ollama':
      return new OllamaProvider();
    default:
      console.log(`AI Provider '${provider}' not found or configured. Using Mock.`);
      return new MockProvider();
  }
};
