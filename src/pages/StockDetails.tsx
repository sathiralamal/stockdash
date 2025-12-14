import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStockCandles, getStockDetails, getStockQuote } from '../services/api';
import type { StockProfile, StockQuote, StockCandle } from '../services/types';
import StockChart from '../components/StockChart';
import { useStock } from '../context/StockContext';
import { Star, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const StockDetails: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [profile, setProfile] = useState<StockProfile | null>(null);
  const [candles, setCandles] = useState<StockCandle | null>(null);
  const [timeRange, setTimeRange] = useState('M'); // Default to M (Daily) for free tier compatibility
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStock();

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const now = Math.floor(Date.now() / 1000);
        let from = now - 30 * 24 * 60 * 60; // Default 1 month
        let resolution = 'D'; // Default Daily

        // Adjust validation based on timeRange
        if (timeRange === 'D') {
            from = now - 24 * 60 * 60;
            resolution = '15'; // Might fail on free tier
        } else if (timeRange === 'W') {
            from = now - 7 * 24 * 60 * 60;
            resolution = '60';
        } else if (timeRange === 'M') {
            from = now - 30 * 24 * 60 * 60;
            resolution = 'D';
        }

        const [quoteData, profileData, candleData] = await Promise.all([
          getStockQuote(symbol),
          getStockDetails(symbol),
          getStockCandles(symbol, resolution, from, now)
        ]);

        setQuote(quoteData);
        setProfile(profileData);
        
        if (candleData.s === 'no_data') {
            setCandles(null);
        } else {
            setCandles(candleData);
        }
        setError(null);
      } catch (err: any) {
        console.error("Error fetching stock details", err);
        if (err.response && err.response.status === 403) {
            setError("Premium data required for this resolution.");
        } else {
            setError("Failed to load stock data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeRange]);

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  if (!quote || !symbol) {
    return <div className="text-center py-10">Stock not found</div>;
  }

  const inWatchlist = isInWatchlist(symbol);
  const isPositive = quote.d >= 0;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
                {profile?.logo && <img src={profile.logo} alt={profile.name} className="w-16 h-16 rounded-lg object-contain bg-white border border-gray-100" />}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{profile?.name || symbol}</h1>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">{symbol}</span>
                        <span>•</span>
                        <span>{profile?.exchange}</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => inWatchlist ? removeFromWatchlist(symbol) : addToWatchlist(symbol)}
                className={`p-3 rounded-full transition-colors ${inWatchlist ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900/30' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
                <Star className={inWatchlist ? "fill-current" : ""} />
            </button>
        </div>

        <div className="mt-6 flex items-end gap-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">${quote.c}</span>
            <div className={`flex items-center gap-1 text-lg font-medium mb-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span>{quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)</span>
            </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Price History</h2>
            <div className="flex gap-2">
                {['D', 'W', 'M'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                        {range === 'D' ? '1D' : range === 'W' ? '1W' : '1M'}
                    </button>
                ))}
            </div>
        </div>

        {error ? (
            <div className="h-64 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p>{error} (Try '1M' view)</p>
            </div>
        ) : candles ? (
            <StockChart data={candles} color={isPositive ? '#10b981' : '#ef4444'} />
        ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
                No chart data available
            </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<DollarSign className="text-blue-500" />} label="Market Cap" value={profile?.marketCapitalization ? `${(profile.marketCapitalization / 1000).toFixed(2)}B` : 'N/A'} />
          <StatCard icon={<Activity className="text-purple-500" />} label="Open Price" value={`$${quote.o}`} />
          <StatCard icon={<TrendingUp className="text-green-500" />} label="High Price" value={`$${quote.h}`} />
          <StatCard icon={<TrendingDown className="text-red-500" />} label="Low Price" value={`$${quote.l}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">About {profile?.name}</h3>
            <div className="space-y-3">
                <InfoRow label="Industry" value={profile?.finnhubIndustry} />
                <InfoRow label="Country" value={profile?.country} />
                <InfoRow label="IPO Date" value={profile?.ipo} />
                <InfoRow label="Website" value={profile?.weburl ? <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profile.weburl}</a> : 'N/A'} />
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const InfoRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
);

export default StockDetails;
