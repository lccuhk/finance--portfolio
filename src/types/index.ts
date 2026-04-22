export interface Product {
  id: string;
  name: string;
  code: string;
  type: 'stock' | 'fund' | 'futures' | 'bond' | 'options' | 'forex';
  riskLevel: 1 | 2 | 3 | 4 | 5;
  minInvestment: number;
  expectedReturn: number;
  feeStructure: {
    managementFee?: number;
    subscriptionFee?: number;
    redemptionFee?: number;
  };
  description: string;
  historicalData?: {
    date: string;
    value: number;
  }[];
  suitableFor: string[];
}

export interface AllocationItem {
  name: string;
  category: 'stock' | 'fund' | 'bond' | 'futures' | 'options' | 'forex' | 'cash';
  ratio: number;
  expectedReturn: number;
  riskLevel: number;
  description: string;
  products?: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  assetRange: 'under_100k' | '100k_500k' | '500k_1m' | '1m_5m' | 'above_5m';
  riskType: 'conservative' | 'steady' | 'balanced' | 'aggressive' | 'radical';
  stockRatio: number;
  fundRatio: number;
  bondRatio: number;
  futuresRatio: number;
  optionsRatio: number;
  forexRatio: number;
  cashRatio: number;
  expectedReturnMin: number;
  expectedReturnMax: number;
  maxDrawdown: number;
  allocationDetails: AllocationItem[];
  rebalancingPeriod: string;
  investmentHorizon: string;
  rationale: string;
}

export interface AssetRange {
  value: string;
  label: string;
  min: number;
  max: number | null;
}

export interface RiskType {
  value: string;
  label: string;
  description: string;
}

export interface CalculatorInput {
  amount: number;
  years: number;
  productType: string;
  expectedReturn: number;
}

export interface CalculatorResult {
  totalAmount: number;
  totalInterest: number;
  yearlyData: {
    year: number;
    principal: number;
    interest: number;
    total: number;
  }[];
}

export interface GuideStep {
  title: string;
  description: string;
  tips?: string[];
}

export interface ProductGuide {
  type: string;
  name: string;
  description: string;
  steps: GuideStep[];
  fees: {
    name: string;
    rate: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface SavedPortfolio {
  id: string;
  name: string;
  createdAt: string;
  assetRange: string;
  assetRangeLabel: string;
  riskType: string;
  riskTypeLabel: string;
  portfolioName: string;
  expectedReturnMin: number;
  expectedReturnMax: number;
  maxDrawdown: number;
  allocationDetails: AllocationItem[];
}
