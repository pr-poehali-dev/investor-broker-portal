import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { PropertyObject, UserInvestment } from '@/types/investment';

interface InvestorDashboardProps {
  userName: string;
}

const InvestorDashboard = ({ userName }: InvestorDashboardProps) => {
  const PROPERTIES_KEY = 'investpro-properties';
  const INVESTMENTS_KEY = 'investpro-user-investments';
  const USER_KEY = 'investpro-user';

  const [properties, setProperties] = useState<PropertyObject[]>([]);
  const [myInvestments, setMyInvestments] = useState<UserInvestment[]>([]);
  const [editingInvestment, setEditingInvestment] = useState<UserInvestment | null>(null);
  const [actionType, setActionType] = useState<'add' | 'withdraw' | null>(null);
  const [actionAmount, setActionAmount] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    try {
      const savedProperties = localStorage.getItem(PROPERTIES_KEY);
      if (savedProperties) {
        const parsed = JSON.parse(savedProperties);
        setProperties(parsed.map((p: any) => ({
          ...p,
          metadata: {
            ...p.metadata,
            createdAt: new Date(p.metadata.createdAt),
            updatedAt: new Date(p.metadata.updatedAt),
          },
        })));
      }

      const savedUser = localStorage.getItem(USER_KEY);
      const userId = savedUser ? JSON.parse(savedUser).email : 'user@example.com';

      const savedInvestments = localStorage.getItem(INVESTMENTS_KEY);
      if (savedInvestments) {
        const parsed = JSON.parse(savedInvestments);
        const userInvestments = parsed
          .filter((inv: any) => inv.userId === userId)
          .map((inv: any) => ({
            ...inv,
            date: new Date(inv.date),
          }));
        setMyInvestments(userInvestments);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveInvestments = (investments: UserInvestment[]) => {
    try {
      const allInvestments = localStorage.getItem(INVESTMENTS_KEY);
      const parsed = allInvestments ? JSON.parse(allInvestments) : [];
      
      const savedUser = localStorage.getItem(USER_KEY);
      const userId = savedUser ? JSON.parse(savedUser).email : 'user@example.com';
      
      const otherInvestments = parsed.filter((inv: any) => inv.userId !== userId);
      const updated = [...otherInvestments, ...investments];
      
      localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(updated));
      setMyInvestments(investments);
    } catch (error) {
      console.error('Error saving investments:', error);
    }
  };

  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = myInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const avgROI = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0.0';

  const getInvestedProperties = (): PropertyObject[] => {
    const investedPropertyIds = new Set(myInvestments.map(inv => inv.propertyId));
    return properties.filter(p => investedPropertyIds.has(p.id));
  };

  const calculatePortfolioData = () => {
    const investedProperties = getInvestedProperties();
    
    const typeGroups: Record<string, number> = {};
    investedProperties.forEach(p => {
      const investment = myInvestments.find(inv => inv.propertyId === p.id);
      if (investment) {
        const typeName = 
          p.propertyType === 'apartment' || p.propertyType === 'house' ? 'Жилая недвижимость' :
          p.propertyType === 'commercial' ? 'Коммерческая недвижимость' :
          p.propertyType === 'parking' ? 'Паркинг' : 'Другое';
        
        typeGroups[typeName] = (typeGroups[typeName] || 0) + investment.amount;
      }
    });

    const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
    return Object.entries(typeGroups).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  const calculateProfitHistory = () => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
    return months.map((month, index) => ({
      month,
      profit: myInvestments.reduce((sum, inv) => {
        const monthlyProfit = (inv.profit / 6) * (index + 1);
        return sum + monthlyProfit;
      }, 0),
    }));
  };

  const portfolioData = calculatePortfolioData();
  const profitHistory = calculateProfitHistory();

  const stats = [
    { label: 'Всего инвестировано', value: totalInvested > 0 ? `₽${(totalInvested / 1000000).toFixed(1)}M` : '₽0', change: myInvestments.length > 0 ? `${myInvestments.length} объект(ов)` : 'Нет инвестиций', icon: 'Wallet', color: 'text-primary' },
    { label: 'Активных объектов', value: myInvestments.length, change: myInvestments.length > 0 ? 'В портфеле' : 'Начните инвестировать', icon: 'Building2', color: 'text-secondary' },
    { label: 'Текущая прибыль', value: totalProfit > 0 ? `₽${(totalProfit / 1000).toFixed(0)}K` : '₽0', change: totalProfit > 0 ? `+${((totalProfit / totalInvested) * 100).toFixed(1)}%` : 'Без прибыли', icon: 'TrendingUp', color: totalProfit >= 0 ? 'text-green-600' : 'text-red-600' },
    { label: 'Средний ROI', value: `${avgROI}%`, change: totalProfit >= 0 ? 'Доходность' : 'Убыток', icon: 'Percent', color: 'text-primary' },
    { label: 'Текущая стоимость', value: totalCurrentValue > 0 ? `₽${(totalCurrentValue / 1000000).toFixed(1)}M` : '₽0', change: totalCurrentValue > totalInvested ? `+₽${((totalCurrentValue - totalInvested) / 1000).toFixed(0)}K` : 'Без роста', icon: 'DollarSign', color: 'text-green-600' }
  ];

  const calculateProfit = (invested: number, currentValue: number) => {
    const profit = currentValue - invested;
    const percentage = invested > 0 ? ((profit / invested) * 100).toFixed(1) : '0.0';
    return { profit, percentage };
  };

  const handleAddFunds = (investmentId: string) => {
    if (!actionAmount) return;
    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) return;

    const updated = myInvestments.map(inv => {
      if (inv.id === investmentId) {
        const newAmount = inv.amount + amount;
        const newCurrentValue = inv.currentValue + amount;
        return {
          ...inv,
          amount: newAmount,
          currentValue: newCurrentValue,
          profit: newCurrentValue - newAmount,
          roi: ((newCurrentValue - newAmount) / newAmount) * 100,
        };
      }
      return inv;
    });
    
    saveInvestments(updated);
    setActionType(null);
    setActionAmount('');
    setEditingInvestment(null);
  };

  const handleWithdraw = (investmentId: string) => {
    if (!actionAmount) return;
    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) return;

    const updated = myInvestments.map(inv => {
      if (inv.id === investmentId && inv.currentValue >= amount) {
        const newCurrentValue = inv.currentValue - amount;
        return {
          ...inv,
          currentValue: newCurrentValue,
          profit: newCurrentValue - inv.amount,
          roi: ((newCurrentValue - inv.amount) / inv.amount) * 100,
        };
      }
      return inv;
    });
    
    saveInvestments(updated);
    setActionType(null);
    setActionAmount('');
    setEditingInvestment(null);
  };

  const getPropertyById = (propertyId: string): PropertyObject | undefined => {
    return properties.find(p => p.id === propertyId);
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
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {myInvestments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {portfolioData.length > 0 && (
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
                      label={({ name, value }) => `${name} ₽${(value / 1000000).toFixed(1)}M`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₽${(value / 1000000).toFixed(2)}M`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {profitHistory.some(h => h.profit > 0) && (
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
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Мои инвестиции</CardTitle>
          <CardDescription>
            {myInvestments.length > 0 
              ? 'Активные вложения в недвижимость'
              : 'У вас пока нет инвестиций. Перейдите в раздел "Объекты" чтобы начать инвестировать.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myInvestments.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="TrendingUp" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Начните инвестировать в недвижимость</p>
              <p className="text-sm text-muted-foreground">
                Изучите доступные объекты во вкладке "Объекты" и выберите подходящий вариант
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myInvestments.map((investment) => {
                const property = getPropertyById(investment.propertyId);
                if (!property) return null;

                const { profit, percentage } = calculateProfit(investment.amount, investment.currentValue);
                const isProfit = profit >= 0;

                return (
                  <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4 flex-1">
                          <div className="text-5xl">
                            {property.propertyType === 'apartment' || property.propertyType === 'house' ? '🏢' :
                             property.propertyType === 'commercial' ? '🏬' :
                             property.propertyType === 'parking' ? '🚗' : '🏗️'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{investment.propertyTitle}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                              <Icon name="MapPin" size={14} />
                              {property.location.city}{property.location.district ? `, ${property.location.district}` : ''}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline">
                                {property.propertyType === 'apartment' ? 'Квартира' :
                                 property.propertyType === 'house' ? 'Дом' :
                                 property.propertyType === 'commercial' ? 'Коммерция' :
                                 property.propertyType === 'parking' ? 'Паркинг' : 'Другое'}
                              </Badge>
                              <Badge variant="secondary">{property.brokerName}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Вложено</p>
                          <p className="font-bold">₽{investment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Текущая стоимость</p>
                          <p className="font-bold">₽{investment.currentValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Прибыль</p>
                          <p className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            {isProfit ? '+' : ''}₽{profit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">ROI</p>
                          <p className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            {isProfit ? '+' : ''}{percentage}%
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Прогресс объекта</span>
                          <span className="font-semibold">
                            {Math.round((property.investment.currentInvestment / property.investment.targetInvestment) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(property.investment.currentInvestment / property.investment.targetInvestment) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingInvestment(investment);
                            setActionType('add');
                          }}
                        >
                          <Icon name="Plus" size={16} className="mr-1" />
                          Довложить
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingInvestment(investment);
                            setActionType('withdraw');
                          }}
                        >
                          <Icon name="Minus" size={16} className="mr-1" />
                          Вывести
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={!!editingInvestment && !!actionType} 
        onOpenChange={(open) => {
          if (!open) {
            setEditingInvestment(null);
            setActionType(null);
            setActionAmount('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'add' ? 'Довложить средства' : 'Вывести средства'}
            </DialogTitle>
            <DialogDescription>
              {editingInvestment?.propertyTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма (₽)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
              />
              {actionType === 'withdraw' && editingInvestment && (
                <p className="text-xs text-muted-foreground">
                  Доступно для вывода: ₽{editingInvestment.currentValue.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingInvestment(null);
                  setActionType(null);
                  setActionAmount('');
                }}
              >
                Отмена
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (editingInvestment) {
                    if (actionType === 'add') {
                      handleAddFunds(editingInvestment.id);
                    } else {
                      handleWithdraw(editingInvestment.id);
                    }
                  }
                }}
              >
                Подтвердить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorDashboard;
