import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  status: 'active' | 'pending' | 'completed';
}

interface BrokerDashboardProps {
  userName: string;
}

const BrokerDashboard = ({ userName }: BrokerDashboardProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [myObjects, setMyObjects] = useState<InvestmentObject[]>([
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
      image: '🏢',
      status: 'active'
    }
  ]);

  const stats = [
    { label: 'Активных объектов', value: myObjects.filter(o => o.status === 'active').length, icon: 'Building2', color: 'text-primary' },
    { label: 'Привлечено капитала', value: '₽12.5M', icon: 'Wallet', color: 'text-green-600' },
    { label: 'Инвесторов', value: '47', icon: 'Users', color: 'text-secondary' },
    { label: 'Средняя доходность', value: '19.2%', icon: 'TrendingUp', color: 'text-primary' }
  ];

  const [newObject, setNewObject] = useState({
    title: '',
    location: '',
    type: 'residential',
    minInvestment: '',
    expectedReturn: '',
    term: '',
    risk: 'medium',
    description: ''
  });

  const handleAddObject = () => {
    const object: InvestmentObject = {
      id: Date.now(),
      title: newObject.title,
      location: newObject.location,
      type: newObject.type === 'residential' ? 'Жилая недвижимость' : 'Коммерческая недвижимость',
      minInvestment: parseInt(newObject.minInvestment),
      expectedReturn: parseInt(newObject.expectedReturn),
      term: parseInt(newObject.term),
      risk: newObject.risk === 'low' ? 'Низкий' : newObject.risk === 'medium' ? 'Средний' : 'Высокий',
      progress: 0,
      image: newObject.type === 'residential' ? '🏢' : '🏬',
      status: 'pending'
    };
    setMyObjects([...myObjects, object]);
    setShowAddModal(false);
    setNewObject({
      title: '',
      location: '',
      type: 'residential',
      minInvestment: '',
      expectedReturn: '',
      term: '',
      risk: 'medium',
      description: ''
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Низкий': return 'bg-green-500';
      case 'Средний': return 'bg-yellow-500';
      case 'Высокий': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">Активен</Badge>;
      case 'pending': return <Badge className="bg-yellow-500">На модерации</Badge>;
      case 'completed': return <Badge className="bg-gray-500">Завершен</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Кабинет брокера</h2>
          <p className="text-muted-foreground">Добро пожаловать, {userName}!</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Добавить объект
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Новый объект недвижимости</DialogTitle>
              <DialogDescription>
                Заполните информацию об инвестиционном объекте
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название объекта</Label>
                <Input
                  id="title"
                  placeholder="ЖК «Пример»"
                  value={newObject.title}
                  onChange={(e) => setNewObject({ ...newObject, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Локация</Label>
                <Input
                  id="location"
                  placeholder="Москва, ЦАО"
                  value={newObject.location}
                  onChange={(e) => setNewObject({ ...newObject, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип недвижимости</Label>
                  <Select value={newObject.type} onValueChange={(v) => setNewObject({ ...newObject, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Жилая</SelectItem>
                      <SelectItem value="commercial">Коммерческая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">Уровень риска</Label>
                  <Select value={newObject.risk} onValueChange={(v) => setNewObject({ ...newObject, risk: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minInvestment">Мин. инвестиция (₽)</Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    placeholder="500000"
                    value={newObject.minInvestment}
                    onChange={(e) => setNewObject({ ...newObject, minInvestment: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedReturn">Доходность (%)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    placeholder="18"
                    value={newObject.expectedReturn}
                    onChange={(e) => setNewObject({ ...newObject, expectedReturn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Срок (мес.)</Label>
                  <Input
                    id="term"
                    type="number"
                    placeholder="24"
                    value={newObject.term}
                    onChange={(e) => setNewObject({ ...newObject, term: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Подробное описание проекта..."
                  rows={4}
                  value={newObject.description}
                  onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                />
              </div>
              <Button onClick={handleAddObject} className="w-full gap-2">
                <Icon name="Check" size={18} />
                Создать объект
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мои объекты</CardTitle>
          <CardDescription>Управление вашими инвестиционными предложениями</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myObjects.map((obj) => (
              <div key={obj.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{obj.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{obj.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          {obj.location}
                        </p>
                      </div>
                      {getStatusBadge(obj.status)}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{obj.type}</Badge>
                      <Badge className={`${getRiskColor(obj.risk)} text-white`}>{obj.risk}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Минимум:</span>
                        <p className="font-semibold">₽{(obj.minInvestment / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Доходность:</span>
                        <p className="font-semibold text-green-600">{obj.expectedReturn}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Срок:</span>
                        <p className="font-semibold">{obj.term} мес.</p>
                      </div>
                    </div>
                    {obj.status === 'active' && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Сбор средств</span>
                          <span className="font-semibold">{obj.progress}%</span>
                        </div>
                        <Progress value={obj.progress} className="h-2" />
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Icon name="Edit" size={16} />
                        Редактировать
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Icon name="Users" size={16} />
                        Инвесторы
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Icon name="BarChart" size={16} />
                        Аналитика
                      </Button>
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

export default BrokerDashboard;
