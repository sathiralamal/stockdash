import type { StockProfile, StockQuote, StockCandle, SymbolSearchResponse } from './types';

export interface IDataProvider {
  searchSymbols(query: string): Promise<SymbolResult[]>;
  getStockDetails(symbol: string): Promise<StockProfile>;
  getStockQuote(symbol: string): Promise<StockQuote>;
  getStockCandles(symbol: string, resolution: string, from: number, to: number): Promise<StockCandle>;
}

export type SymbolResult = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};
