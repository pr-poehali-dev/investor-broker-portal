import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PortfolioDataItem {
  name: string;
  value: number;
  color: string;
}

interface ProfitHistoryItem {
  month: string;
  profit: number;
}

interface PortfolioChartsProps {
  portfolioData: PortfolioDataItem[];
  profitHistory: ProfitHistoryItem[];
}

const PortfolioCharts = ({ portfolioData, profitHistory }: PortfolioChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Диверсификация портфеля</CardTitle>
          <CardDescription>Распределение по типам недвижимости</CardDescription>
        </CardHeader>
        <CardContent>
          {portfolioData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₽${(value / 1000000).toFixed(2)}M`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      ₽{(item.value / 1000000).toFixed(2)}M
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              Нет данных для отображения
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Динамика прибыли</CardTitle>
          <CardDescription>Рост прибыли за последние месяцы</CardDescription>
        </CardHeader>
        <CardContent>
          {profitHistory.length > 0 && profitHistory.some(h => h.profit > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₽${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value: number) => [`₽${(value / 1000).toFixed(2)}K`, 'Прибыль']}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              Нет данных для отображения
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioCharts;
