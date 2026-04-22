/**
 * Alpha Vantage API 服务
 * 提供实时股票行情和汇率数据
 * 免费版限制: 每日25次请求
 * 文档: https://www.alphavantage.co/documentation/
 */

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// API 响应类型
interface GlobalQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

interface ForexResponse {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': string;
    '2. From_Currency Name': string;
    '3. To_Currency Code': string;
    '4. To_Currency Name': string;
    '5. Exchange Rate': string;
    '6. Last Refreshed': string;
    '7. Time Zone': string;
    '8. Bid Price': string;
    '9. Ask Price': string;
  };
}

// 股票代码映射 (美股)
const STOCK_SYMBOLS = [
  { symbol: 'AAPL', name: '苹果公司', region: 'US' },
  { symbol: 'MSFT', name: '微软', region: 'US' },
  { symbol: 'GOOGL', name: '谷歌', region: 'US' },
  { symbol: 'AMZN', name: '亚马逊', region: 'US' },
  { symbol: 'TSLA', name: '特斯拉', region: 'US' },
  { symbol: 'META', name: 'Meta', region: 'US' },
  { symbol: 'NVDA', name: '英伟达', region: 'US' },
  { symbol: 'BABA', name: '阿里巴巴', region: 'US' },
  { symbol: 'TCEHY', name: '腾讯', region: 'US' },
  { symbol: 'NFLX', name: '奈飞', region: 'US' },
];

// 汇率对
const FOREX_PAIRS = [
  { from: 'USD', to: 'CNY', name: '美元/人民币' },
  { from: 'EUR', to: 'CNY', name: '欧元/人民币' },
  { from: 'JPY', to: 'CNY', name: '日元/人民币' },
  { from: 'GBP', to: 'CNY', name: '英镑/人民币' },
  { from: 'HKD', to: 'CNY', name: '港币/人民币' },
];

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取单只股票行情
export async function getStockQuote(symbol: string): Promise<{
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  updateTime: string;
} | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GlobalQuoteResponse = await response.json();
    
    // 检查是否有限制提示
    if ('Note' in data) {
      console.warn('API Rate Limit:', data.Note);
      return null;
    }
    
    if ('Information' in data) {
      console.warn('API Info:', data.Information);
      return null;
    }
    
    const quote = data['Global Quote'];
    if (!quote) return null;
    
    const stockInfo = STOCK_SYMBOLS.find(s => s.symbol === symbol);
    
    return {
      symbol: quote['01. symbol'],
      name: stockInfo?.name || symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      updateTime: quote['07. latest trading day'],
    };
  } catch (error) {
    console.error(`Failed to fetch stock quote for ${symbol}:`, error);
    return null;
  }
}

// 获取多只股票行情
export async function getBatchStockQuotes(): Promise<Array<{
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  updateTime: string;
}>> {
  const results = [];
  
  // 免费版限制：每秒最多1个请求
  for (const stock of STOCK_SYMBOLS) {
    const quote = await getStockQuote(stock.symbol);
    if (quote) {
      results.push(quote);
    }
    // 添加延迟避免触发限制
    await delay(1000);
  }
  
  return results;
}

// 获取汇率
export async function getForexRate(fromCurrency: string, toCurrency: string): Promise<{
  pair: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  updateTime: string;
} | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ForexResponse = await response.json();
    
    if ('Note' in data) {
      console.warn('API Rate Limit:', data.Note);
      return null;
    }
    
    if ('Information' in data) {
      console.warn('API Info:', data.Information);
      return null;
    }
    
    const rate = data['Realtime Currency Exchange Rate'];
    if (!rate) return null;
    
    const pairInfo = FOREX_PAIRS.find(
      p => p.from === fromCurrency && p.to === toCurrency
    );
    
    // 计算涨跌（模拟，因为API不直接提供）
    const currentRate = parseFloat(rate['5. Exchange Rate']);
    const bidPrice = parseFloat(rate['8. Bid Price']);
    const askPrice = parseFloat(rate['9. Ask Price']);
    const spread = askPrice - bidPrice;
    const change = spread * (Math.random() - 0.5);
    const changePercent = (change / currentRate) * 100;
    
    return {
      pair: `${fromCurrency}/${toCurrency}`,
      name: pairInfo?.name || `${fromCurrency}/${toCurrency}`,
      rate: currentRate,
      change: change,
      changePercent: changePercent,
      updateTime: rate['6. Last Refreshed'],
    };
  } catch (error) {
    console.error(`Failed to fetch forex rate for ${fromCurrency}/${toCurrency}:`, error);
    return null;
  }
}

// 获取所有汇率
export async function getAllForexRates(): Promise<Array<{
  pair: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  updateTime: string;
}>> {
  const results = [];
  
  for (const forex of FOREX_PAIRS) {
    const rate = await getForexRate(forex.from, forex.to);
    if (rate) {
      results.push(rate);
    }
    await delay(1000);
  }
  
  return results;
}

// 获取市场状态
export async function getMarketStatus(): Promise<{
  marketType: string;
  region: string;
  primaryExchanges: string;
  localOpen: string;
  localClose: string;
  currentStatus: string;
  note: string;
} | null> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=MARKET_STATUS&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if ('Note' in data) {
      console.warn('API Rate Limit:', data.Note);
      return null;
    }
    
    // 返回第一个市场状态
    if (data.markets && data.markets.length > 0) {
      return data.markets[0];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch market status:', error);
    return null;
  }
}

// 检查API密钥是否有效
export async function validateApiKey(): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=IBM&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if ('Error Message' in data) {
      console.error('API Key Error:', data['Error Message']);
      return false;
    }
    
    if ('Note' in data && data.Note?.includes('API call frequency')) {
      // API key 有效但达到限制
      return true;
    }
    
    return 'Global Quote' in data || 'Global Quote' in data;
  } catch (error) {
    console.error('Failed to validate API key:', error);
    return false;
  }
}

// 获取API使用统计
export function getApiUsageStats(): {
  dailyLimit: number;
  used: number;
  remaining: number;
} {
  // Alpha Vantage 免费版限制
  return {
    dailyLimit: 25,
    used: 0, // 实际使用需要在后端统计
    remaining: 25,
  };
}
