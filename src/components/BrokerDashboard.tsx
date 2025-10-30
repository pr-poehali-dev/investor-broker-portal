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
  description: string;
  totalRaised: number;
  investors: number;
  revenue: number;
  monthlyGrowth: number;
}

interface Investor {
  id: number;
  name: string;
  email: string;
  totalInvested: number;
  activeProjects: number;
  joinedDate: string;
}

interface BrokerDashboardProps {
  userName: string;
}

const BrokerDashboard = ({ userName }: BrokerDashboardProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingObject, setEditingObject] = useState<InvestmentObject | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  
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
      status: 'active',
      description: 'Современный жилой комплекс в северном округе Москвы',
      totalRaised: 8500000,
      investors: 17,
      revenue: 1870000,
      monthlyGrowth: 155800
    }
  ]);

  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: 1,
      name: 'Иванов Сергей',
      email: 'ivanov@example.com',
      totalInvested: 1500000,
      activeProjects: 3,
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Петрова Елена',
      email: 'petrova@example.com',
      totalInvested: 2300000,
      activeProjects: 5,
      joinedDate: '2023-11-20'
    },
    {
      id: 3,
      name: 'Смирнов Дмитрий',
      email: 'smirnov@example.com',
      totalInvested: 800000,
      activeProjects: 2,
      joinedDate: '2024-03-10'
    }
  ]);

  const totalRaised = myObjects.reduce((sum, obj) => sum + obj.totalRaised, 0);
  const totalInvestors = investors.length;
  const totalRevenue = myObjects.reduce((sum, obj) => sum + obj.revenue, 0);
  const avgReturn = myObjects.reduce((sum, obj) => sum + obj.expectedReturn, 0) / myObjects.length || 0;

  const stats = [
    { label: 'Активных объектов', value: myObjects.filter(o => o.status === 'active').length, icon: 'Building2', color: 'text-primary' },
    { label: 'Привлечено капитала', value: `₽${(totalRaised / 1000000).toFixed(1)}M`, icon: 'Wallet', color: 'text-green-600' },
    { label: 'Инвесторов', value: totalInvestors, icon: 'Users', color: 'text-secondary' },
    { label: 'Средняя доходность', value: `${avgReturn.toFixed(1)}%`, icon: 'TrendingUp', color: 'text-primary' },
    { label: 'Выручка', value: `₽${(totalRevenue / 1000000).toFixed(1)}M`, icon: 'DollarSign', color: 'text-green-600' }
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
      status: 'pending',
      description: newObject.description,
      totalRaised: 0,
      investors: 0,
      revenue: 0,
      monthlyGrowth: 0
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

  const handleUpdateObject = () => {
    if (!editingObject) return;
    setMyObjects(prev => prev.map(obj => obj.id === editingObject.id ? editingObject : obj));
    setEditingObject(null);
  };

  const handleDeleteObject = (id: number) => {
    setMyObjects(prev => prev.filter(obj => obj.id !== id));
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
              <Button onClick={handleAddObject} className="w-full">
                Создать объект
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <CardDescription>Управление инвестиционными проектами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myObjects.map((obj) => (
              <div key={obj.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{obj.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{obj.title}</h3>
                      {getStatusBadge(obj.status)}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <Icon name="MapPin" size={14} />
                      {obj.location}
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary">{obj.type}</Badge>
                      <Badge className={getRiskColor(obj.risk)}>{obj.risk} риск</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Привлечено:</span>
                        <p className="font-semibold">₽{(obj.totalRaised / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Инвесторов:</span>
                        <p className="font-semibold">{obj.investors}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Выручка:</span>
                        <p className="font-semibold text-green-600">₽{(obj.revenue / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground">+₽{(obj.monthlyGrowth / 1000).toFixed(1)}K/мес</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Доходность:</span>
                        <p className="font-semibold">{obj.expectedReturn}%</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-semibold">{obj.progress}%</span>
                      </div>
                      <Progress value={obj.progress} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Dialog open={editingObject?.id === obj.id} onOpenChange={(open) => !open && setEditingObject(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditingObject({...obj})}>
                            <Icon name="Edit" size={16} />
                            Редактировать
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Редактировать объект</DialogTitle>
                            <DialogDescription>Обновите информацию о проекте</DialogDescription>
                          </DialogHeader>
                          {editingObject && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Название</Label>
                                <Input
                                  value={editingObject.title}
                                  onChange={(e) => setEditingObject({ ...editingObject, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Локация</Label>
                                <Input
                                  value={editingObject.location}
                                  onChange={(e) => setEditingObject({ ...editingObject, location: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Описание</Label>
                                <Textarea
                                  value={editingObject.description}
                                  onChange={(e) => setEditingObject({ ...editingObject, description: e.target.value })}
                                  rows={4}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Прогресс (%)</Label>
                                  <Input
                                    type="number"
                                    value={editingObject.progress}
                                    onChange={(e) => setEditingObject({ ...editingObject, progress: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Доходность (%)</Label>
                                  <Input
                                    type="number"
                                    value={editingObject.expectedReturn}
                                    onChange={(e) => setEditingObject({ ...editingObject, expectedReturn: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Выручка (₽)</Label>
                                  <Input
                                    type="number"
                                    value={editingObject.revenue}
                                    onChange={(e) => setEditingObject({ ...editingObject, revenue: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Рост/месяц (₽)</Label>
                                  <Input
                                    type="number"
                                    value={editingObject.monthlyGrowth}
                                    onChange={(e) => setEditingObject({ ...editingObject, monthlyGrowth: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                              </div>
                              <Button onClick={handleUpdateObject} className="w-full">
                                Сохранить изменения
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700" onClick={() => handleDeleteObject(obj.id)}>
                        <Icon name="Trash2" size={16} />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Инвесторы</CardTitle>
          <CardDescription>Список ваших инвесторов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {investors.map((investor) => (
              <div key={investor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedInvestor(investor)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{investor.name}</p>
                      <p className="text-sm text-muted-foreground">{investor.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₽{(investor.totalInvested / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">{investor.activeProjects} проектов</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedInvestor !== null} onOpenChange={() => setSelectedInvestor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Профиль инвестора</DialogTitle>
            <DialogDescription>Подробная информация</DialogDescription>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={32} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedInvestor.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvestor.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Всего инвестировано</p>
                  <p className="text-xl font-bold">₽{(selectedInvestor.totalInvested / 1000000).toFixed(1)}M</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Активных проектов</p>
                  <p className="text-xl font-bold">{selectedInvestor.activeProjects}</p>
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Дата регистрации</p>
                <p className="font-semibold">{new Date(selectedInvestor.joinedDate).toLocaleDateString('ru-RU')}</p>
              </div>
              <Button className="w-full gap-2">
                <Icon name="MessageSquare" size={18} />
                Написать сообщение
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrokerDashboard;
