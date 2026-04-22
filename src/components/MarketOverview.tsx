import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Globe } from 'lucide-react';

interface IndexData {
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  updateTime: string;
}

// 模拟大盘指数数据
const MOCK_INDICES: IndexData[] = [
  { name: '上证指数', code: '000001', price: 3052.34, change: 12.56, changePercent: 0.41, volume: '3421亿', updateTime: '15:00:00' },
  { name: '深证成指', code: '399001', price: 9788.65, change: -23.45, changePercent: -0.24, volume: '4521亿', updateTime: '15:00:00' },
  { name: '创业板指', code: '399006', price: 1923.78, change: 8.92, changePercent: 0.46, volume: '2134亿', updateTime: '15:00:00' },
  { name: '科创50', code: '000688', price: 823.45, change: -5.67, changePercent: -0.68, volume: '567亿', updateTime: '15:00:00' },
  { name: '沪深300', code: '000300', price: 3567.89, change: 15.23, changePercent: 0.43, volume: '2341亿', updateTime: '15:00:00' },
  { name: '中证500', code: '000905', price: 5234.56, change: -12.34, changePercent: -0.24, volume: '1876亿', updateTime: '15:00:00' },
];

export default function MarketOverview() {
  const [indices, setIndices] = useState<IndexData[]>(MOCK_INDICES);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // 模拟数据更新
    const updateData = () => {
      setIndices(prev => prev.map(index => {
        const change = (Math.random() - 0.5) * 10;
        const newPrice = index.price + change;
        const changePercent = (change / index.price) * 100;
        return {
          ...index,
          price: newPrice,
          change: change,
          changePercent: changePercent,
          updateTime: new Date().toLocaleTimeString('zh-CN'),
        };
      }));
      setLastUpdate(new Date().toLocaleTimeString('zh-CN'));
    };

    updateData();
    const interval = setInterval(updateData, 5000); // 每5秒更新

    return () => clearInterval(interval);
  }, []);

  const upCount = indices.filter(i => i.change > 0).length;
  const downCount = indices.filter(i => i.change < 0).length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">市场概览</h3>
            <p className="text-xs text-slate-500">A股主要指数实时行情</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            上涨 {upCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            下跌 {downCount}
          </span>
          <span className="text-slate-400">更新: {lastUpdate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {indices.map((index) => (
          <div
            key={index.code}
            className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-semibold text-slate-900">{index.name}</span>
                <span className="text-xs text-slate-400 ml-2">{index.code}</span>
              </div>
              {index.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xl font-bold text-slate-900">
                  {index.price.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  成交量: {index.volume}
                </div>
              </div>
              
              <div
                className={`text-right ${
                  index.change >= 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                <div className="text-sm font-medium">
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                </div>
                <div className="text-xs">
                  {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
            
            {/* 迷你走势图 */}
            <div className="mt-3 h-8 flex items-end gap-0.5">
              {Array.from({ length: 20 }).map((_, i) => {
                const height = Math.random() * 100;
                const isUp = Math.random() > 0.5;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      isUp ? 'bg-red-400' : 'bg-green-400'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>数据仅供参考，投资有风险</span>
          <span>更新频率: 5秒</span>
        </div>
      </div>
    </div>
  );
}
