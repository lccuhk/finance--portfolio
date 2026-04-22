import { useState, useEffect, useCallback } from 'react';
import { Globe, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getForexQuotes, type ForexQuote } from '@/services/marketData';

export default function ForexTicker() {
  const [forex, setForex] = useState<ForexQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getForexQuotes();
      setForex(data);
      setLastUpdate(new Date().toLocaleTimeString('zh-CN'));
    } catch (error) {
      console.error('Failed to fetch forex data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // 每10秒自动刷新汇率数据
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const handleConvert = (pair: ForexQuote) => {
    setSelectedPair(pair.pair);
  };

  if (loading && forex.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">实时汇率</h3>
            <p className="text-xs text-slate-500">
              最后更新: {lastUpdate}
              <span className="ml-2 text-green-600">● 自动刷新中</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forex.map((pair) => (
          <div
            key={pair.pair}
            onClick={() => handleConvert(pair)}
            className={`bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-all cursor-pointer border-2 ${
              selectedPair === pair.pair ? 'border-green-500 bg-green-50' : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{pair.name}</span>
              <span className="text-xs text-slate-400">{pair.pair}</span>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {pair.rate.toFixed(4)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  1 {pair.pair.split('/')[0]} = {pair.rate.toFixed(4)} {pair.pair.split('/')[1]}
                </div>
              </div>
              
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  pair.change >= 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {pair.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {pair.change >= 0 ? '+' : ''}
                {pair.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Converter */}
      {selectedPair && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-3">快速换算</h4>
          <ForexConverter 
            pair={forex.find(f => f.pair === selectedPair)!} 
            onClose={() => setSelectedPair(null)}
          />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>汇率数据仅供参考，实际交易以银行牌价为准</span>
          <span>更新频率: 10秒</span>
        </div>
      </div>
    </div>
  );
}

// 汇率换算器组件
function ForexConverter({ pair, onClose }: { pair: ForexQuote; onClose: () => void }) {
  const [amount, setAmount] = useState<number>(100);
  const [direction, setDirection] = useState<'toCNY' | 'fromCNY'>('toCNY');
  
  const currencies = pair.pair.split('/');
  const foreignCurrency = currencies[0];
  const localCurrency = currencies[1];
  
  const result = direction === 'toCNY' 
    ? amount * pair.rate 
    : amount / pair.rate;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-green-700 mb-1 block">
            {direction === 'toCNY' ? foreignCurrency : localCurrency}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
        
        <button
          onClick={() => setDirection(direction === 'toCNY' ? 'fromCNY' : 'toCNY')}
          className="mt-5 p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
        >
          ⇄
        </button>
        
        <div className="flex-1">
          <label className="text-xs text-green-700 mb-1 block">
            {direction === 'toCNY' ? localCurrency : foreignCurrency}
          </label>
          <div className="px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-semibold text-slate-900">
            {result.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-green-600">
          汇率: 1 {foreignCurrency} = {pair.rate.toFixed(4)} {localCurrency}
        </span>
        <button
          onClick={onClose}
          className="text-xs text-green-700 hover:text-green-900 underline"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
