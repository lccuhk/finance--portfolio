import { useState } from 'react';
import { BookOpen, ChevronRight, HelpCircle, DollarSign, FileText, GraduationCap, History } from 'lucide-react';
import { productGuides } from '@/data/products';
import type { ProductGuide } from '@/types';

export default function Guide() {
  const [selectedGuide, setSelectedGuide] = useState<ProductGuide>(productGuides[0]);
  const [activeTab, setActiveTab] = useState<'steps' | 'fees' | 'faqs'>('steps');
  const [currentDate] = useState(new Date('2026-04-22'));

  // 学习路径时间轴
  const learningPathTimeline = [
    { phase: '入门', duration: '1-2周', description: '了解基础概念，完成风险评估', completed: true },
    { phase: '学习', duration: '2-4周', description: '学习交易规则，熟悉操作流程', completed: true },
    { phase: '模拟', duration: '1-2个月', description: '使用模拟账户练习交易', completed: false },
    { phase: '实盘', duration: '持续', description: '小额实盘交易，积累经验', completed: false },
    { phase: '精通', duration: '长期', description: '形成自己的投资策略', completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">购买指南</h1>
          <p className="text-slate-600">了解各类金融产品的开户流程、交易规则和费用说明</p>
        </div>

        {/* Learning Path Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">投资学习路径</h2>
              <p className="text-sm text-slate-500">
                从入门到精通，循序渐进掌握投资技能
              </p>
            </div>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
            
            {/* Timeline Items */}
            <div className="relative flex justify-between items-center">
              {learningPathTimeline.map((item, index) => {
                const isCompleted = item.completed;
                const isCurrent = !item.completed && (index === 0 || learningPathTimeline[index - 1].completed);
                
                return (
                  <div key={index} className="flex flex-col items-center relative z-10 group">
                    {/* Dot */}
                    <div 
                      className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 border-green-200' 
                          : isCurrent 
                            ? 'bg-indigo-600 border-indigo-200 scale-125' 
                            : 'bg-slate-300 border-slate-100'
                      }`}
                    >
                      {isCompleted && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Label */}
                    <div className={`mt-3 text-center ${isCurrent ? 'text-indigo-700 font-semibold' : isCompleted ? 'text-green-700' : 'text-slate-600'}`}>
                      <div className="text-sm">{item.phase}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.duration}</div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 text-center">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Progress Info */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-500">已完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-indigo-200"></div>
                <span className="text-xs text-slate-500">当前阶段</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-xs text-slate-500">待开始</span>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              学习进度: <span className="font-semibold text-indigo-600">2/5</span> 阶段
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-900 text-white">
                <h2 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  产品类型
                </h2>
              </div>
              <nav className="p-2">
                {productGuides.map((guide) => (
                  <button
                    key={guide.type}
                    onClick={() => {
                      setSelectedGuide(guide);
                      setActiveTab('steps');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedGuide.type === guide.type
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-medium">{guide.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        selectedGuide.type === guide.type ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedGuide.name}</h2>
                <p className="text-slate-600">{selectedGuide.description}</p>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('steps')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === 'steps'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    购买流程
                  </button>
                  <button
                    onClick={() => setActiveTab('fees')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === 'fees'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    费用说明
                  </button>
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === 'faqs'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    常见问题
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'steps' && (
                  <div className="space-y-6">
                    {selectedGuide.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">{index + 1}</span>
                          </div>
                          {index < selectedGuide.steps.length - 1 && (
                            <div className="w-0.5 h-full bg-blue-200 mx-auto mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                          <p className="text-slate-600 mb-3">{step.description}</p>
                          {step.tips && step.tips.length > 0 && (
                            <div className="bg-amber-50 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-amber-900 mb-2">温馨提示</h4>
                              <ul className="space-y-1">
                                {step.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-sm text-amber-800 flex items-start gap-2">
                                    <span className="text-amber-500 mt-1">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'fees' && (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">费用名称</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">费率</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">说明</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGuide.fees.map((fee, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-4 px-4 font-medium text-slate-900">{fee.name}</td>
                              <td className="py-4 px-4 text-blue-600 font-semibold">{fee.rate}</td>
                              <td className="py-4 px-4 text-slate-600">{fee.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">费用说明</h4>
                          <p className="text-sm text-blue-800">
                            以上费率为参考值，实际费率可能因不同券商、不同产品而有所差异。
                            请在交易前仔细阅读产品说明书和相关协议，了解具体费用标准。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    {selectedGuide.faqs.map((faq, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4">
                          <h3 className="font-semibold text-slate-900 flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            {faq.question}
                          </h3>
                        </div>
                        <div className="px-6 py-4">
                          <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
