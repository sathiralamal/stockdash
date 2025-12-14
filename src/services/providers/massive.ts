import axios from 'axios';
import type { IDataProvider, SymbolResult } from '../interfaces';
import type { StockProfile, StockQuote, StockCandle } from '../types';

export class MassiveProvider implements IDataProvider {
  private client;

  constructor() {
    // Note: User can set MASSIVE_API_KEY in .env
    const API_KEY = import.meta.env.MASSIVE_API_KEY || '';
    this.client = axios.create({
      baseURL: 'https://massive.com/api/v1', // Placeholder base URL
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
  }

  async searchSymbols(query: string): Promise<SymbolResult[]> {
    if (!query) return [];
    try {
      // Placeholder implementation - adapt to actual Massive API structure
      // const response = await this.client.get('/search', { params: { q: query } });
      // return response.data.map(item => ...);
      console.warn('MassiveProvider: searchSymbols is using mock data');
      return []; 
    } catch (error) {
      console.error('Massive search error:', error);
      return [];
    }
  }

  async getStockDetails(symbol: string): Promise<StockProfile> {
    // Placeholder - replace with actual API call
    console.warn('MassiveProvider: getStockDetails is using mock data');
    return {
      name: symbol,
      ticker: symbol,
      logo: '',
      country: 'US',
      currency: 'USD',
      exchange: 'Massive Exchange',
      ipo: '2025-01-01',
      marketCapitalization: 0,
      phone: '',
      shareOutstanding: 0,
      weburl: '',
      finnhubIndustry: 'Technology',
    };
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    // Placeholder
    console.warn('MassiveProvider: getStockQuote is using mock data');
    return {
      c: 150.00,
      d: 2.50,
      dp: 1.69,
      h: 155.00,
      l: 148.00,
      o: 149.00,
      pc: 147.50,
    };
  }

  async getStockCandles(symbol: string, resolution: string, from: number, to: number): Promise<StockCandle> {
    console.warn('MassiveProvider: getStockCandles is using mock data because API docs are unavailable');
    // Generating dummy candle data for visualization if Massive API key is missing or endpoint is unknown
    const candles: StockCandle = {
      c: [], h: [], l: [], o: [], t: [], v: [], s: 'ok'
    };
    
    // Generate simple mock pattern
    const count = 30; 
    let price = 100;
    const timeStep = (to - from) / count;
    
    for (let i = 0; i < count; i++) {
        const time = Math.floor(from + i * timeStep);
        const change = (Math.random() - 0.5) * 5;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        
        candles.t.push(time);
        candles.o.push(open);
        candles.c.push(close);
        candles.h.push(high);
        candles.l.push(low);
        candles.v.push(Math.floor(Math.random() * 10000));
        
        price = close;
    }
    
    return candles;
  }
}
