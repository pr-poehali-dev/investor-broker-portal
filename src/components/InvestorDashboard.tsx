import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface InvestorDashboardProps {
  userName: string;
}

interface Investment {
  id: number;
  title: string;
  location: string;
  type: string;
  invested: number;
  currentValue: number;
  expectedReturn: number;
  progress: number;
  image: string;
  broker: string;
  revenue: number;
  monthlyGrowth: number;
}

const InvestorDashboard = ({ userName }: InvestorDashboardProps) => {
  const [myInvestments, setMyInvestments] = useState<Investment[]>([
    {
      id: 1,
      title: 'ЖК «Северный квартал»',
      location: 'Москва, САО',
      type: 'Жилая недвижимость',
      invested: 500000,
      currentValue: 567000,
      expectedReturn: 22,
      progress: 67,
      image: '🏢',
      broker: 'Петров Иван',
      revenue: 67000,
      monthlyGrowth: 5600
    },
    {
      id: 2,
      title: 'ТЦ «Метрополис»',
      location: 'Санкт-Петербург',
      type: 'Коммерческая недвижимость',
      invested: 1000000,
      currentValue: 1180000,
      expectedReturn: 18,
      progress: 84,
      image: '🏬',
      broker: 'Сидорова Мария',
      revenue: 180000,
      monthlyGrowth: 15000
    },
    {
      id: 3,
      title: 'Апарт-отель «Прибрежный»',
      location: 'Сочи',
      type: 'Жилая недвижимость',
      invested: 750000,
      currentValue: 825000,
      expectedReturn: 25,
      progress: 42,
      image: '🏨',
      broker: 'Козлов Алексей',
      revenue: 75000,
      monthlyGrowth: 6250
    }
  ]);

  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'add' | 'withdraw' | null>(null);
  const [actionAmount, setActionAmount] = useState('');

  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrentValue = myInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalRevenue = myInvestments.reduce((sum, inv) => sum + inv.revenue, 0);
  const avgROI = ((totalProfit / totalInvested) * 100).toFixed(1);

  const stats = [
    { label: 'Всего инвестировано', value: `₽${(totalInvested / 1000000).toFixed(1)}M`, change: '+15%', icon: 'Wallet', color: 'text-primary' },
    { label: 'Активных объектов', value: myInvestments.length, change: '+2', icon: 'Building2', color: 'text-secondary' },
    { label: 'Текущая прибыль', value: `₽${(totalProfit / 1000).toFixed(0)}K`, change: '+12.2%', icon: 'TrendingUp', color: 'text-green-600' },
    { label: 'Средний ROI', value: `${avgROI}%`, change: '+1.3%', icon: 'Percent', color: 'text-primary' },
    { label: 'Выручка', value: `₽${(totalRevenue / 1000).toFixed(0)}K`, change: `+${(myInvestments.reduce((sum, inv) => sum + inv.monthlyGrowth, 0) / 1000).toFixed(1)}K/мес`, icon: 'DollarSign', color: 'text-green-600' }
  ];

  const portfolioData = [
    { name: 'Жилая недвижимость', value: 55, color: '#0EA5E9' },
    { name: 'Коммерческая недвижимость', value: 35, color: '#8B5CF6' },
    { name: 'Апартаменты', value: 10, color: '#F97316' }
  ];

  const profitHistory = [
    { month: 'Янв', profit: 15000 },
    { month: 'Фев', profit: 28000 },
    { month: 'Мар', profit: 35000 },
    { month: 'Апр', profit: 42000 },
    { month: 'Май', profit: 38000 },
    { month: 'Июн', profit: 47000 }
  ];

  const calculateProfit = (invested: number, currentValue: number) => {
    const profit = currentValue - invested;
    const percentage = ((profit / invested) * 100).toFixed(1);
    return { profit, percentage };
  };

  const handleAddFunds = (investmentId: number) => {
    if (!actionAmount) return;
    const amount = parseFloat(actionAmount);
    setMyInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        return {
          ...inv,
          invested: inv.invested + amount,
          currentValue: inv.currentValue + amount
        };
      }
      return inv;
    }));
    setActionType(null);
    setActionAmount('');
    setEditingInvestment(null);
  };

  const handleWithdraw = (investmentId: number) => {
    if (!actionAmount) return;
    const amount = parseFloat(actionAmount);
    setMyInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId && inv.currentValue >= amount) {
        return {
          ...inv,
          currentValue: inv.currentValue - amount
        };
      }
      return inv;
    }));
    setActionType(null);
    setActionAmount('');
    setEditingInvestment(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Кабинет инвестора</h2>
        <p className="text-muted-foreground">Добро пожаловать, {userName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Icon name={stat.icon} className={stat.color} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Структура портфеля</CardTitle>
            <CardDescription>Распределение по типам недвижимости</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>История прибыли</CardTitle>
            <CardDescription>Динамика доходов за 6 месяцев</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value: number) => `₽${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  dot={{ fill: '#0EA5E9', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мои инвестиции</CardTitle>
          <CardDescription>Активные вложения в недвижимость</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myInvestments.map((inv) => {
              const { profit, percentage } = calculateProfit(inv.invested, inv.currentValue);
              return (
                <div key={inv.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{inv.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{inv.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <Icon name="MapPin" size={14} />
                        {inv.location}
                      </p>
                      <Badge variant="secondary" className="mb-3">{inv.type}</Badge>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Инвестировано:</span>
                          <p className="font-semibold">₽{(inv.invested / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Текущая стоимость:</span>
                          <p className="font-semibold text-primary">₽{(inv.currentValue / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Прибыль:</span>
                          <p className="font-semibold text-green-600">+₽{(profit / 1000).toFixed(0)}K ({percentage}%)</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Выручка:</span>
                          <p className="font-semibold text-green-600">₽{(inv.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">+₽{(inv.monthlyGrowth / 1000).toFixed(1)}K/мес</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Брокер:</span>
                          <p className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => setSelectedBroker(inv.broker)}>
                            {inv.broker}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Прогресс проекта</span>
                          <span className="font-semibold">{inv.progress}%</span>
                        </div>
                        <Progress value={inv.progress} className="h-2" />
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Dialog open={editingInvestment?.id === inv.id && actionType === 'add'} onOpenChange={(open) => {
                          if (!open) {
                            setEditingInvestment(null);
                            setActionType(null);
                            setActionAmount('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                              setEditingInvestment(inv);
                              setActionType('add');
                            }}>
                              <Icon name="Plus" size={16} />
                              Довложить
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Довложить средства</DialogTitle>
                              <DialogDescription>
                                Увеличьте инвестицию в проект "{inv.title}"
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Сумма довложения (₽)</Label>
                                <Input
                                  type="number"
                                  placeholder="100000"
                                  value={actionAmount}
                                  onChange={(e) => setActionAmount(e.target.value)}
                                />
                              </div>
                              <Button onClick={() => handleAddFunds(inv.id)} className="w-full">
                                Подтвердить
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={editingInvestment?.id === inv.id && actionType === 'withdraw'} onOpenChange={(open) => {
                          if (!open) {
                            setEditingInvestment(null);
                            setActionType(null);
                            setActionAmount('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                              setEditingInvestment(inv);
                              setActionType('withdraw');
                            }}>
                              <Icon name="TrendingDown" size={16} />
                              Вывести
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Вывести средства</DialogTitle>
                              <DialogDescription>
                                Выведите часть инвестиции из проекта "{inv.title}"
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Сумма вывода (₽)</Label>
                                <Input
                                  type="number"
                                  placeholder="50000"
                                  value={actionAmount}
                                  onChange={(e) => setActionAmount(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                  Доступно: ₽{(inv.currentValue / 1000).toFixed(0)}K
                                </p>
                              </div>
                              <Button onClick={() => handleWithdraw(inv.id)} className="w-full">
                                Подтвердить вывод
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedBroker(inv.broker)}>
                          <Icon name="MessageSquare" size={16} />
                          Связаться с брокером
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedBroker !== null} onOpenChange={() => setSelectedBroker(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Контакты брокера</DialogTitle>
            <DialogDescription>
              Информация о брокере: {selectedBroker}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Icon name="User" size={20} className="text-primary" />
              <div>
                <p className="font-semibold">{selectedBroker}</p>
                <p className="text-sm text-muted-foreground">Сертифицированный брокер</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Mail" size={20} className="text-primary" />
              <p className="text-sm">{selectedBroker?.toLowerCase().replace(' ', '.')}@investpro.ru</p>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Phone" size={20} className="text-primary" />
              <p className="text-sm">+7 (495) 123-45-67</p>
            </div>
            <Button className="w-full gap-2">
              <Icon name="MessageSquare" size={18} />
              Написать брокеру
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorDashboard;
