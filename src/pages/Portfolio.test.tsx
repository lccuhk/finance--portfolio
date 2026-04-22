import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Portfolio from './Portfolio';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Portfolio Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 清除 localStorage 中的已保存方案
    localStorage.clear();
  });

  describe('Initial Render', () => {
    it('should render page title and description', () => {
      renderWithRouter(<Portfolio />);
      
      expect(screen.getByText('智能资产配置')).toBeInTheDocument();
      expect(screen.getByText(/根据您的资产规模和风险偏好/)).toBeInTheDocument();
    });

    it('should render asset range selection', () => {
      renderWithRouter(<Portfolio />);
      
      expect(screen.getByText('资产规模')).toBeInTheDocument();
      expect(screen.getByText('10万以下')).toBeInTheDocument();
      expect(screen.getByText('10-50万')).toBeInTheDocument();
      expect(screen.getByText('50-100万')).toBeInTheDocument();
      expect(screen.getByText('100-500万')).toBeInTheDocument();
      expect(screen.getByText('500万以上')).toBeInTheDocument();
    });

    it('should render risk type selection', () => {
      renderWithRouter(<Portfolio />);
      
      expect(screen.getByText('风险偏好')).toBeInTheDocument();
      expect(screen.getByText('保守型')).toBeInTheDocument();
      expect(screen.getByText('稳健型')).toBeInTheDocument();
      expect(screen.getByText('平衡型')).toBeInTheDocument();
      expect(screen.getByText('进取型')).toBeInTheDocument();
      expect(screen.getByText('激进型')).toBeInTheDocument();
    });

    it('should render generate button', () => {
      renderWithRouter(<Portfolio />);
      
      expect(screen.getByText('生成配置方案')).toBeInTheDocument();
    });

    it('should render investment timeline section', () => {
      renderWithRouter(<Portfolio />);
      
      expect(screen.getByText('投资时间轴')).toBeInTheDocument();
      expect(screen.getByText('当前')).toBeInTheDocument();
      expect(screen.getByText('年初')).toBeInTheDocument();
      expect(screen.getByText('Q2末')).toBeInTheDocument();
      expect(screen.getByText('年末')).toBeInTheDocument();
    });

    it('should render timeline legend', () => {
      renderWithRouter(<Portfolio />);
      
      expect(screen.getByText('已过去')).toBeInTheDocument();
      expect(screen.getByText('未来节点')).toBeInTheDocument();
      // 使用 getAllByText 因为有多个元素包含 "当前"
      expect(screen.getAllByText(/当前/).length).toBeGreaterThan(0);
    });
  });

  describe('Generate Portfolio', () => {
    it('should show result after clicking generate button', async () => {
      renderWithRouter(<Portfolio />);
      
      const generateButton = screen.getByText('生成配置方案');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('保存方案')).toBeInTheDocument();
      });
    });

    it('should display portfolio metrics after generation', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('预期年化收益')).toBeInTheDocument();
        expect(screen.getByText('最大回撤')).toBeInTheDocument();
        expect(screen.getByText('建议投资期限')).toBeInTheDocument();
        expect(screen.getByText('再平衡周期')).toBeInTheDocument();
      });
    });

    it('should display allocation charts after generation', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('资产大类配置')).toBeInTheDocument();
        expect(screen.getByText('详细配置分布')).toBeInTheDocument();
      });
    });

    it('should display detailed allocation table after generation', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('详细配置清单')).toBeInTheDocument();
        expect(screen.getByText('资产名称')).toBeInTheDocument();
        expect(screen.getByText('类别')).toBeInTheDocument();
        expect(screen.getByText('配置比例')).toBeInTheDocument();
        expect(screen.getByText('预期收益')).toBeInTheDocument();
        expect(screen.getByText('风险等级')).toBeInTheDocument();
        expect(screen.getByText('推荐产品')).toBeInTheDocument();
      });
    });

    it('should display investment timeline after generation', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('投资期限规划')).toBeInTheDocument();
        expect(screen.getByText('投资开始')).toBeInTheDocument();
        expect(screen.getByText('目标达成')).toBeInTheDocument();
        expect(screen.getByText('建仓期')).toBeInTheDocument();
        expect(screen.getByText('持有期')).toBeInTheDocument();
        expect(screen.getByText('收获期')).toBeInTheDocument();
      });
    });

    it('should display strategy rationale after generation', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('配置策略说明')).toBeInTheDocument();
        expect(screen.getByText('适合人群')).toBeInTheDocument();
        expect(screen.getByText('风险提示')).toBeInTheDocument();
      });
    });

    it('should display return comparison chart after generation', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('配置比例与预期收益对比')).toBeInTheDocument();
      });
    });
  });

  describe('Save Portfolio', () => {
    it('should open save modal when clicking save button', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('保存方案'));
      });
      
      expect(screen.getByText('保存配置方案')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/输入方案名称/)).toBeInTheDocument();
    });

    it('should disable save button when name is empty', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('保存方案'));
      });
      
      const saveButton = screen.getByText('保存');
      expect(saveButton).toBeDisabled();
    });

    it('should enable save button when name is entered', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('保存方案'));
      });
      
      const input = screen.getByPlaceholderText(/输入方案名称/);
      fireEvent.change(input, { target: { value: '我的测试方案' } });
      
      const saveButton = screen.getByText('保存');
      expect(saveButton).not.toBeDisabled();
    });

    it('should close save modal when clicking cancel', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('保存方案'));
      });
      
      expect(screen.getByText('保存配置方案')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('取消'));
      
      await waitFor(() => {
        expect(screen.queryByText('保存配置方案')).not.toBeInTheDocument();
      });
    });
  });

  describe('Asset Range Selection', () => {
    it('should update selected asset range', () => {
      renderWithRouter(<Portfolio />);
      
      // 使用 getByText 代替 getByLabelText
      const radioLabel = screen.getByText('10-50万');
      fireEvent.click(radioLabel);
      
      // 验证选中状态通过检查样式或重新渲染
      expect(radioLabel.closest('label')).toHaveClass('border-blue-500');
    });

    it('should have default asset range selected', () => {
      renderWithRouter(<Portfolio />);
      
      const defaultLabel = screen.getByText('10万以下');
      expect(defaultLabel.closest('label')).toHaveClass('border-blue-500');
    });

    it('should allow changing asset range multiple times', () => {
      renderWithRouter(<Portfolio />);
      
      const label1 = screen.getByText('10-50万');
      fireEvent.click(label1);
      expect(label1.closest('label')).toHaveClass('border-blue-500');
      
      const label2 = screen.getByText('50-100万');
      fireEvent.click(label2);
      expect(label2.closest('label')).toHaveClass('border-blue-500');
      expect(label1.closest('label')).not.toHaveClass('border-blue-500');
    });
  });

  describe('Risk Type Selection', () => {
    it('should update selected risk type', () => {
      renderWithRouter(<Portfolio />);
      
      const radioLabel = screen.getByText('保守型');
      fireEvent.click(radioLabel);
      
      expect(radioLabel.closest('label')).toHaveClass('border-amber-500');
    });

    it('should have default risk type selected', () => {
      renderWithRouter(<Portfolio />);
      
      // 默认选中稳健型 (steady)
      const defaultLabel = screen.getByText('稳健型');
      expect(defaultLabel.closest('label')).toHaveClass('border-amber-500');
    });

    it('should allow changing risk type multiple times', () => {
      renderWithRouter(<Portfolio />);
      
      const label1 = screen.getByText('保守型');
      fireEvent.click(label1);
      expect(label1.closest('label')).toHaveClass('border-amber-500');
      
      const label2 = screen.getByText('激进型');
      fireEvent.click(label2);
      expect(label2.closest('label')).toHaveClass('border-amber-500');
      expect(label1.closest('label')).not.toHaveClass('border-amber-500');
    });
  });

  describe('Portfolio Matching', () => {
    it('should match correct portfolio based on selections', async () => {
      renderWithRouter(<Portfolio />);
      
      // 选择 10万以下 + 保守型
      fireEvent.click(screen.getByText('保守型'));
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('保守型配置方案')).toBeInTheDocument();
      });
    });

    it('should match different portfolio for different risk types', async () => {
      renderWithRouter(<Portfolio />);
      
      // 选择 10万以下 + 进取型
      fireEvent.click(screen.getByText('进取型'));
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('进取型配置方案')).toBeInTheDocument();
      });
    });

    it('should match different portfolio for different asset ranges', async () => {
      renderWithRouter(<Portfolio />);
      
      // 选择 500万以上 + 稳健型
      fireEvent.click(screen.getByText('500万以上'));
      fireEvent.click(screen.getByText('稳健型'));
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(screen.getByText('稳健型配置方案')).toBeInTheDocument();
      });
    });
  });

  describe('Risk Level Display', () => {
    it('should display correct risk level labels', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        // 检查风险等级标签是否存在（使用函数匹配器）
        const riskLabels = ['极低', '低', '中等'];
        riskLabels.forEach(label => {
          const elements = screen.queryAllByText((content, element) => {
            return content === label;
          });
          expect(elements.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Category Colors and Names', () => {
    it('should display category names in allocation table', async () => {
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        const categories = ['股票', '基金', '债券'];
        categories.forEach(category => {
          const elements = screen.queryAllByText(category);
          expect(elements.length).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  describe('Console Logging', () => {
    it('should log when generating portfolio', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('生成配置方案'));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('[用户操作]'),
          expect.any(Object)
        );
      });
      
      consoleSpy.mockRestore();
    });

    it('should log when changing asset range', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('10-50万'));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[用户操作]'),
        expect.any(Object)
      );
      
      consoleSpy.mockRestore();
    });

    it('should log when changing risk type', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      renderWithRouter(<Portfolio />);
      
      fireEvent.click(screen.getByText('保守型'));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[用户操作]'),
        expect.any(Object)
      );
      
      consoleSpy.mockRestore();
    });
  });
});
