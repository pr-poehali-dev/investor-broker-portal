import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

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

              <Button className="w-full gap-2">
                <Icon name="ArrowRight" size={18} />
                Инвестировать
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ObjectsPage;
