import type { StockCandle } from '../types';
import type { MathPredictionResult } from './interfaces';

/**
 * Calculates Standard Pivot Points.
 * P = (High + Low + Close) / 3
 * Support 1 (S1) = (P * 2) - High
 * Resistance 1 (R1) = (P * 2) - Low
 */
export const calculatePivotPoints = (high: number, low: number, close: number) => {
  const p = (high + low + close) / 3;
  const s1 = (p * 2) - high;
  const r1 = (p * 2) - low;
  const s2 = p - (high - low);
  const r2 = p + (high - low);
  
  return { p, s1, r1, s2, r2 };
};

/**
 * Calculates Simple Moving Average (SMA).
 */
export const calculateSMA = (data: number[], window: number): number | null => {
  if (data.length < window) return null;
  const slice = data.slice(-window);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / window;
};

/**
 * Generates mathematical predictions based on historical candles.
 * Uses Pivot Points for Buy/Sell levels and SMA Slope for Next Day Trend.
 */
export const calculateMathPrediction = (candles: StockCandle): MathPredictionResult => {
  console.log('mathUtils: Calculating prediction with', candles.c.length, 'candles');
  const len = candles.c.length;
  if (len < 5) {
    // Fallback if not enough data
    const lastPrice = candles.c[len - 1] || 0;
    return {
      nextDay: { price: lastPrice, confidence: 'Low', trend: 'Neutral' },
      levels: { buy: lastPrice * 0.95, sell: lastPrice * 1.05, stopLoss: lastPrice * 0.90 },
      method: 'Insufficient Data Fallback'
    };
  }

  // Last completed day data (assuming the last candle might be incomplete if it's today, but we use it as "yesterday" reference for tomorrow)
  const lastClose = candles.c[len - 1];
  const lastHigh = candles.h[len - 1];
  const lastLow = candles.l[len - 1];

  // 1. Pivot Points for Buy/Sell Levels
  const { s1, r1 } = calculatePivotPoints(lastHigh, lastLow, lastClose);

  // 2. Trend Analysis (SMA 5) for Next Day Projection
  const closes = candles.c;
  const sma5Current = calculateSMA(closes, 5);
  const sma5Prev = calculateSMA(closes.slice(0, -1), 5);

  let trend: 'Up' | 'Down' | 'Neutral' = 'Neutral';
  let predictedChange = 0;

  if (sma5Current && sma5Prev) {
    const slope = sma5Current - sma5Prev;
    // Simple linear extrapolation: assume the momentum continues for one day
    predictedChange = slope; 
    
    if (slope > 0.05) trend = 'Up';
    else if (slope < -0.05) trend = 'Down';
  }

  const nextDayPrice = lastClose + predictedChange;

  return {
    nextDay: {
      price: parseFloat(nextDayPrice.toFixed(2)),
      confidence: 'Medium', // Math is deterministic but markets are not
      trend,
    },
    levels: {
      buy: parseFloat(s1.toFixed(2)), // Good entry at Support 1
      sell: parseFloat(r1.toFixed(2)), // Good exit at Resistance 1
      stopLoss: parseFloat((s1 * 0.98).toFixed(2)), // 2% below Support
    },
    method: 'Pivot Points & SMA Extrapolation'
  };
};
