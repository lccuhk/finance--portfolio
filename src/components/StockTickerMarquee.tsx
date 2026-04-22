import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getStockQuotes, type StockQuote } from '@/services/marketData';

export default function StockTickerMarquee() {
  const [stocks, setStocks] = useState<StockQuote[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStockQuotes();
      setStocks(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 每10秒更新

    return () => clearInterval(interval);
  }, []);

  // 复制数据以实现无缝滚动
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border-y border-slate-700/50 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicatedStocks.map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="inline-flex items-center gap-2 px-6 py-3 border-r border-slate-700/50"
          >
            <span className="text-slate-300 font-medium">{stock.name}</span>
            <span className="text-white font-bold">{stock.price.toFixed(2)}</span>
            <div
              className={`flex items-center gap-1 text-sm ${
                stock.change >= 0 ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {stock.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {stock.change >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
