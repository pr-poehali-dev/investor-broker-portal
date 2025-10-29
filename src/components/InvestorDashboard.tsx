import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface InvestorDashboardProps {
  userName: string;
}

const InvestorDashboard = ({ userName }: InvestorDashboardProps) => {
  const stats = [
    { label: 'Всего инвестировано', value: '₽3.5M', change: '+15%', icon: 'Wallet', color: 'text-primary' },
    { label: 'Активных объектов', value: '8', change: '+2', icon: 'Building2', color: 'text-secondary' },
    { label: 'Текущая прибыль', value: '₽427K', change: '+12.2%', icon: 'TrendingUp', color: 'text-green-600' },
    { label: 'Средний ROI', value: '18.7%', change: '+1.3%', icon: 'Percent', color: 'text-primary' }
  ];

  const myInvestments = [
    {
      id: 1,
      title: 'ЖК «Северный квартал»',
      location: 'Москва, САО',
      type: 'Жилая недвижимость',
      invested: 500000,
      currentValue: 567000,
      expectedReturn: 22,
      progress: 67,
      image: '🏢'
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
      image: '🏬'
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
      image: '🏨'
    }
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Кабинет инвестора</h2>
        <p className="text-muted-foreground">Добро пожаловать, {userName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-xs text-green-600 mt-1">{stat.change} за месяц</p>
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
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
                          <span className="text-muted-foreground">Ожидаемый ROI:</span>
                          <p className="font-semibold">{inv.expectedReturn}%</p>
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
                        <Button variant="outline" size="sm" className="gap-2">
                          <Icon name="Plus" size={16} />
                          Довложить
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Icon name="TrendingDown" size={16} />
                          Вывести
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Icon name="FileText" size={16} />
                          Документы
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

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации</CardTitle>
          <CardDescription>Новые объекты, подходящие вашему профилю</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Sparkles" size={48} className="mx-auto mb-3 text-primary" />
            <p>Персональные рекомендации появятся здесь</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorDashboard;
