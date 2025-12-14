import React, { useEffect, useState } from 'react';
import { useStock } from '../context/StockContext';
import { getStockQuote, getStockDetails } from '../services/api';
import StockCard from '../components/StockCard';
import type { StockProfile, StockQuote } from '../services/types';

interface WatchlistItem {
  symbol: string;
  quote: StockQuote;
  profile: StockProfile;
}

const Dashboard: React.FC = () => {
  const { watchlist } = useStock();
  const [watchlistData, setWatchlistData] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (watchlist.length === 0) {
        setWatchlistData([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const promises = watchlist.map(async (symbol) => {
          const [quote, profile] = await Promise.all([
            getStockQuote(symbol),
            getStockDetails(symbol)
          ]);
          return { symbol, quote, profile };
        });
        
        const results = await Promise.all(promises);
        setWatchlistData(results);
      } catch (error) {
        console.error("Failed to fetch watchlist data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistData();
  }, [watchlist]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Watchlist</h1>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your watchlist is empty</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Search for stocks above to add them to your watchlist.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistData.map((item) => (
            <StockCard
              key={item.symbol}
              symbol={item.symbol}
              name={item.profile.name || item.symbol}
              price={item.quote.c}
              change={item.quote.d}
              changePercent={item.quote.dp}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
