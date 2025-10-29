import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuth: (user: { name: string; email: string; role: 'investor' | 'broker' }) => void;
}

const AuthModal = ({ open, onClose, onAuth }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'investor' | 'broker'>('investor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({ name: name || email.split('@')[0], email, role });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Добро пожаловать в InvestPro</DialogTitle>
          <DialogDescription>
            Войдите или создайте аккаунт для доступа к платформе
          </DialogDescription>
        </DialogHeader>

        <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="investor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Icon name="LogIn" size={18} />
                Войти
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Имя</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="investor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Роль</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as 'investor' | 'broker')}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="investor" id="investor" />
                    <Label htmlFor="investor" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="TrendingUp" size={18} className="text-primary" />
                        <div>
                          <p className="font-semibold">Инвестор</p>
                          <p className="text-xs text-muted-foreground">Вкладывайте в недвижимость</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted cursor-pointer">
                    <RadioGroupItem value="broker" id="broker" />
                    <Label htmlFor="broker" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon name="Building2" size={18} className="text-secondary" />
                        <div>
                          <p className="font-semibold">Брокер</p>
                          <p className="text-xs text-muted-foreground">Размещайте объекты и привлекайте капитал</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full gap-2">
                <Icon name="UserPlus" size={18} />
                Зарегистрироваться
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
