import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { StockCandle } from '../services/types';

interface StockChartProps {
  data: StockCandle;
  color?: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, color = '#3b82f6' }) => {
  // Format data for Recharts
  const chartData = data.t.map((timestamp, index) => ({
    time: new Date(timestamp * 1000).toLocaleDateString(),
    price: data.c[index],
  }));

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            cursor={{ stroke: '#9ca3af', strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
