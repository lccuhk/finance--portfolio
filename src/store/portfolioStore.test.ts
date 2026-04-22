import { describe, it, expect } from 'vitest';
import { useTestPortfolioStore } from './portfolioStore';

describe('Portfolio Store', () => {
  it('should initialize with empty portfolios', () => {
    const store = useTestPortfolioStore.getState();
    expect(store.savedPortfolios).toHaveLength(0);
    expect(store.sortType).toBe('time');
  });

  it('should save a portfolio', () => {
    const store = useTestPortfolioStore.getState();
    
    store.savePortfolio({
      name: '测试方案',
      assetRange: '100k_500k',
      assetRangeLabel: '10-50万',
      riskType: 'balanced',
      riskTypeLabel: '平衡型',
      portfolioName: '平衡配置方案',
      expectedReturnMin: 5,
      expectedReturnMax: 10,
      maxDrawdown: 15,
      allocationDetails: [],
    });

    // Re-fetch state after save
    const updatedStore = useTestPortfolioStore.getState();
    expect(updatedStore.savedPortfolios).toHaveLength(1);
    expect(updatedStore.savedPortfolios[0].name).toBe('测试方案');
  });

  it('should sort portfolios by time', () => {
    const store = useTestPortfolioStore.getState();
    
    // Clear and add test data
    useTestPortfolioStore.setState({ savedPortfolios: [], sortType: 'time' });
    
    store.savePortfolio({
      name: '旧方案',
      assetRange: 'under_100k',
      assetRangeLabel: '10万以下',
      riskType: 'conservative',
      riskTypeLabel: '保守型',
      portfolioName: '保守配置',
      expectedReturnMin: 3,
      expectedReturnMax: 6,
      maxDrawdown: 8,
      allocationDetails: [],
    });

    store.savePortfolio({
      name: '新方案',
      assetRange: '100k_500k',
      assetRangeLabel: '10-50万',
      riskType: 'balanced',
      riskTypeLabel: '平衡型',
      portfolioName: '平衡配置',
      expectedReturnMin: 5,
      expectedReturnMax: 10,
      maxDrawdown: 15,
      allocationDetails: [],
    });

    const currentStore = useTestPortfolioStore.getState();
    const sorted = currentStore.getSortedPortfolios();
    
    expect(sorted[0].name).toBe('新方案');
    expect(sorted[1].name).toBe('旧方案');
  });

  it('should sort portfolios by return', () => {
    const store = useTestPortfolioStore.getState();
    
    // Clear and add test data
    useTestPortfolioStore.setState({ savedPortfolios: [], sortType: 'return' });
    
    store.savePortfolio({
      name: '低收益',
      assetRange: 'under_100k',
      assetRangeLabel: '10万以下',
      riskType: 'conservative',
      riskTypeLabel: '保守型',
      portfolioName: '保守配置',
      expectedReturnMin: 2,
      expectedReturnMax: 4,
      maxDrawdown: 5,
      allocationDetails: [],
    });

    store.savePortfolio({
      name: '高收益',
      assetRange: '500k_1m',
      assetRangeLabel: '50-100万',
      riskType: 'aggressive',
      riskTypeLabel: '进取型',
      portfolioName: '进取配置',
      expectedReturnMin: 15,
      expectedReturnMax: 25,
      maxDrawdown: 30,
      allocationDetails: [],
    });

    const currentStore = useTestPortfolioStore.getState();
    const sorted = currentStore.getSortedPortfolios();
    
    expect(sorted[0].name).toBe('高收益');
    expect(sorted[1].name).toBe('低收益');
  });
});
