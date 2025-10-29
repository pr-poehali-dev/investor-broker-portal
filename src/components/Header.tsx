import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <div className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">InvestPro</h1>
              <p className="text-xs text-muted-foreground">Платформа инвестиций</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-1">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              onClick={() => onTabChange('home')}
              className="gap-2"
            >
              <Icon name="Home" size={18} />
              Главная
            </Button>
            <Button
              variant={activeTab === 'objects' ? 'default' : 'ghost'}
              onClick={() => onTabChange('objects')}
              className="gap-2"
            >
              <Icon name="Building2" size={18} />
              Объекты
            </Button>
            <Button
              variant={activeTab === 'calculator' ? 'default' : 'ghost'}
              onClick={() => onTabChange('calculator')}
              className="gap-2"
            >
              <Icon name="Calculator" size={18} />
              Калькулятор
            </Button>
          </nav>
          <Button className="gap-2">
            <Icon name="User" size={18} />
            Профиль
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
