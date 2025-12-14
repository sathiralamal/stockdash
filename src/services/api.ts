import type { IDataProvider, SymbolResult } from './interfaces';
import { FinnhubProvider } from './providers/finnhub';
import { MassiveProvider } from './providers/massive';
import type { StockProfile, StockQuote, StockCandle } from './types';

// Factory to get provider instance
const getProvider = (providerName: string): IDataProvider => {
  switch (providerName?.toLowerCase()) {
    case 'massive':
      return new MassiveProvider();
    case 'finnhub':
    default:
      return new FinnhubProvider();
  }
};

// Providers for different services
const searchProvider = getProvider(import.meta.env.VITE_SEARCH_PROVIDER || 'finnhub');
const quoteProvider = getProvider(import.meta.env.VITE_QUOTE_PROVIDER || 'finnhub');
const candleProvider = getProvider(import.meta.env.VITE_CANDLE_PROVIDER || 'finnhub');

// Exported standard functions used by the app across components
export const searchSymbols = async (query: string): Promise<{ count: number; result: SymbolResult[] }> => {
  const result = await searchProvider.searchSymbols(query);
  return { count: result.length, result };
};

export const getStockDetails = async (symbol: string): Promise<StockProfile> => {
  return await quoteProvider.getStockDetails(symbol);
};

export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  return await quoteProvider.getStockQuote(symbol);
};

export const getStockCandles = async (symbol: string, resolution: string, from: number, to: number): Promise<StockCandle> => {
  return await candleProvider.getStockCandles(symbol, resolution, from, to);
};
