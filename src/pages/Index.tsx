import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const [expectedReturn, setExpectedReturn] = useState(15);

  const dashboardStats = [
    { label: 'Активных объектов', value: '247', change: '+12%', icon: 'Building2', color: 'text-primary' },
    { label: 'Общий объем', value: '₽1.2B', change: '+8.3%', icon: 'TrendingUp', color: 'text-secondary' },
    { label: 'Средняя доходность', value: '18.5%', change: '+2.1%', icon: 'Percent', color: 'text-primary' },
    { label: 'Инвесторов', value: '1,834', change: '+156', icon: 'Users', color: 'text-secondary' }
  ];

  const revenueData = [
    { month: 'Янв', revenue: 45000, profit: 12000 },
    { month: 'Фев', revenue: 52000, profit: 15000 },
    { month: 'Мар', revenue: 48000, profit: 13500 },
    { month: 'Апр', revenue: 61000, profit: 18000 },
    { month: 'Май', revenue: 55000, profit: 16500 },
    { month: 'Июн', revenue: 67000, profit: 21000 }
  ];

  const portfolioData = [
    { name: 'Недвижимость', value: 45, color: '#0EA5E9' },
    { name: 'Коммерция', value: 30, color: '#8B5CF6' },
    { name: 'Стартапы', value: 15, color: '#F97316' },
    { name: 'Облигации', value: 10, color: '#10B981' }
  ];

  const investmentObjects = [
    {
      id: 1,
      title: 'ЖК «Северный квартал»',
      location: 'Москва, САО',
      type: 'Жилая недвижимость',
      minInvestment: 500000,
      expectedReturn: 22,
      term: 24,
      risk: 'Средний',
      progress: 67,
      image: '🏢'
    },
    {
      id: 2,
      title: 'ТЦ «Метрополис»',
      location: 'Санкт-Петербург',
      type: 'Коммерческая недвижимость',
      minInvestment: 1000000,
      expectedReturn: 18,
      term: 36,
      risk: 'Низкий',
      progress: 84,
      image: '🏬'
    },
    {
      id: 3,
      title: 'Апарт-отель «Прибрежный»',
      location: 'Сочи',
      type: 'Жилая недвижимость',
      minInvestment: 750000,
      expectedReturn: 25,
      term: 18,
      risk: 'Высокий',
      progress: 42,
      image: '🏨'
    },
    {
      id: 4,
      title: 'Бизнес-центр «Альфа»',
      location: 'Екатеринбург',
      type: 'Коммерческая недвижимость',
      minInvestment: 2000000,
      expectedReturn: 16,
      term: 48,
      risk: 'Низкий',
      progress: 91,
      image: '🏛️'
    }
  ];

  const calculateROI = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalAmount = investmentAmount * Math.pow(1 + monthlyRate, investmentPeriod);
    const profit = totalAmount - investmentAmount;
    return {
      totalAmount: Math.round(totalAmount),
      profit: Math.round(profit),
      roi: ((profit / investmentAmount) * 100).toFixed(2)
    };
  };

  const roi = calculateROI();

  const projectionData = Array.from({ length: investmentPeriod }, (_, i) => {
    const month = i + 1;
    const monthlyRate = expectedReturn / 100 / 12;
    const amount = investmentAmount * Math.pow(1 + monthlyRate, month);
    return {
      month: `М${month}`,
      value: Math.round(amount)
    };
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Низкий': return 'bg-green-500';
      case 'Средний': return 'bg-yellow-500';
      case 'Высокий': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                onClick={() => setActiveTab('home')}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Главная
              </Button>
              <Button
                variant={activeTab === 'objects' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('objects')}
                className="gap-2"
              >
                <Icon name="Building2" size={18} />
                Объекты
              </Button>
              <Button
                variant={activeTab === 'calculator' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('calculator')}
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

      <div className="container mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Обзор портфеля</h2>
              <p className="text-muted-foreground">Аналитика и ключевые показатели</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon name={stat.icon} className={stat.color} size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.change} за месяц
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Динамика доходности</CardTitle>
                  <CardDescription>Выручка и прибыль по месяцам</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0EA5E9" name="Выручка" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="profit" fill="#8B5CF6" name="Прибыль" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Структура портфеля</CardTitle>
                  <CardDescription>Распределение инвестиций</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
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
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Топ объектов месяца</CardTitle>
                <CardDescription>Лучшие инвестиционные предложения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investmentObjects.slice(0, 2).map((obj) => (
                    <div key={obj.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{obj.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{obj.title}</h3>
                          <p className="text-sm text-muted-foreground">{obj.location}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{obj.type}</Badge>
                            <Badge className={`${getRiskColor(obj.risk)} text-white`}>{obj.risk}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Минимум:</span>
                              <p className="font-semibold">₽{(obj.minInvestment / 1000).toFixed(0)}K</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Доходность:</span>
                              <p className="font-semibold text-green-600">{obj.expectedReturn}%</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Прогресс</span>
                              <span className="font-semibold">{obj.progress}%</span>
                            </div>
                            <Progress value={obj.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'objects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Инвестиционные объекты</h2>
                <p className="text-muted-foreground">Все доступные предложения</p>
              </div>
              <Button className="gap-2">
                <Icon name="Filter" size={18} />
                Фильтры
              </Button>
            </div>

            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Тип объекта" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="residential">Жилая</SelectItem>
                  <SelectItem value="commercial">Коммерческая</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Уровень риска" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все риски</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Поиск по названию..." className="max-w-xs" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentObjects.map((obj) => (
                <Card key={obj.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="text-5xl mb-3">{obj.image}</div>
                    <CardTitle className="text-xl">{obj.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {obj.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{obj.type}</Badge>
                      <Badge className={`${getRiskColor(obj.risk)} text-white`}>{obj.risk}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Минимум</span>
                        <span className="font-semibold">₽{(obj.minInvestment / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Доходность</span>
                        <span className="font-semibold text-green-600">{obj.expectedReturn}% годовых</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Срок</span>
                        <span className="font-semibold">{obj.term} мес.</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Заполнено</span>
                        <span className="font-semibold">{obj.progress}%</span>
                      </div>
                      <Progress value={obj.progress} className="h-2" />
                    </div>

                    <Button className="w-full gap-2">
                      <Icon name="ArrowRight" size={18} />
                      Инвестировать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Калькулятор доходности</h2>
              <p className="text-muted-foreground">Рассчитайте потенциальную прибыль</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Параметры инвестиции</CardTitle>
                  <CardDescription>Укажите условия для расчета</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Сумма инвестиции</label>
                      <span className="text-sm font-semibold">₽{investmentAmount.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[investmentAmount]}
                      onValueChange={(value) => setInvestmentAmount(value[0])}
                      min={100000}
                      max={10000000}
                      step={100000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₽100K</span>
                      <span>₽10M</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Период (месяцев)</label>
                      <span className="text-sm font-semibold">{investmentPeriod}</span>
                    </div>
                    <Slider
                      value={[investmentPeriod]}
                      onValueChange={(value) => setInvestmentPeriod(value[0])}
                      min={6}
                      max={60}
                      step={6}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>6 мес</span>
                      <span>60 мес</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Ожидаемая доходность (%)</label>
                      <span className="text-sm font-semibold">{expectedReturn}%</span>
                    </div>
                    <Slider
                      value={[expectedReturn]}
                      onValueChange={(value) => setExpectedReturn(value[0])}
                      min={5}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Итоговая сумма</span>
                      <span className="text-2xl font-bold text-primary">₽{roi.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Чистая прибыль</span>
                      <span className="text-xl font-bold text-green-600">+₽{roi.profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ROI</span>
                      <span className="text-lg font-semibold">{roi.roi}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Прогноз роста капитала</CardTitle>
                  <CardDescription>Динамика стоимости инвестиции</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value: number) => `₽${value.toLocaleString()}`} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0EA5E9"
                        strokeWidth={3}
                        dot={{ fill: '#0EA5E9', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Info" size={18} className="text-primary" />
                      Ключевые метрики
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Срок окупаемости</p>
                        <p className="font-semibold">{Math.round(investmentPeriod / 2)} мес.</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Месячная прибыль</p>
                        <p className="font-semibold">₽{Math.round(roi.profit / investmentPeriod).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Годовая доходность</p>
                        <p className="font-semibold text-green-600">{expectedReturn}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Риск</p>
                        <p className="font-semibold">Средний</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
