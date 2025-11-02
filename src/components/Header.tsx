import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { name: string; email: string; role: 'investor' | 'broker' } | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onRoleSwitch: () => void;
}

const Header = ({ activeTab, onTabChange, user, onAuthClick, onLogout, onRoleSwitch }: HeaderProps) => {
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
            {user && (
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onTabChange('dashboard')}
                className="gap-2"
              >
                <Icon name="LayoutDashboard" size={18} />
                Кабинет
              </Button>
            )}
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="text-left">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === 'broker' ? 'Брокер' : 'Инвестор'}
                      </p>
                    </div>
                    <Icon name="ChevronDown" size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onRoleSwitch} className="gap-2">
                    <Icon name="RefreshCw" size={16} />
                    <div>
                      <p className="font-medium">
                        {user.role === 'broker' ? 'Режим инвестора' : 'Режим брокера'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === 'broker' ? 'Инвестировать в объекты' : 'Управлять объектами'}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="gap-2 text-destructive">
                    <Icon name="LogOut" size={16} />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={onAuthClick} className="gap-2">
              <Icon name="User" size={18} />
              Войти
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;