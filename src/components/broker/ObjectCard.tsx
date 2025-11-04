import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface InvestmentObject {
  id: number;
  title: string;
  location: string;
  type: string;
  price: number;
  expectedReturn: number;
  term: number;
  risk: string;
  image: string;
  status: 'active' | 'pending' | 'completed';
  description: string;
  investors: number;
  revenue: number;
  monthlyGrowth: number;
  financing: {
    cash: boolean;
    mortgage?: { available: boolean; rate?: number; downPayment?: number };
    installment?: { available: boolean; months?: number; downPayment?: number };
  };
}

interface ObjectCardProps {
  object: InvestmentObject;
  onEdit: (object: InvestmentObject) => void;
  onDelete: (id: number) => void;
  getRiskColor: (risk: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const ObjectCard = ({ object, onEdit, onDelete, getRiskColor, getStatusBadge }: ObjectCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{object.image}</div>
            <div>
              <CardTitle className="text-lg">{object.title}</CardTitle>
              <CardDescription>{object.location}</CardDescription>
            </div>
          </div>
          {getStatusBadge(object.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">₽{object.price.toLocaleString()}</span>
            <span className="text-sm text-green-600 font-medium">{object.expectedReturn}% годовых</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Тип</p>
              <p className="font-medium">{object.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Окупаемость</p>
              <p className="font-medium">{object.term} мес</p>
            </div>
            <div>
              <p className="text-muted-foreground">Риск</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getRiskColor(object.risk)}`}></div>
                <p className="font-medium">{object.risk}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Инвесторов</p>
              <p className="font-medium">{object.investors}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Способы приобретения:</p>
          <div className="flex flex-wrap gap-2">
            {object.financing.cash && (
              <Badge variant="secondary" className="gap-1">
                <Icon name="Wallet" size={14} />
                Полная оплата
              </Badge>
            )}
            {object.financing.mortgage?.available && (
              <Badge variant="secondary" className="gap-1">
                <Icon name="Home" size={14} />
                Ипотека {object.financing.mortgage.rate}%
              </Badge>
            )}
            {object.financing.installment?.available && (
              <Badge variant="secondary" className="gap-1">
                <Icon name="Calendar" size={14} />
                Рассрочка {object.financing.installment.months} мес
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg text-sm">
          <div>
            <p className="text-muted-foreground">Выручка</p>
            <p className="font-medium">₽{object.revenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Рост/месяц</p>
            <p className="font-medium text-green-600">+₽{object.monthlyGrowth.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={() => onEdit(object)}>
            <Icon name="Edit" size={16} />
            Редактировать
          </Button>
          <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => onDelete(object.id)}>
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectCard;