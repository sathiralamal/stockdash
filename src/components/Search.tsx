import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { searchSymbols } from '../services/api';
import type { SymbolResult } from '../services/types';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SymbolResult[]>([]);
  // const [isLoading, setIsLoading] = useState(false); // Unused for now
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSymbols = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      // setIsLoading(true);
      try {
        const response = await searchSymbols(debouncedQuery);
        setResults(response.result);
      } catch (error) {
        console.error("Failed to search symbols", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchSymbols();
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const handleSelectSymbol = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    clearSearch();
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-50">
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Results */}
      {results.length > 0 && query.length >= 2 && (
        <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
          {results.map((item) => (
            <li
              key={item.symbol}
              onClick={() => handleSelectSymbol(item.symbol)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors border-b last:border-b-0 border-gray-100 dark:border-gray-700"
            >
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{item.symbol}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] inline-block align-bottom">
                  {item.description}
                </span>
              </div>
              <span className="text-xs text-gray-400 uppercase border border-gray-200 dark:border-gray-600 px-1 rounded">{item.type}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Loading state can be added here if desired */}
    </div>
  );
};

export default Search;
