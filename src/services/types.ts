export interface StockProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

export interface StockCandle {
  c: number[]; // List of close prices
  h: number[]; // List of high prices
  l: number[]; // List of low prices
  o: number[]; // List of open prices
  s: string;   // Status of the response
  t: number[]; // List of timestamps
  v: number[]; // List of volume data
}

export interface SymbolResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface SymbolSearchResponse {
  count: number;
  result: SymbolResult[];
}
