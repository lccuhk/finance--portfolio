import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, RefreshCw, Lightbulb, Package, Calendar, History, Save, Trash2, Edit2, FolderOpen, X } from 'lucide-react';
import { portfolios, assetRanges, riskTypes, productTypes } from '@/data/products';
import { usePortfolioStore } from '@/store/portfolioStore';
import type { SortType } from '@/store/portfolioStore';
import type { Portfolio as PortfolioType, SavedPortfolio } from '@/types';

const categoryColors: Record<string, string> = {
  stock: '#3B82F6',
  fund: '#10B981',
  bond: '#F59E0B',
  futures: '#EF4444',
  options: '#8B5CF6',
  forex: '#06B6D4',
  cash: '#94A3B8',
};

const categoryNames: Record<string, string> = {
  stock: '股票',
  fund: '基金',
  bond: '债券',
  futures: '期货',
  options: '期权',
  forex: '外汇',
  cash: '现金',
};

export default function Portfolio() {
  const [selectedAssetRange, setSelectedAssetRange] = useState(assetRanges[0].value);
  const [selectedRiskType, setSelectedRiskType] = useState(riskTypes[1].value);
  const [showResult, setShowResult] = useState(false);
  const [currentDate] = useState(new Date('2026-04-22'));

  const { savedPortfolios, sortType, setSortType, getSortedPortfolios, savePortfolio, deletePortfolio, renamePortfolio, loadPortfolio } = usePortfolioStore();
  const sortedPortfolios = getSortedPortfolios();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // 生成时间轴数据
  const timelineData = useMemo(() => {
    const data = [];
    const baseDate = new Date('2026-04-22');
    
    // 过去的关键时间点
    data.push(
      { date: new Date('2026-01-01'), label: '年初', type: 'past', description: '年度投资规划启动' },
      { date: new Date('2026-03-15'), label: 'Q1末', type: 'past', description: '第一季度组合回顾' },
      { date: baseDate, label: '当前', type: 'current', description: '当前配置时点' }
    );
    
    // 未来的关键时间点
    data.push(
      { date: new Date('2026-06-30'), label: 'Q2末', type: 'future', description: '半年度再平衡' },
      { date: new Date('2026-09-30'), label: 'Q3末', type: 'future', description: '三季度评估' },
      { date: new Date('2026-12-31'), label: '年末', type: 'future', description: '年度总结与规划' }
    );
    
    return data;
  }, []);

  const matchedPortfolio = useMemo(() => {
    console.log('[数据加载] 开始匹配投资组合:', {
      selectedAssetRange,
      selectedRiskType,
      timestamp: new Date().toISOString()
    });
    const result = portfolios.find(
      (p) => p.assetRange === selectedAssetRange && p.riskType === selectedRiskType
    );
    console.log('[数据加载] 匹配结果:', {
      found: !!result,
      portfolioName: result?.name,
      allocationDetailsCount: result?.allocationDetails?.length,
      timestamp: new Date().toISOString()
    });
    return result;
  }, [selectedAssetRange, selectedRiskType]);

  const chartData = useMemo(() => {
    if (!matchedPortfolio) {
      console.log('[图表数据] 无匹配的投资组合，返回空数组');
      return [];
    }
    const data = [
      { name: '股票', value: matchedPortfolio.stockRatio, color: productTypes[0].color },
      { name: '基金', value: matchedPortfolio.fundRatio, color: productTypes[1].color },
      { name: '债券', value: matchedPortfolio.bondRatio, color: productTypes[2].color },
      { name: '期货', value: matchedPortfolio.futuresRatio, color: productTypes[3].color },
      { name: '期权', value: matchedPortfolio.optionsRatio, color: productTypes[4].color },
      { name: '外汇', value: matchedPortfolio.forexRatio, color: productTypes[5].color },
      { name: '现金', value: matchedPortfolio.cashRatio, color: '#94A3B8' },
    ].filter((item) => item.value > 0);
    console.log('[图表数据] 资产大类配置数据已生成:', {
      dataLength: data.length,
      data: data.map(d => ({ name: d.name, value: d.value })),
      timestamp: new Date().toISOString()
    });
    return data;
  }, [matchedPortfolio]);

  const detailedChartData = useMemo(() => {
    if (!matchedPortfolio) {
      console.log('[图表数据] 无匹配的投资组合，详细配置数据返回空数组');
      return [];
    }
    const data = matchedPortfolio.allocationDetails.map((item) => ({
      name: item.name,
      value: item.ratio,
      color: categoryColors[item.category],
      category: categoryNames[item.category],
      expectedReturn: item.expectedReturn,
      riskLevel: item.riskLevel,
    }));
    console.log('[图表数据] 详细配置分布数据已生成:', {
      dataLength: data.length,
      data: data.map(d => ({ name: d.name, value: d.value, category: d.category })),
      timestamp: new Date().toISOString()
    });
    return data;
  }, [matchedPortfolio]);

  const returnComparisonData = useMemo(() => {
    if (!matchedPortfolio) {
      console.log('[图表数据] 无匹配的投资组合，收益对比数据返回空数组');
      return [];
    }
    const data = matchedPortfolio.allocationDetails.map((item) => ({
      name: item.name,
      配置比例: item.ratio,
      预期收益: item.expectedReturn,
    }));
    console.log('[图表数据] 收益对比数据已生成:', {
      dataLength: data.length,
      data: data.map(d => ({ name: d.name, 配置比例: d.配置比例, 预期收益: d.预期收益 })),
      timestamp: new Date().toISOString()
    });
    return data;
  }, [matchedPortfolio]);

  const handleGenerate = () => {
    console.log('[用户操作] 点击生成配置方案按钮:', {
      selectedAssetRange,
      selectedRiskType,
      matchedPortfolio: matchedPortfolio?.name,
      timestamp: new Date().toISOString()
    });
    setShowResult(true);
    console.log('[状态更新] showResult 已设置为 true');
  };

  const handleSavePortfolio = () => {
    if (!matchedPortfolio || !saveName.trim()) return;

    const assetRangeLabel = assetRanges.find(r => r.value === selectedAssetRange)?.label || '';
    const riskTypeLabel = riskTypes.find(r => r.value === selectedRiskType)?.label || '';

    savePortfolio({
      name: saveName.trim(),
      assetRange: selectedAssetRange,
      assetRangeLabel,
      riskType: selectedRiskType,
      riskTypeLabel,
      portfolioName: matchedPortfolio.name,
      expectedReturnMin: matchedPortfolio.expectedReturnMin,
      expectedReturnMax: matchedPortfolio.expectedReturnMax,
      maxDrawdown: matchedPortfolio.maxDrawdown,
      allocationDetails: matchedPortfolio.allocationDetails,
    });

    setSaveName('');
    setShowSaveModal(false);
  };

  const handleLoadPortfolio = (savedPortfolio: SavedPortfolio) => {
    console.log('[用户操作] 加载已保存的方案:', {
      id: savedPortfolio.id,
      name: savedPortfolio.name,
    });
    setSelectedAssetRange(savedPortfolio.assetRange);
    setSelectedRiskType(savedPortfolio.riskType);
    setShowResult(true);
    setShowLoadModal(false);
  };

  const handleDeletePortfolio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deletePortfolio(id);
  };

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(currentName);
  };

  const handleConfirmRename = () => {
    if (editingId && editName.trim()) {
      renamePortfolio(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName('');
  };

  const getRiskLevelLabel = (level: number) => {
    const labels = ['极低', '低', '中等', '高', '极高'];
    const colors = ['bg-green-100 text-green-800', 'bg-green-200 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
    return { label: labels[level - 1], className: colors[level - 1] };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">智能资产配置</h1>
          <p className="text-slate-600">根据您的资产规模和风险偏好，生成个性化的资产配置方案</p>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">投资时间轴</h2>
              <p className="text-sm text-slate-500">
                当前日期: {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
            
            {/* Timeline Items */}
            <div className="relative flex justify-between items-center">
              {timelineData.map((item, index) => {
                const isCurrent = item.type === 'current';
                const isPast = item.type === 'past';
                const isFuture = item.type === 'future';
                
                return (
                  <div key={index} className="flex flex-col items-center relative z-10">
                    {/* Dot */}
                    <div 
                      className={`w-4 h-4 rounded-full border-4 ${
                        isCurrent 
                          ? 'bg-indigo-600 border-indigo-200 scale-125' 
                          : isPast 
                            ? 'bg-green-500 border-green-200' 
                            : 'bg-slate-300 border-slate-100'
                      }`}
                    ></div>
                    
                    {/* Label */}
                    <div className={`mt-3 text-center ${isCurrent ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}>
                      <div className="text-sm">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    {/* Description Tooltip */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto whitespace-nowrap z-20">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Timeline Legend */}
          <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-500">已过去</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-indigo-200"></div>
              <span className="text-xs text-slate-500 font-medium">当前 (2026年4月22日)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <span className="text-xs text-slate-500">未来节点</span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Asset Range Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">资产规模</h2>
                <p className="text-sm text-slate-500">选择您的投资资产总额</p>
              </div>
            </div>
            <div className="space-y-3">
              {assetRanges.map((range) => (
                <label
                  key={range.value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAssetRange === range.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="assetRange"
                    value={range.value}
                    checked={selectedAssetRange === range.value}
                    onChange={(e) => {
                      console.log('[用户操作] 资产规模选择变更:', {
                        oldValue: selectedAssetRange,
                        newValue: e.target.value,
                        timestamp: new Date().toISOString()
                      });
                      setSelectedAssetRange(e.target.value);
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-slate-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Type Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">风险偏好</h2>
                <p className="text-sm text-slate-500">选择您的风险承受能力</p>
              </div>
            </div>
            <div className="space-y-3">
              {riskTypes.map((risk) => (
                <label
                  key={risk.value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedRiskType === risk.value
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="riskType"
                    value={risk.value}
                    checked={selectedRiskType === risk.value}
                    onChange={(e) => {
                      console.log('[用户操作] 风险偏好选择变更:', {
                        oldValue: selectedRiskType,
                        newValue: e.target.value,
                        timestamp: new Date().toISOString()
                      });
                      setSelectedRiskType(e.target.value);
                    }}
                    className="w-4 h-4 text-amber-600 border-slate-300 focus:ring-amber-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-slate-700">{risk.label}</span>
                    <p className="text-sm text-slate-500">{risk.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            生成配置方案
          </button>
          {sortedPortfolios.length > 0 && (
            <button
              onClick={() => setShowLoadModal(true)}
              className="inline-flex items-center px-6 py-4 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 font-semibold rounded-xl transition-all duration-200 shadow-md"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              我的方案 ({sortedPortfolios.length})
            </button>
          )}
        </div>

        {/* Result Section */}
        {showResult && matchedPortfolio && (
          <div className="space-y-8">
            {/* Main Result Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{matchedPortfolio.name}</h2>
                  <p className="text-slate-600">
                    基于您的资产规模（{assetRanges.find((r) => r.value === selectedAssetRange)?.label}）
                    和风险偏好（{riskTypes.find((r) => r.value === selectedRiskType)?.label}）
                  </p>
                </div>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存方案
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-700">预期年化收益</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {matchedPortfolio.expectedReturnMin}% - {matchedPortfolio.expectedReturnMax}%
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-amber-700">最大回撤</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-700">{matchedPortfolio.maxDrawdown}%</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">建议投资期限</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{matchedPortfolio.investmentHorizon}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-purple-700">再平衡周期</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{matchedPortfolio.rebalancingPeriod}</div>
                </div>
              </div>

              {/* Investment Timeline */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-900">投资期限规划</h3>
                  <span className="text-sm text-slate-500 ml-2">
                    (从 {currentDate.toLocaleDateString('zh-CN')} 开始)
                  </span>
                </div>
                
                <div className="relative">
                  {/* Timeline Track */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-indigo-200 rounded-full -translate-y-1/2"></div>
                  
                  {/* Timeline Points */}
                  <div className="relative flex justify-between">
                    {/* Start Point */}
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 bg-indigo-600 rounded-full border-4 border-indigo-200 z-10"></div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-indigo-700">投资开始</div>
                        <div className="text-xs text-slate-500">{currentDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                    
                    {/* 3 Month Point */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-indigo-400 rounded-full border-2 border-indigo-100 z-10"></div>
                      <div className="mt-2 text-center">
                        <div className="text-xs text-slate-600">3个月</div>
                        <div className="text-xs text-slate-400">首次回顾</div>
                      </div>
                    </div>
                    
                    {/* 6 Month Point */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-indigo-400 rounded-full border-2 border-indigo-100 z-10"></div>
                      <div className="mt-2 text-center">
                        <div className="text-xs text-slate-600">6个月</div>
                        <div className="text-xs text-slate-400">中期评估</div>
                      </div>
                    </div>
                    
                    {/* 1 Year Point */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-indigo-200 z-10"></div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-indigo-700">1年</div>
                        <div className="text-xs text-slate-400">年度评估</div>
                      </div>
                    </div>
                    
                    {/* End Point (based on investment horizon) */}
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-green-200 z-10 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">终</span>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-green-700">目标达成</div>
                        <div className="text-xs text-slate-500">{matchedPortfolio.investmentHorizon}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Milestones */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-indigo-100">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">建仓期</div>
                    <div className="text-sm font-medium text-slate-700">第1-3个月</div>
                    <div className="text-xs text-slate-400">分批建仓，逐步配置</div>
                  </div>
                  <div className="text-center border-x border-indigo-100">
                    <div className="text-xs text-slate-500 mb-1">持有期</div>
                    <div className="text-sm font-medium text-slate-700">第4-12个月</div>
                    <div className="text-xs text-slate-400">{matchedPortfolio.rebalancingPeriod}再平衡</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1">收获期</div>
                    <div className="text-sm font-medium text-slate-700">1年后</div>
                    <div className="text-xs text-slate-400">评估收益，调整策略</div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Category Pie Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">资产大类配置</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `${value}%`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Pie Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">详细配置分布</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={detailedChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={1}
                          dataKey="value"
                        >
                          {detailedChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string, props: { payload?: { category?: string } }) => {
                            const category = props?.payload?.category || '';
                            return [`${value}%`, `${category} - ${name}`];
                          }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Allocation Table */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                详细配置清单
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">资产名称</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">类别</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">配置比例</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">预期收益</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700">风险等级</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">推荐产品</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedPortfolio.allocationDetails.map((item, index) => {
                      const risk = getRiskLevelLabel(item.riskLevel);
                      return (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-slate-900">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.description}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                              style={{ backgroundColor: `${categoryColors[item.category]}20`, color: categoryColors[item.category] }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: categoryColors[item.category] }}
                              />
                              {categoryNames[item.category]}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-lg font-bold text-slate-900">{item.ratio}%</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-semibold text-green-600">{item.expectedReturn}%</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${risk.className}`}>
                              {risk.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {item.products?.map((product, pIndex) => (
                                <span
                                  key={pIndex}
                                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                                >
                                  {product}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Return Comparison Chart */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">配置比例与预期收益对比</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={returnComparisonData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#64748B" />
                    <YAxis dataKey="name" type="category" stroke="#64748B" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="配置比例" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="预期收益" fill="#10B981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategy Rationale */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                配置策略说明
              </h3>
              <p className="text-slate-700 leading-relaxed mb-6">{matchedPortfolio.rationale}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    适合人群
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      追求{matchedPortfolio.expectedReturnMin}% - {matchedPortfolio.expectedReturnMax}%年化收益的投资者
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      能够承受最大{matchedPortfolio.maxDrawdown}%回撤的投资者
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      投资期限建议在{matchedPortfolio.investmentHorizon}的投资者
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      愿意每{matchedPortfolio.rebalancingPeriod}进行组合再平衡的投资者
                    </li>
                  </ul>
                </div>
                <div className="bg-white/70 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    风险提示
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      投资有风险，过往业绩不代表未来表现
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      市场波动可能导致短期亏损
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      建议根据自身风险承受能力调整配置
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      定期再平衡有助于控制风险
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">保存配置方案</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                为当前配置方案命名，方便日后查看和对比。
              </p>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="输入方案名称，如：我的保守配置"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSavePortfolio()}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSavePortfolio}
                  disabled={!saveName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load Modal */}
        {showLoadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">我的配置方案</h3>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Options */}
              {sortedPortfolios.length > 0 && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">排序方式：</span>
                  <div className="flex gap-2 relative">
                    <button
                      onClick={() => setSortType('time' as SortType)}
                      className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                        sortType === 'time'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        保存时间
                        {sortType === 'time' && (
                          <span className="inline-block animate-pulse">●</span>
                        )}
                      </span>
                    </button>
                    <button
                      onClick={() => setSortType('return' as SortType)}
                      className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                        sortType === 'return'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        预期收益
                        {sortType === 'return' && (
                          <span className="inline-block animate-pulse">●</span>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-y-auto max-h-[60vh]">
                {sortedPortfolios.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    暂无保存的方案
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedPortfolios.map((portfolio) => (
                      <div
                        key={portfolio.id}
                        onClick={() => handleLoadPortfolio(portfolio)}
                        className="p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {editingId === portfolio.id ? (
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirmRename();
                                    if (e.key === 'Escape') handleCancelRename();
                                  }}
                                  className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={handleConfirmRename}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelRename}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <h4 className="font-semibold text-slate-900 group-hover:text-blue-700">
                                {portfolio.name}
                              </h4>
                            )}
                            <p className="text-sm text-slate-600 mt-1">
                              {portfolio.portfolioName}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span>{portfolio.assetRangeLabel}</span>
                              <span>•</span>
                              <span>{portfolio.riskTypeLabel}</span>
                              <span>•</span>
                              <span className="text-green-600">
                                收益 {portfolio.expectedReturnMin}%-{portfolio.expectedReturnMax}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                              保存于 {new Date(portfolio.createdAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={(e) => handleStartRename(portfolio.id, portfolio.name, e)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeletePortfolio(portfolio.id, e)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
