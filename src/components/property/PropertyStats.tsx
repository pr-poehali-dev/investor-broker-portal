import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PropertyStatsProps {
  totalProperties: number;
  activeProperties: number;
  totalInvestmentRaised: number;
  avgReturn: number;
}

const PropertyStats = ({ totalProperties, activeProperties, totalInvestmentRaised, avgReturn }: PropertyStatsProps) => {
  const stats = [
    { 
      label: 'Всего объектов', 
      value: totalProperties, 
      icon: 'Building2', 
      color: 'text-primary' 
    },
    { 
      label: 'Активных', 
      value: activeProperties, 
      icon: 'CheckCircle2', 
      color: 'text-green-600' 
    },
    { 
      label: 'Привлечено инвестиций', 
      value: `₽${(totalInvestmentRaised / 1000000).toFixed(1)}M`, 
      icon: 'Wallet', 
      color: 'text-secondary' 
    },
    { 
      label: 'Средняя доходность', 
      value: `${avgReturn.toFixed(1)}%`, 
      icon: 'TrendingUp', 
      color: 'text-green-600' 
    },
  ];

  return (
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyStats;
