import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentObject {
  id: number;
  title: string;
  location: string;
  type: string;
  minInvestment: number;
  expectedReturn: number;
  term: number;
  risk: string;
  progress: number;
  image: string;
}

interface HomePageProps {
  investmentObjects: InvestmentObject[];
}

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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Низкий': return 'bg-green-500';
    case 'Средний': return 'bg-yellow-500';
    case 'Высокий': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const HomePage = ({ investmentObjects }: HomePageProps) => {
  return (
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
  );
};

export default HomePage;
