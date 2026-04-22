/**
 * 市场数据服务
 * 优先使用 Alpha Vantage API，失败时回退到模拟数据
 */

import * as alphaVantage from './alphaVantageApi';

// 模拟数据（作为备用）
const MOCK_STOCKS = [
  { symbol: 'AAPL', name: '苹果公司', price: 198.50, change: 2.50, changePercent: 1.28, volume: 58942301 },
  { symbol: 'MSFT', name: '微软', price: 425.80, change: 3.20, changePercent: 0.76, volume: 22156890 },
  { symbol: 'GOOGL', name: '谷歌', price: 175.30, change: -1.20, changePercent: -0.68, volume: 18562340 },
  { symbol: 'AMZN', name: '亚马逊', price: 185.40, change: 2.80, changePercent: 1.53, volume: 35256890 },
  { symbol: 'TSLA', name: '特斯拉', price: 248.50, change: -5.20, changePercent: -2.05, volume: 98562340 },
  { symbol: 'META', name: 'Meta', price: 505.20, change: 8.50, changePercent: 1.71, volume: 15236890 },
  { symbol: 'NVDA', name: '英伟达', price: 892.10, change: 15.30, changePercent: 1.75, volume: 45236890 },
  { symbol: 'BABA', name: '阿里巴巴', price: 78.50, change: 1.20, changePercent: 1.55, volume: 12568900 },
  { symbol: 'TCEHY', name: '腾讯', price: 42.80, change: 0.50, changePercent: 1.18, volume: 8562300 },
  { symbol: 'NFLX', name: '奈飞', price: 628.90, change: -3.50, changePercent: -0.55, volume: 3256890 },
];

const MOCK_FOREX = [
  { pair: 'USD/CNY', name: '美元/人民币', rate: 7.2456, change: 0.0012, changePercent: 0.02 },
  { pair: 'EUR/CNY', name: '欧元/人民币', rate: 7.8234, change: -0.0089, changePercent: -0.11 },
  { pair: 'JPY/CNY', name: '日元/人民币', rate: 0.0482, change: 0.0001, changePercent: 0.21 },
  { pair: 'GBP/CNY', name: '英镑/人民币', rate: 9.1234, change: 0.0156, changePercent: 0.17 },
  { pair: 'HKD/CNY', name: '港币/人民币', rate: 0.9265, change: -0.0002, changePercent: -0.02 },
];

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  updateTime: string;
  isRealData: boolean;
}

export interface ForexQuote {
  pair: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  updateTime: string;
  isRealData: boolean;
}

export interface ApiStatus {
  isUsingRealApi: boolean;
  errorCount: number;
  lastError: string | null;
  lastErrorTime: string | null;
  isRateLimited: boolean;
  switchReason: string | null;
}

// 数据模式状态
let useRealApi = true;
let apiErrorCount = 0;
const MAX_API_ERRORS = 3;
let lastError: string | null = null;
let lastErrorTime: string | null = null;
let isRateLimited = false;
let switchReason: string | null = null;

// 获取API状态
export function getApiStatus(): ApiStatus {
  return {
    isUsingRealApi: useRealApi && apiErrorCount < MAX_API_ERRORS && !isRateLimited,
    errorCount: apiErrorCount,
    lastError,
    lastErrorTime,
    isRateLimited,
    switchReason,
  };
}

// 切换数据模式
export function setUseRealApi(value: boolean) {
  useRealApi = value;
  if (value) {
    // 切换回真实API时重置状态
    resetApiErrorCount();
    console.log('[API状态] 已手动切换至真实API模式');
  } else {
    switchReason = '手动切换';
    console.log('[API状态] 已手动切换至模拟数据模式');
  }
}

export function isUsingRealApi(): boolean {
  return useRealApi && apiErrorCount < MAX_API_ERRORS && !isRateLimited;
}

// 记录API错误
function recordApiError(error: unknown, context: string) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  apiErrorCount++;
  lastError = `[${context}] ${errorMessage}`;
  lastErrorTime = new Date().toLocaleString('zh-CN');
  
  console.warn(`[API错误] ${context}:`, errorMessage);
  console.warn(`[API状态] 当前错误次数: ${apiErrorCount}/${MAX_API_ERRORS}`);
  
  // 检查是否达到错误阈值
  if (apiErrorCount >= MAX_API_ERRORS) {
    switchReason = `连续${MAX_API_ERRORS}次API请求失败`;
    console.warn(`[API状态] ${switchReason}，已自动切换至模拟数据模式`);
  }
}

// 检查API响应是否包含限制信息
function checkApiLimitResponse(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false;
  
  const response = data as Record<string, unknown>;
  
  // 检查各种限制提示
  if ('Note' in response) {
    const note = String(response.Note);
    if (note.includes('API call frequency') || note.includes('rate limit')) {
      isRateLimited = true;
      switchReason = 'API频率限制（25次/天）';
      console.warn('[API状态] 已达到每日请求限制，已自动切换至模拟数据模式');
      return true;
    }
  }
  
  if ('Information' in response) {
    const info = String(response.Information);
    if (info.includes('API key') || info.includes('premium')) {
      switchReason = 'API Key无效或需要升级';
      console.warn('[API状态] API Key问题，已自动切换至模拟数据模式');
      return true;
    }
  }
  
  if ('Error Message' in response) {
    const errorMsg = String(response['Error Message']);
    if (errorMsg.includes('Invalid API call') || errorMsg.includes('apikey')) {
      switchReason = 'API调用参数错误';
      console.warn('[API状态] API调用错误，已自动切换至模拟数据模式');
      return true;
    }
  }
  
  return false;
}

// 重置API错误计数
export function resetApiErrorCount() {
  apiErrorCount = 0;
  lastError = null;
  lastErrorTime = null;
  isRateLimited = false;
  switchReason = null;
  console.log('[API状态] 错误计数已重置，将尝试使用真实API');
}

// 模拟数据更新
function simulatePriceChange(currentPrice: number, volatility: number = 0.02): number {
  const change = (Math.random() - 0.5) * volatility;
  return Number((currentPrice * (1 + change)).toFixed(2));
}

// 生成模拟股票数据
function generateMockStockData(): StockQuote[] {
  const now = new Date().toLocaleTimeString('zh-CN');
  
  console.log('[数据加载] 使用本地模拟数据（股票）');
  
  return MOCK_STOCKS.map(stock => {
    const newPrice = simulatePriceChange(stock.price, 0.005);
    const change = Number((newPrice - stock.price).toFixed(2));
    const changePercent = Number(((change / stock.price) * 100).toFixed(2));
    
    return {
      ...stock,
      price: newPrice,
      change,
      changePercent,
      updateTime: now,
      isRealData: false,
    };
  });
}

// 生成模拟汇率数据
function generateMockForexData(): ForexQuote[] {
  const now = new Date().toLocaleTimeString('zh-CN');
  
  console.log('[数据加载] 使用本地模拟数据（汇率）');
  
  return MOCK_FOREX.map(forex => {
    const newRate = simulatePriceChange(forex.rate, 0.001);
    const change = Number((newRate - forex.rate).toFixed(4));
    const changePercent = Number(((change / forex.rate) * 100).toFixed(2));
    
    return {
      ...forex,
      rate: newRate,
      change,
      changePercent,
      updateTime: now,
      isRealData: false,
    };
  });
}

// 获取实时股票行情（优先使用API，失败则回退到模拟数据）
export async function getStockQuotes(): Promise<StockQuote[]> {
  const now = new Date().toLocaleTimeString('zh-CN');
  
  // 检查是否应该使用真实API
  if (!useRealApi || apiErrorCount >= MAX_API_ERRORS || isRateLimited) {
    console.log(`[API状态] 当前模式: 模拟数据 (原因: ${switchReason || '手动设置'})`);
    return generateMockStockData();
  }
  
  try {
    console.log('[API请求] 正在获取真实股票数据...');
    const realData = await alphaVantage.getBatchStockQuotes();
    
    // 检查API响应是否包含限制信息
    if (Array.isArray(realData) && realData.length === 0) {
      console.warn('[API响应] 返回空数据，可能已达到限制');
      recordApiError(new Error('API返回空数据'), '股票数据获取');
      return generateMockStockData();
    }
    
    if (realData && realData.length > 0) {
      // 成功获取数据，重置错误计数
      apiErrorCount = 0;
      console.log(`[API成功] 获取到 ${realData.length} 条真实股票数据`);
      
      return realData.map(stock => ({
        ...stock,
        updateTime: stock.updateTime || now,
        isRealData: true,
      }));
    }
    
    // 数据为空，使用模拟数据
    recordApiError(new Error('API返回空数组'), '股票数据获取');
    return generateMockStockData();
    
  } catch (error) {
    recordApiError(error, '股票数据获取');
    return generateMockStockData();
  }
}

// 获取实时汇率（优先使用API，失败则回退到模拟数据）
export async function getForexQuotes(): Promise<ForexQuote[]> {
  const now = new Date().toLocaleTimeString('zh-CN');
  
  // 检查是否应该使用真实API
  if (!useRealApi || apiErrorCount >= MAX_API_ERRORS || isRateLimited) {
    console.log(`[API状态] 当前模式: 模拟数据 (原因: ${switchReason || '手动设置'})`);
    return generateMockForexData();
  }
  
  try {
    console.log('[API请求] 正在获取真实汇率数据...');
    const realData = await alphaVantage.getAllForexRates();
    
    if (Array.isArray(realData) && realData.length === 0) {
      console.warn('[API响应] 返回空数据，可能已达到限制');
      recordApiError(new Error('API返回空数据'), '汇率数据获取');
      return generateMockForexData();
    }
    
    if (realData && realData.length > 0) {
      apiErrorCount = 0;
      console.log(`[API成功] 获取到 ${realData.length} 条真实汇率数据`);
      
      return realData.map(forex => ({
        ...forex,
        updateTime: forex.updateTime || now,
        isRealData: true,
      }));
    }
    
    recordApiError(new Error('API返回空数组'), '汇率数据获取');
    return generateMockForexData();
    
  } catch (error) {
    recordApiError(error, '汇率数据获取');
    return generateMockForexData();
  }
}

// 获取单只股票详情
export async function getStockDetail(symbol: string): Promise<StockQuote | null> {
  // 检查是否应该使用真实API
  if (!useRealApi || apiErrorCount >= MAX_API_ERRORS || isRateLimited) {
    console.log('[API状态] 使用模拟数据模式');
    
    // 从模拟数据中查找
    const mockStock = MOCK_STOCKS.find(s => s.symbol === symbol);
    if (mockStock) {
      const now = new Date().toLocaleTimeString('zh-CN');
      const newPrice = simulatePriceChange(mockStock.price, 0.005);
      const change = Number((newPrice - mockStock.price).toFixed(2));
      const changePercent = Number(((change / mockStock.price) * 100).toFixed(2));
      
      return {
        ...mockStock,
        price: newPrice,
        change,
        changePercent,
        updateTime: now,
        isRealData: false,
      };
    }
    return null;
  }
  
  try {
    console.log(`[API请求] 正在获取 ${symbol} 的真实数据...`);
    const realData = await alphaVantage.getStockQuote(symbol);
    
    if (realData) {
      apiErrorCount = 0;
      console.log(`[API成功] 获取到 ${symbol} 的真实数据`);
      return {
        ...realData,
        isRealData: true,
      };
    }
    
    recordApiError(new Error('API返回null'), `股票详情获取(${symbol})`);
    return null;
    
  } catch (error) {
    recordApiError(error, `股票详情获取(${symbol})`);
    
    // 从模拟数据中查找
    const mockStock = MOCK_STOCKS.find(s => s.symbol === symbol);
    if (mockStock) {
      const now = new Date().toLocaleTimeString('zh-CN');
      const newPrice = simulatePriceChange(mockStock.price, 0.005);
      const change = Number((newPrice - mockStock.price).toFixed(2));
      const changePercent = Number(((change / mockStock.price) * 100).toFixed(2));
      
      return {
        ...mockStock,
        price: newPrice,
        change,
        changePercent,
        updateTime: now,
        isRealData: false,
      };
    }
    
    return null;
  }
}

// 获取市场概览数据
export async function getMarketOverview() {
  const [stocks, forex] = await Promise.all([
    getStockQuotes(),
    getForexQuotes(),
  ]);
  
  const upStocks = stocks.filter(s => s.change > 0).length;
  const downStocks = stocks.filter(s => s.change < 0).length;
  const realDataCount = stocks.filter(s => s.isRealData).length;
  const mockDataCount = stocks.length - realDataCount;
  
  const status = getApiStatus();
  
  console.log('[市场概览]', {
    总股票数: stocks.length,
    真实数据: realDataCount,
    模拟数据: mockDataCount,
    上涨: upStocks,
    下跌: downStocks,
    API状态: status.isUsingRealApi ? '真实API' : '模拟数据',
    切换原因: status.switchReason,
  });
  
  return {
    stocks,
    forex,
    statistics: {
      upStocks,
      downStocks,
      totalStocks: stocks.length,
      realDataCount,
      mockDataCount,
      updateTime: new Date().toLocaleString('zh-CN'),
      isUsingRealApi: status.isUsingRealApi,
      switchReason: status.switchReason,
    },
  };
}

// 验证API密钥
export async function validateApiKey(): Promise<boolean> {
  try {
    const isValid = await alphaVantage.validateApiKey();
    if (isValid) {
      console.log('[API验证] API Key 有效');
    } else {
      console.warn('[API验证] API Key 无效');
    }
    return isValid;
  } catch (error) {
    console.error('[API验证] 验证失败:', error);
    return false;
  }
}

// 获取API使用统计
export function getApiUsageStats() {
  return alphaVantage.getApiUsageStats();
}
