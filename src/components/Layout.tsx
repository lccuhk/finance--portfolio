import { Link, useLocation } from 'react-router-dom';
import { PieChart, TrendingUp, Calculator, BookOpen, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: '首页', icon: PieChart },
  { path: '/products', label: '产品中心', icon: TrendingUp },
  { path: '/portfolio', label: '资产配置', icon: PieChart },
  { path: '/calculator', label: '收益计算器', icon: Calculator },
  { path: '/guide', label: '购买指南', icon: BookOpen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                资产配置
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">资产配置</span>
              </div>
              <p className="text-sm text-slate-400">
                专业的金融资产配置平台，助您实现财富增值
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">产品服务</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products" className="hover:text-white transition-colors">金融产品</Link></li>
                <li><Link to="/portfolio" className="hover:text-white transition-colors">资产配置</Link></li>
                <li><Link to="/calculator" className="hover:text-white transition-colors">收益计算</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">帮助中心</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/guide" className="hover:text-white transition-colors">购买指南</Link></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">风险提示</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">常见问题</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">联系我们</h3>
              <ul className="space-y-2 text-sm">
                <li>客服热线：400-xxx-xxxx</li>
                <li>服务时间：9:00-18:00</li>
                <li>邮箱：service@example.com</li>
              </ul>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-500 font-semibold mb-2">风险提示</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  投资有风险，入市需谨慎。本网站提供的所有信息仅供参考，不构成任何投资建议。
                  过往业绩不代表未来表现，投资者应根据自身情况独立做出投资决策，并自行承担投资风险。
                  建议您在投资前充分了解相关产品风险，必要时咨询专业投资顾问。
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 金融资产配置平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
