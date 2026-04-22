import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator as CalculatorIcon, TrendingUp, DollarSign, Clock, Calendar, History } from 'lucide-react';
import { productTypes } from '@/data/products';

interface CalculationResult {
  simpleInterest: {
    total: number;
    interest: number;
  };
  compoundInterest: {
    total: number;
    interest: number;
    yearlyData: {
      year: number;
      principal: number;
      interest: number;
      total: number;
    }[];
  };
}

export default function Calculator() {
  const [amount, setAmount] = useState<number>(100000);
  const [years, setYears] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(8);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [currentDate] = useState(new Date('2026-04-22'));

  // 生成投资时间轴数据
  const investmentTimeline = useMemo(() => {
    const timeline = [];
    const startDate = new Date('2026-04-22');
    
    // 添加关键时间节点
    timeline.push(
      { date: new Date(startDate), label: '投资开始', type: 'start', description: '初始投入本金' }
    );
    
    // 根据投资期限添加里程碑
    if (years >= 1) {
      const year1 = new Date(startDate);
      year1.setFullYear(year1.getFullYear() + 1);
      timeline.push({ date: year1, label: '1年后', type: 'milestone', description: '年度评估' });
    }
    
    if (years >= 3) {
      const year3 = new Date(startDate);
      year3.setFullYear(year3.getFullYear() + 3);
      timeline.push({ date: year3, label: '3年后', type: 'milestone', description: '中期回顾' });
    }
    
    if (years >= 5) {
      const year5 = new Date(startDate);
      year5.setFullYear(year5.getFullYear() + 5);
      timeline.push({ date: year5, label: '5年后', type: 'milestone', description: '长期目标' });
    }
    
    // 结束日期
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + years);
    timeline.push({ date: endDate, label: '投资结束', type: 'end', description: '实现收益目标' });
    
    return timeline;
  }, [years]);

  const calculate = () => {
    // Simple Interest
    const simpleInterest = (amount * expectedReturn * years) / 100;
    const simpleTotal = amount + simpleInterest;

    // Compound Interest
    const compoundTotal = amount * Math.pow(1 + expectedReturn / 100, years);
    const compoundInterest = compoundTotal - amount;

    // Yearly data for chart
    const yearlyData = [];
    for (let i = 0; i <= years; i++) {
      const total = amount * Math.pow(1 + expectedReturn / 100, i);
      yearlyData.push({
        year: i,
        principal: amount,
        interest: total - amount,
        total: total,
      });
    }

    setResult({
      simpleInterest: {
        total: simpleTotal,
        interest: simpleInterest,
      },
      compoundInterest: {
        total: compoundTotal,
        interest: compoundInterest,
        yearlyData,
      },
    });
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.compoundInterest.yearlyData;
  }, [result]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">收益计算器</h1>
          <p className="text-slate-600">计算您的投资收益，支持单利和复利计算</p>
        </div>

        {/* Investment Timeline Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">投资时间规划</h2>
              <p className="text-sm text-slate-500">
                起始日期: {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                <span className="mx-2">|</span>
                投资期限: {years}年
              </p>
            </div>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
            
            {/* Timeline Items */}
            <div className="relative flex justify-between items-center">
              {investmentTimeline.map((item, index) => {
                const isStart = item.type === 'start';
                const isEnd = item.type === 'end';
                const isMilestone = item.type === 'milestone';
                
                return (
                  <div key={index} className="flex flex-col items-center relative z-10 group">
                    {/* Dot */}
                    <div 
                      className={`rounded-full border-4 flex items-center justify-center ${
                        isStart 
                          ? 'w-5 h-5 bg-indigo-600 border-indigo-200' 
                          : isEnd 
                            ? 'w-6 h-6 bg-green-500 border-green-200' 
                            : 'w-4 h-4 bg-indigo-400 border-indigo-100'
                      }`}
                    >
                      {isEnd && <span className="text-white text-xs font-bold">终</span>}
                    </div>
                    
                    {/* Label */}
                    <div className={`mt-3 text-center ${isStart || isEnd ? 'text-indigo-700 font-semibold' : 'text-slate-600'}`}>
                      <div className="text-sm">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {item.date.toLocaleDateString('zh-CN', { year: '2-digit', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Timeline Info */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{years}</div>
              <div className="text-xs text-slate-500">投资年限</div>
            </div>
            <div className="text-center border-x border-slate-100">
              <div className="text-2xl font-bold text-green-600">{expectedReturn}%</div>
              <div className="text-xs text-slate-500">预期年化</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Date(currentDate.getFullYear() + years, currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('zh-CN', { year: '2-digit', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-slate-500">预计到期日</div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                投资金额 (元)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1000"
                step="1000"
              />
              <input
                type="range"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="10000"
                max="10000000"
                step="10000"
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1万</span>
                <span>1000万</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                投资期限 (年)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="30"
              />
              <input
                type="range"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="1"
                max="30"
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1年</span>
                <span>30年</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                预期年化收益率 (%)
              </label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="30"
                step="0.1"
              />
              <input
                type="range"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                min="1"
                max="20"
                step="0.5"
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={calculate}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CalculatorIcon className="w-5 h-5" />
              计算收益
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">单利计算</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">投资本金</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">预期收益</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(result.simpleInterest.interest)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600">本息合计</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatCurrency(result.simpleInterest.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">复利计算</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">投资本金</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">预期收益</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(result.compoundInterest.interest)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600">本息合计</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(result.compoundInterest.total)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    复利效应让您多赚{' '}
                    <span className="font-bold">
                      {formatCurrency(result.compoundInterest.interest - result.simpleInterest.interest)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">收益增长趋势</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="year"
                      tickFormatter={(value) => `第${value}年`}
                      stroke="#64748B"
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                      stroke="#64748B"
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `第${label}年`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="principal"
                      name="本金"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="本息合计"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reference Returns */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">不同收益率对比</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">年化收益率</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">单利收益</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">复利收益</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">复利总收益</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[3, 5, 8, 10, 12, 15].map((rate) => {
                      const simple = (amount * rate * years) / 100;
                      const compound = amount * Math.pow(1 + rate / 100, years) - amount;
                      return (
                        <tr key={rate} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: productTypes.find((t) => t.value === 'bond')?.color,
                              }}
                            />
                            {rate}%
                          </td>
                          <td className="text-right py-3 px-4 text-slate-600">
                            {formatCurrency(simple)}
                          </td>
                          <td className="text-right py-3 px-4 text-green-600">
                            +{formatCurrency(compound - simple)}
                          </td>
                          <td className="text-right py-3 px-4 font-semibold text-slate-900">
                            {formatCurrency(amount + compound)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
