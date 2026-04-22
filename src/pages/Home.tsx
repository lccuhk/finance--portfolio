import { TrendingUp, Shield, PieChart, Calculator, BookOpen, ArrowRight, Activity, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productTypes } from '@/data/products';
import MarketTicker from '@/components/MarketTicker';
import ForexTicker from '@/components/ForexTicker';
import StockTickerMarquee from '@/components/StockTickerMarquee';
import PersonalizedGreeting from '@/components/PersonalizedGreeting';
import MarketOverview from '@/components/MarketOverview';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80')] opacity-10 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* 个性化问候 */}
            <div className="mb-8 flex justify-center">
              <PersonalizedGreeting />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              智能金融资产配置平台
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              涵盖股票、基金、期货、债券、期权、外汇等全品类金融产品，
              为您提供专业的资产配置方案和预期收益分析
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                开始资产配置
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                浏览金融产品
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">10万+</div>
                <div className="text-sm text-blue-200">服务用户</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">6大类</div>
                <div className="text-sm text-blue-200">金融产品</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">98%</div>
                <div className="text-sm text-blue-200">用户满意度</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 实时行情跑马灯 */}
        <div className="absolute bottom-0 left-0 right-0">
          <StockTickerMarquee />
        </div>
      </section>

      {/* Market Overview - 市场概览 */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">市场概览</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              实时追踪A股主要指数和全球市场动态
            </p>
          </div>
          
          <div className="mb-8">
            <MarketOverview />
          </div>
        </div>
      </section>

      {/* Real-time Market Data */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">实时市场行情</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              实时追踪热门股票和全球主要汇率，助您把握投资时机
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stock Market Ticker */}
            <MarketTicker />
            
            {/* Forex Ticker */}
            <ForexTicker />
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">全品类金融产品</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              覆盖股票、基金、期货、债券、期权、外汇六大类金融产品，满足您多样化的投资需求
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productTypes.map((type) => (
              <Link
                key={type.value}
                to={`/products?type=${type.value}`}
                className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-slate-100 hover:border-blue-200"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                </div>
                <h3 className="text-center font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {type.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">核心功能</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              专业的投资工具，助您做出明智的投资决策
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">智能资产配置</h3>
              <p className="text-sm text-slate-600">
                根据您的资产规模和风险偏好，生成个性化的资产配置方案
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">收益计算器</h3>
              <p className="text-sm text-slate-600">
                精准计算投资收益，支持复利计算和多方案对比
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">产品对比</h3>
              <p className="text-sm text-slate-600">
                全品类金融产品信息，风险等级和预期收益一目了然
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">购买指南</h3>
              <p className="text-sm text-slate-600">
                详细的开户流程、交易规则和费用说明
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Warning */}
      <section className="py-12 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">风险提示</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                投资有风险，入市需谨慎。本网站提供的资产配置方案和收益预测仅供参考，不构成投资建议。
                过往业绩不代表未来表现，投资者应根据自身风险承受能力谨慎决策。
                建议您在投资前充分了解产品风险，必要时咨询专业投资顾问。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
