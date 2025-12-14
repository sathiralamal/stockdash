import axios from 'axios';
import type { IDataProvider, SymbolResult } from '../interfaces';
import type { StockProfile, StockQuote, StockCandle, SymbolSearchResponse } from '../types';

export class FinnhubProvider implements IDataProvider {
  private client;

  constructor() {
    const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || 'demo';
    this.client = axios.create({
      baseURL: 'https://finnhub.io/api/v1',
      params: {
        token: API_KEY,
      },
    });
  }

  async searchSymbols(query: string): Promise<SymbolResult[]> {
    if (!query) return [];
    try {
      const response = await this.client.get<SymbolSearchResponse>('/search', { params: { q: query } });
      return response.data.result;
    } catch (error) {
      console.error('Finnhub search error:', error);
      return [];
    }
  }

  async getStockDetails(symbol: string): Promise<StockProfile> {
    const response = await this.client.get<StockProfile>('/stock/profile2', { params: { symbol } });
    return response.data;
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    const response = await this.client.get<StockQuote>('/quote', { params: { symbol } });
    return response.data;
  }

  async getStockCandles(symbol: string, resolution: string, from: number, to: number): Promise<StockCandle> {
    const response = await this.client.get<StockCandle>('/stock/candle', {
      params: { symbol, resolution, from, to },
    });
    return response.data;
  }
}
