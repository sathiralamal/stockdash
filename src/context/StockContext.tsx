import React, { createContext, useContext, useEffect, useState } from 'react';

interface StockContextType {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev;
      return [...prev, symbol];
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };

  return (
    <StockContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
