import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, TrendingUp, AlertTriangle, DollarSign, ChevronRight } from 'lucide-react';
import { products, productTypes } from '@/data/products';
import type { Product } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedType !== 'all' && product.type !== selectedType) return false;
      if (selectedRisk !== 'all' && product.riskLevel !== parseInt(selectedRisk)) return false;
      return true;
    });
  }, [selectedType, selectedRisk]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

  const getRiskLabel = (level: number) => {
    const labels = ['极低', '低', '中等', '高', '极高'];
    const colors = ['bg-green-100 text-green-800', 'bg-green-200 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
    return { label: labels[level - 1], className: colors[level - 1] };
  };

  const getTypeLabel = (type: string) => {
    return productTypes.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">金融产品中心</h1>
          <p className="text-slate-600">全品类金融产品信息，助您做出明智的投资决策</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-700">筛选条件</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">产品类型</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTypeChange('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  全部
                </button>
                {productTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeChange(type.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === type.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">风险等级</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRisk('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRisk === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  全部
                </button>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedRisk(level.toString())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedRisk === level.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    风险{level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Cards */}
          <div className="lg:col-span-2 space-y-4">
            {filteredProducts.map((product) => {
              const risk = getRiskLabel(product.riskLevel);
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProduct?.id === product.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                        <span className="text-sm text-slate-500">{product.code}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${risk.className}`}>
                          风险{risk.label}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">类型:</span>
                          <span className="font-medium text-slate-700">{getTypeLabel(product.type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">起投:</span>
                          <span className="font-medium text-slate-700">
                            {product.minInvestment.toLocaleString()}元
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-slate-500">预期收益:</span>
                          <span className="font-medium text-green-600">{product.expectedReturn}%</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Product Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              {selectedProduct ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-bold text-slate-900">{selectedProduct.name}</h2>
                    <span className="text-sm text-slate-500">{selectedProduct.code}</span>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskLabel(selectedProduct.riskLevel).className}`}>
                    <AlertTriangle className="w-4 h-4" />
                    风险等级: {getRiskLabel(selectedProduct.riskLevel).label}
                  </div>

                  <p className="text-slate-600 mb-6">{selectedProduct.description}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">产品类型</span>
                      <span className="font-medium text-slate-900">{getTypeLabel(selectedProduct.type)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">起投金额</span>
                      <span className="font-medium text-slate-900">
                        {selectedProduct.minInvestment.toLocaleString()}元
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">预期年化收益</span>
                      <span className="font-medium text-green-600">{selectedProduct.expectedReturn}%</span>
                    </div>
                  </div>

                  {selectedProduct.feeStructure && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3">费用说明</h4>
                      <div className="space-y-2">
                        {selectedProduct.feeStructure.managementFee && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">管理费</span>
                            <span className="text-slate-700">{selectedProduct.feeStructure.managementFee}%/年</span>
                          </div>
                        )}
                        {selectedProduct.feeStructure.subscriptionFee && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">认购/申购费</span>
                            <span className="text-slate-700">{selectedProduct.feeStructure.subscriptionFee}%</span>
                          </div>
                        )}
                        {selectedProduct.feeStructure.redemptionFee && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">赎回费</span>
                            <span className="text-slate-700">{selectedProduct.feeStructure.redemptionFee}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">适合人群</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.suitableFor.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">点击左侧产品查看详情</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
