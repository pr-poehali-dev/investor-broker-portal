import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { PropertyObject, UserInvestment } from '@/types/investment';

interface InvestmentsListProps {
  myInvestments: UserInvestment[];
  properties: PropertyObject[];
  onEditInvestment: (investment: UserInvestment) => void;
  calculateProfit: (invested: number, currentValue: number) => { profit: number; percentage: string };
}

const InvestmentsList = ({ myInvestments, properties, onEditInvestment, calculateProfit }: InvestmentsListProps) => {
  const getPropertyById = (id: string): PropertyObject | undefined => {
    return properties.find(p => p.id === id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои инвестиции</CardTitle>
      </CardHeader>
      <CardContent>
        {myInvestments.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="TrendingUp" className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет активных инвестиций</h3>
            <p className="text-muted-foreground mb-4">
              Начните инвестировать в недвижимость уже сегодня
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myInvestments.map((investment) => {
              const property = getPropertyById(investment.propertyId);
              if (!property) return null;

              const { profit, percentage } = calculateProfit(investment.amount, investment.currentValue);
              const fundingProgress = (investment.amount / property.investment.totalCost) * 100;

              return (
                <div key={investment.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">{property.location.address}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditInvestment(investment)}
                    >
                      <Icon name="Settings" className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Инвестировано</p>
                      <p className="font-semibold">₽{investment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Текущая стоимость</p>
                      <p className="font-semibold">₽{investment.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Прибыль</p>
                      <p className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}₽{profit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={parseFloat(percentage) >= 0 ? 'default' : 'destructive'}>
                          {parseFloat(percentage) >= 0 ? '+' : ''}{percentage}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Ваша доля в объекте</span>
                      <span className="font-medium">{fundingProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={fundingProgress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Calendar" className="w-3 h-3" />
                    <span>Дата инвестиции: {investment.date.toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentsList;
