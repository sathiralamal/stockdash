import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, name, price, change, changePercent }) => {
  const isPositive = change >= 0;
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/stock/${symbol}`)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{symbol}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{name}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium ${
          isPositive 
            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
        }`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{Math.abs(changePercent).toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          ${price.toFixed(2)}
        </span>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default StockCard;
