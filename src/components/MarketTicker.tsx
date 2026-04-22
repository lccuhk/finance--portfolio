import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Activity, Database, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import { getStockQuotes, type StockQuote, getApiStatus, setUseRealApi, resetApiErrorCount } from '@/services/marketData';

export default function MarketTicker() {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [apiStatus, setApiStatus] = useState({
    isUsingRealApi: true,
    errorCount: 0,
    lastError: null as string | null,
    switchReason: null as string | null,
  });

  const fetchData = useCallback(async () => {
    try {
      const data = await getStockQuotes();
      setStocks(data);
      setLastUpdate(new Date().toLocaleTimeString('zh-CN'));
      
      // 更新API状态
      const status = getApiStatus();
      setApiStatus({
        isUsingRealApi: status.isUsingRealApi,
        errorCount: status.errorCount,
        lastError: status.lastError,
        switchReason: status.switchReason,
      });
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      interval = setInterval(fetchData, 5000); // 每5秒自动刷新
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchData, isAutoRefresh]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const handleRetryRealApi = () => {
    resetApiErrorCount();
    setUseRealApi(true);
    setLoading(true);
    fetchData();
  };

  const realDataCount = stocks.filter(s => s.isRealData).length;
  const mockDataCount = stocks.length - realDataCount;

  if (loading && stocks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">实时行情</h3>
            <p className="text-xs text-slate-500">
              最后更新: {lastUpdate}
              {isAutoRefresh && <span className="ml-2 text-green-600">● 自动刷新中</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* API状态指示器 */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
            apiStatus.isUsingRealApi 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {apiStatus.isUsingRealApi ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>真实API</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3" />
                <span>模拟数据</span>
              </>
            )}
          </div>
          
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isAutoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isAutoRefresh ? '自动刷新: 开' : '自动刷新: 关'}
          </button>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* API状态警告 */}
      {!apiStatus.isUsingRealApi && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">
                当前使用模拟数据
                {apiStatus.switchReason && `（原因: ${apiStatus.switchReason}）`}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                错误次数: {apiStatus.errorCount} | 真实数据: {realDataCount}条 | 模拟数据: {mockDataCount}条
              </p>
              <button
                onClick={handleRetryRealApi}
                className="mt-2 text-xs text-amber-700 hover:text-amber-900 underline font-medium"
              >
                点击重试真实API
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stocks.slice(0, 10).map((stock) => (
          <div
            key={stock.symbol}
            className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors cursor-pointer group relative"
          >
            {/* 数据来源标识 */}
            <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
              stock.isRealData ? 'bg-green-500' : 'bg-amber-400'
            }`} title={stock.isRealData ? '真实数据' : '模拟数据'} />
            
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-600">{stock.name}</span>
              {stock.change >= 0 ? (
                <TrendingUp className="w-3 h-3 text-red-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-green-500" />
              )}
            </div>
            <div className="text-lg font-bold text-slate-900">
              ¥{stock.price.toFixed(2)}
            </div>
            <div
              className={`text-xs font-medium ${
                stock.change >= 0 ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>数据仅供参考，投资有风险</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              真实: {realDataCount}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              模拟: {mockDataCount}
            </span>
          </div>
          <span>更新频率: 5秒</span>
        </div>
      </div>
    </div>
  );
}
