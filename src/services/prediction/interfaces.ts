export interface IPredictionProvider {
  /**
   * Generates a "Next Week" outlook based on market data.
   * @param symbol The stock symbol (e.g., AAPL).
   * @param currentPrice The current stock price.
   * @param history Optional historical context or recent news summary.
   * @returns A string containing the AI's analysis and prediction.
   */
  getPrediction(symbol: string, currentPrice: number, history?: string): Promise<string>;
}

export interface MathPredictionResult {
  nextDay: {
    price: number;
    confidence: 'Low' | 'Medium' | 'High';
    trend: 'Up' | 'Down' | 'Neutral';
  };
  levels: {
    buy: number;
    sell: number;
    stopLoss: number;
  };
  method: string;
}
