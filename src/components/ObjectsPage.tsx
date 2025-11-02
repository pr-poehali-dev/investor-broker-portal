import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import type { UserInvestment } from '@/types/investment';

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

interface ObjectsPageProps {
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

const ObjectsPage = ({ investmentObjects }: ObjectsPageProps) => {
  const [selectedObject, setSelectedObject] = useState<InvestmentObject | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleInvest = () => {
    if (!selectedObject || !investmentAmount) return;
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < selectedObject.minInvestment) {
      alert(`Минимальная сумма инвестиции: ₽${selectedObject.minInvestment.toLocaleString()}`);
      return;
    }

    try {
      const savedUser = localStorage.getItem('investpro-user');
      if (!savedUser) {
        alert('Войдите в систему чтобы инвестировать');
        return;
      }

      const user = JSON.parse(savedUser);
      const userId = user.email;

      const savedInvestments = localStorage.getItem('investpro-user-investments');
      const investments: UserInvestment[] = savedInvestments ? JSON.parse(savedInvestments) : [];

      const savedProperties = localStorage.getItem('investpro-properties');
      if (!savedProperties) {
        alert('Объект не найден');
        return;
      }

      const properties = JSON.parse(savedProperties);
      const propertyId = `prop-${selectedObject.id}`;
      const property = properties.find((p: any) => p.id === propertyId || p.title === selectedObject.title);

      if (!property) {
        alert('Объект не найден в базе данных');
        return;
      }

      const existingInvestment = investments.find(
        inv => inv.userId === userId && inv.propertyId === property.id
      );

      if (existingInvestment) {
        const updatedInvestments = investments.map(inv => {
          if (inv.id === existingInvestment.id) {
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
        localStorage.setItem('investpro-user-investments', JSON.stringify(updatedInvestments));
        alert('Средства успешно довложены!');
      } else {
        const newInvestment: UserInvestment = {
          id: `inv-${Date.now()}-${Math.random()}`,
          userId,
          propertyId: property.id,
          propertyTitle: property.title,
          amount,
          date: new Date(),
          currentValue: amount,
          profit: 0,
          roi: 0,
        };
        investments.push(newInvestment);
        localStorage.setItem('investpro-user-investments', JSON.stringify(investments));
        alert('Инвестиция успешно создана!');
      }

      const updatedProperties = properties.map((p: any) => {
        if (p.id === property.id) {
          return {
            ...p,
            investment: {
              ...p.investment,
              currentInvestment: p.investment.currentInvestment + amount,
              investors: existingInvestment ? p.investment.investors : p.investment.investors + 1,
            },
          };
        }
        return p;
      });
      localStorage.setItem('investpro-properties', JSON.stringify(updatedProperties));

      setSelectedObject(null);
      setInvestmentAmount('');
    } catch (error) {
      console.error('Error creating investment:', error);
      alert('Произошла ошибка при создании инвестиции');
    }
  };

  return (
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

              <Button 
                className="w-full gap-2"
                onClick={() => setSelectedObject(obj)}
              >
                <Icon name="ArrowRight" size={18} />
                Инвестировать
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedObject} onOpenChange={(open) => {
        if (!open) {
          setSelectedObject(null);
          setInvestmentAmount('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Инвестировать в объект</DialogTitle>
            <DialogDescription>
              {selectedObject?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedObject && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Минимальная инвестиция:</span>
                  <span className="font-semibold">₽{selectedObject.minInvestment.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ожидаемая доходность:</span>
                  <span className="font-semibold text-green-600">{selectedObject.expectedReturn}% годовых</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Срок:</span>
                  <span className="font-semibold">{selectedObject.term} мес.</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invest-amount">Сумма инвестиции (₽)</Label>
                <Input
                  id="invest-amount"
                  type="number"
                  placeholder={`Минимум ${selectedObject.minInvestment}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedObject(null);
                    setInvestmentAmount('');
                  }}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleInvest}
                >
                  Инвестировать
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjectsPage;