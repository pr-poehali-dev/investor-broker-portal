import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import StatCards from '@/components/broker/StatCards';
import ObjectCard from '@/components/broker/ObjectCard';
import AddObjectDialog from '@/components/broker/AddObjectDialog';
import EditObjectDialog from '@/components/broker/EditObjectDialog';
import InvestorCard from '@/components/broker/InvestorCard';

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
  
  const [myObjects, setMyObjects] = useState<InvestmentObject[]>(() => {
    const saved = localStorage.getItem('broker-objects');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'ЖК «Северный квартал»',
        location: 'Москва, САО',
        type: 'Жилая недвижимость',
        price: 8500000,
        expectedReturn: 22,
        term: 24,
        risk: 'Средний',
        image: '🏢',
        status: 'active',
        description: 'Современный жилой комплекс в северном округе Москвы',
        investors: 17,
        revenue: 1870000,
        monthlyGrowth: 155800,
        financing: {
          cash: true,
          mortgage: { available: true, rate: 12.5, downPayment: 30 },
          installment: { available: true, months: 36, downPayment: 20 }
        }
      }
    ];
  });

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

  const totalPortfolioValue = myObjects.reduce((sum, obj) => sum + obj.price, 0);
  const totalInvestors = investors.length;
  const totalRevenue = myObjects.reduce((sum, obj) => sum + obj.revenue, 0);
  const avgReturn = myObjects.reduce((sum, obj) => sum + obj.expectedReturn, 0) / myObjects.length || 0;

  const stats = [
    { label: 'Активных объектов', value: myObjects.filter(o => o.status === 'active').length, icon: 'Building2', color: 'text-primary' },
    { label: 'Стоимость портфеля', value: `₽${(totalPortfolioValue / 1000000).toFixed(1)}M`, icon: 'Wallet', color: 'text-green-600' },
    { label: 'Инвесторов', value: totalInvestors, icon: 'Users', color: 'text-secondary' },
    { label: 'Средняя доходность', value: `${avgReturn.toFixed(1)}%`, icon: 'TrendingUp', color: 'text-primary' },
    { label: 'Выручка', value: `₽${(totalRevenue / 1000000).toFixed(1)}M`, icon: 'DollarSign', color: 'text-green-600' }
  ];

  const [newObject, setNewObject] = useState({
    title: '',
    location: '',
    type: 'residential',
    price: '',
    expectedReturn: '',
    term: '',
    risk: 'medium',
    description: '',
    financing: {
      cash: true,
      mortgage: { available: false, rate: '', downPayment: '' },
      installment: { available: false, months: '', downPayment: '' }
    }
  });

  const handleAddObject = () => {
    const object: InvestmentObject = {
      id: Date.now(),
      title: newObject.title,
      location: newObject.location,
      type: newObject.type === 'residential' ? 'Жилая недвижимость' : 'Коммерческая недвижимость',
      price: parseInt(newObject.price),
      expectedReturn: parseInt(newObject.expectedReturn),
      term: parseInt(newObject.term),
      risk: newObject.risk === 'low' ? 'Низкий' : newObject.risk === 'medium' ? 'Средний' : 'Высокий',
      image: newObject.type === 'residential' ? '🏢' : '🏬',
      status: 'pending',
      description: newObject.description,
      investors: 0,
      revenue: 0,
      monthlyGrowth: 0,
      financing: {
        cash: newObject.financing.cash,
        mortgage: newObject.financing.mortgage.available ? {
          available: true,
          rate: parseFloat(newObject.financing.mortgage.rate),
          downPayment: parseFloat(newObject.financing.mortgage.downPayment)
        } : undefined,
        installment: newObject.financing.installment.available ? {
          available: true,
          months: parseInt(newObject.financing.installment.months),
          downPayment: parseFloat(newObject.financing.installment.downPayment)
        } : undefined
      }
    };
    const updated = [...myObjects, object];
    setMyObjects(updated);
    localStorage.setItem('broker-objects', JSON.stringify(updated));
    setShowAddModal(false);
    setNewObject({
      title: '',
      location: '',
      type: 'residential',
      price: '',
      expectedReturn: '',
      term: '',
      risk: 'medium',
      description: '',
      financing: {
        cash: true,
        mortgage: { available: false, rate: '', downPayment: '' },
        installment: { available: false, months: '', downPayment: '' }
      }
    });
  };

  const handleUpdateObject = () => {
    if (!editingObject) return;
    const updated = myObjects.map(obj => obj.id === editingObject.id ? editingObject : obj);
    setMyObjects(updated);
    localStorage.setItem('broker-objects', JSON.stringify(updated));
    setEditingObject(null);
  };

  const handleDeleteObject = (id: number) => {
    const filtered = myObjects.filter(obj => obj.id !== id);
    setMyObjects(filtered);
    localStorage.setItem('broker-objects', JSON.stringify(filtered));
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
        <AddObjectDialog
          open={showAddModal}
          onOpenChange={setShowAddModal}
          newObject={newObject}
          onNewObjectChange={setNewObject}
          onSubmit={handleAddObject}
        />
      </div>

      <StatCards stats={stats} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Мои объекты</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Building2" size={18} />
            <span>{myObjects.length} объектов</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myObjects.map(object => (
            <ObjectCard
              key={object.id}
              object={object}
              onEdit={setEditingObject}
              onDelete={handleDeleteObject}
              getRiskColor={getRiskColor}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Мои инвесторы</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Users" size={18} />
            <span>{investors.length} инвесторов</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investors.map(investor => (
            <InvestorCard
              key={investor.id}
              investor={investor}
              onClick={setSelectedInvestor}
            />
          ))}
        </div>
      </div>

      <EditObjectDialog
        object={editingObject}
        onClose={() => setEditingObject(null)}
        onObjectChange={setEditingObject}
        onSubmit={handleUpdateObject}
      />

      <Dialog open={!!selectedInvestor} onOpenChange={(open) => !open && setSelectedInvestor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Информация об инвесторе</DialogTitle>
            <DialogDescription>
              Детальная информация и история взаимодействий
            </DialogDescription>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="User" size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedInvestor.name}</h4>
                  <p className="text-muted-foreground">{selectedInvestor.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Всего инвестировано</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₽{selectedInvestor.totalInvested.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Активных проектов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedInvestor.activeProjects}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Дата регистрации</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold">
                      {new Date(selectedInvestor.joinedDate).toLocaleDateString('ru-RU')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>История взаимодействий</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">История взаимодействий пока пуста</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrokerDashboard;