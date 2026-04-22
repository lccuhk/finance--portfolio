import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedPortfolio } from '@/types';

export type SortType = 'time' | 'return';

interface PortfolioState {
  savedPortfolios: SavedPortfolio[];
  sortType: SortType;
  setSortType: (type: SortType) => void;
  getSortedPortfolios: () => SavedPortfolio[];
  savePortfolio: (portfolio: Omit<SavedPortfolio, 'id' | 'createdAt'>) => void;
  deletePortfolio: (id: string) => void;
  renamePortfolio: (id: string, newName: string) => void;
  loadPortfolio: (id: string) => SavedPortfolio | undefined;
  clearAllPortfolios: () => void;
}

const storeCreator = (set: (fn: (state: PortfolioState) => Partial<PortfolioState>) => void, get: () => PortfolioState): PortfolioState => ({
  savedPortfolios: [],
  sortType: 'time',

  setSortType: (type: SortType) => {
    set((state) => ({ ...state, sortType: type }));
    console.log('[排序切换] 排序方式已切换:', { sortType: type });
  },

  getSortedPortfolios: () => {
    const state = get();
    const portfolios = state.savedPortfolios;
    const sortType = state.sortType;
    const sorted = [...portfolios].sort((a, b) => {
      if (sortType === 'time') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const returnA = (a.expectedReturnMin + a.expectedReturnMax) / 2;
        const returnB = (b.expectedReturnMin + b.expectedReturnMax) / 2;
        return returnB - returnA;
      }
    });
    console.log('[排序结果] 方案已排序:', {
      sortType,
      count: sorted.length,
      firstItem: sorted[0]?.name,
    });
    return sorted;
  },

  savePortfolio: (portfolio: Omit<SavedPortfolio, 'id' | 'createdAt'>) => {
    const newPortfolio: SavedPortfolio = {
      ...portfolio,
      id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      ...state,
      savedPortfolios: [newPortfolio, ...state.savedPortfolios],
    }));
    console.log('[方案保存] 新方案已保存:', {
      id: newPortfolio.id,
      name: newPortfolio.name,
      timestamp: newPortfolio.createdAt,
    });
  },

  deletePortfolio: (id: string) => {
    set((state) => ({
      ...state,
      savedPortfolios: state.savedPortfolios.filter((p) => p.id !== id),
    }));
    console.log('[方案删除] 方案已删除:', { id });
  },

  renamePortfolio: (id: string, newName: string) => {
    set((state) => ({
      ...state,
      savedPortfolios: state.savedPortfolios.map((p) =>
        p.id === id ? { ...p, name: newName } : p
      ),
    }));
    console.log('[方案重命名] 方案已重命名:', { id, newName });
  },

  loadPortfolio: (id: string) => {
    const portfolio = get().savedPortfolios.find((p: SavedPortfolio) => p.id === id);
    console.log('[方案加载] 加载方案:', {
      id,
      found: !!portfolio,
      name: portfolio?.name,
    });
    return portfolio;
  },

  clearAllPortfolios: () => {
    set((state) => ({ ...state, savedPortfolios: [] }));
    console.log('[方案清空] 所有方案已清空');
  },
});

export const usePortfolioStore = create<PortfolioState>()(
  persist(storeCreator, {
    name: 'portfolio-storage',
    version: 1,
  })
);

export const useTestPortfolioStore = create<PortfolioState>(storeCreator);
