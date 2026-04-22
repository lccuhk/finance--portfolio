import { useState, useEffect } from 'react';
import { Sun, Moon, Sunset, Sunrise } from 'lucide-react';

export default function PersonalizedGreeting() {
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let newGreeting = '';
      let newIcon = null;

      if (hour >= 5 && hour < 9) {
        newGreeting = '早上好';
        newIcon = <Sunrise className="w-5 h-5 text-amber-400" />;
      } else if (hour >= 9 && hour < 12) {
        newGreeting = '上午好';
        newIcon = <Sun className="w-5 h-5 text-yellow-400" />;
      } else if (hour >= 12 && hour < 14) {
        newGreeting = '中午好';
        newIcon = <Sun className="w-5 h-5 text-orange-400" />;
      } else if (hour >= 14 && hour < 18) {
        newGreeting = '下午好';
        newIcon = <Sun className="w-5 h-5 text-amber-500" />;
      } else if (hour >= 18 && hour < 22) {
        newGreeting = '晚上好';
        newIcon = <Sunset className="w-5 h-5 text-orange-500" />;
      } else {
        newGreeting = '夜深了';
        newIcon = <Moon className="w-5 h-5 text-blue-300" />;
      }

      setGreeting(newGreeting);
      setIcon(newIcon);
    };

    updateGreeting();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000); // 每分钟更新

    return () => clearInterval(interval);
  }, []);

  const getEncouragement = () => {
    const encouragements = [
      '让财富为您工作',
      '智慧投资，稳健增值',
      '把握每一个投资机会',
      '规划未来，从今天开始',
      '专业配置，安心收益',
    ];
    const hour = currentTime.getHours();
    return encouragements[hour % encouragements.length];
  };

  return (
    <div className="flex items-center gap-3 text-white">
      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold">
          {greeting}，{getEncouragement()}
        </h2>
        <p className="text-sm text-blue-200">
          {currentTime.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </p>
      </div>
    </div>
  );
}
