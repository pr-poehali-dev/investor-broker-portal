import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PropertyObject, UserInvestment } from '@/types/investment';

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





const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Низкий': return 'bg-green-500';
    case 'Средний': return 'bg-yellow-500';
    case 'Высокий': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const HomePage = ({ investmentObjects }: HomePageProps) => {
  const [portfolioData, setPortfolioData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [dashboardStats, setDashboardStats] = useState([
    { label: 'Активных объектов', value: '0', change: '0%', icon: 'Building2', color: 'text-primary' },
    { label: 'Общий объем', value: '₽0', change: '0%', icon: 'TrendingUp', color: 'text-secondary' },
    { label: 'Средняя доходность', value: '0%', change: '0%', icon: 'Percent', color: 'text-primary' },
    { label: 'Инвесторов', value: '0', change: '0', icon: 'Users', color: 'text-secondary' }
  ]);
  const [revenueData, setRevenueData] = useState<Array<{ month: string; revenue: number; profit: number }>>([]);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = () => {
    loadPortfolioData();
    loadDashboardStats();
    loadRevenueData();
  };

  const loadDashboardStats = () => {
    try {
      const savedProperties = localStorage.getItem('investpro-properties');
      const savedInvestments = localStorage.getItem('investpro-user-investments');
      
      if (!savedProperties) return;
      
      const properties: PropertyObject[] = JSON.parse(savedProperties);
      const investments: UserInvestment[] = savedInvestments ? JSON.parse(savedInvestments) : [];
      
      const activeObjects = properties.filter(p => p.fundingProgress < 100).length;
      const totalVolume = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const avgReturn = properties.length > 0 
        ? properties.reduce((sum, p) => sum + p.expectedReturn, 0) / properties.length 
        : 0;
      const investorsCount = new Set(investments.map(inv => inv.userId)).size;
      
      setDashboardStats([
        { label: 'Активных объектов', value: activeObjects.toString(), change: '+12%', icon: 'Building2', color: 'text-primary' },
        { label: 'Общий объем', value: `₽${(totalVolume / 1000000).toFixed(1)}M`, change: '+8.3%', icon: 'TrendingUp', color: 'text-secondary' },
        { label: 'Средняя доходность', value: `${avgReturn.toFixed(1)}%`, change: '+2.1%', icon: 'Percent', color: 'text-primary' },
        { label: 'Инвесторов', value: investorsCount.toString(), change: `+${Math.floor(investorsCount * 0.1)}`, icon: 'Users', color: 'text-secondary' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadRevenueData = () => {
    try {
      const savedInvestments = localStorage.getItem('investpro-user-investments');
      const savedProperties = localStorage.getItem('investpro-properties');
      
      if (!savedInvestments || !savedProperties) {
        setRevenueData([]);
        return;
      }

      const investments: UserInvestment[] = JSON.parse(savedInvestments);
      const properties: PropertyObject[] = JSON.parse(savedProperties);
      
      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
      const data = months.map((month, index) => {
        const monthlyRevenue = investments
          .filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === index;
          })
          .reduce((sum, inv) => {
            const property = properties.find(p => p.id === inv.propertyId);
            return sum + (property ? inv.amount * (property.expectedReturn / 100) : 0);
          }, 0);
        
        return {
          month,
          revenue: Math.round(monthlyRevenue * 1.2),
          profit: Math.round(monthlyRevenue)
        };
      });
      
      setRevenueData(data);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setRevenueData([]);
    }
  };

  const loadPortfolioData = () => {
    try {
      const savedInvestments = localStorage.getItem('investpro-user-investments');
      const savedProperties = localStorage.getItem('investpro-properties');
      
      if (!savedInvestments || !savedProperties) {
        setPortfolioData([
          { name: 'Нет данных', value: 100, color: '#9CA3AF' }
        ]);
        return;
      }

      const investments: UserInvestment[] = JSON.parse(savedInvestments);
      const properties: PropertyObject[] = JSON.parse(savedProperties);

      const typeGroups: Record<string, number> = {};
      
      investments.forEach(inv => {
        const property = properties.find(p => p.id === inv.propertyId);
        if (!property) return;

        let typeName = 'Другое';
        if (property.propertyType === 'apartment' || property.propertyType === 'house') {
          typeName = 'Жилая недвижимость';
        } else if (property.propertyType === 'commercial') {
          typeName = 'Коммерческая недвижимость';
        } else if (property.propertyType === 'parking') {
          typeName = 'Паркинг';
        }

        typeGroups[typeName] = (typeGroups[typeName] || 0) + inv.amount;
      });

      if (Object.keys(typeGroups).length === 0) {
        setPortfolioData([
          { name: 'Нет инвестиций', value: 100, color: '#9CA3AF' }
        ]);
        return;
      }

      const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
      const data = Object.entries(typeGroups).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }));

      setPortfolioData(data);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setPortfolioData([
        { name: 'Ошибка загрузки', value: 100, color: '#EF4444' }
      ]);
    }
  };

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
                  label={({ name, percent }) => portfolioData.length > 0 && portfolioData[0].name !== 'Нет данных' && portfolioData[0].name !== 'Нет инвестиций' ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    portfolioData.length > 0 && portfolioData[0].name !== 'Нет данных' && portfolioData[0].name !== 'Нет инвестиций' 
                      ? `₽${(value / 1000000).toFixed(2)}M` 
                      : value,
                    'Сумма'
                  ]}
                />
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