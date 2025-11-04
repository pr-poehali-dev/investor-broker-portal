import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { InvestmentObject } from '@/types/investment-object';
import { useNavigate } from 'react-router-dom';

interface BrokerObjectsManagerProps {
  onAddClick: () => void;
}

const BrokerObjectsManager = ({ onAddClick }: BrokerObjectsManagerProps) => {
  const navigate = useNavigate();
  const [objects, setObjects] = useState<InvestmentObject[]>([]);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = () => {
    const savedObjects = localStorage.getItem('investment-objects');
    if (savedObjects) {
      setObjects(JSON.parse(savedObjects));
    }
  };

  const updateObjectStatus = (id: number, status: 'available' | 'reserved' | 'sold') => {
    const savedObjects = localStorage.getItem('investment-objects');
    if (savedObjects) {
      const objects: InvestmentObject[] = JSON.parse(savedObjects);
      const updatedObjects = objects.map(obj => 
        obj.id === id ? { ...obj, status } : obj
      );
      localStorage.setItem('investment-objects', JSON.stringify(updatedObjects));
      setObjects(updatedObjects);
    }
  };

  const deleteObject = (id: number) => {
    if (!confirm('Удалить этот объект?')) return;
    
    const savedObjects = localStorage.getItem('investment-objects');
    if (savedObjects) {
      const objects: InvestmentObject[] = JSON.parse(savedObjects);
      const updatedObjects = objects.filter(obj => obj.id !== id);
      localStorage.setItem('investment-objects', JSON.stringify(updatedObjects));
      setObjects(updatedObjects);
    }
  };

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    available: { label: 'Свободен', variant: 'default' },
    reserved: { label: 'Бронь', variant: 'secondary' },
    sold: { label: 'Продано', variant: 'destructive' }
  };

  const propertyTypeLabels: Record<string, string> = {
    flats: 'Квартиры',
    apartments: 'Апартаменты',
    commercial: 'Коммерческая',
    country: 'Загородная'
  };

  const stats = {
    total: objects.length,
    available: objects.filter(o => o.status === 'available').length,
    reserved: objects.filter(o => o.status === 'reserved').length,
    sold: objects.filter(o => o.status === 'sold').length,
    totalValue: objects.reduce((sum, o) => sum + o.price, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Мои объекты</h2>
          <p className="text-muted-foreground">Управление инвестиционными объектами</p>
        </div>
        <Button onClick={onAddClick} className="gap-2">
          <Icon name="Plus" size={18} />
          Добавить объект
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Icon name="Building2" size={32} className="text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Свободно</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Бронь</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.reserved}</p>
              </div>
              <Icon name="Clock" size={32} className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Продано</p>
                <p className="text-2xl font-bold text-red-600">{stats.sold}</p>
              </div>
              <Icon name="XCircle" size={32} className="text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Объем</p>
                <p className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(0)}M</p>
              </div>
              <Icon name="TrendingUp" size={32} className="text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {objects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Icon name="Building2" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Объектов пока нет</h3>
              <p className="text-muted-foreground mb-4">
                Добавьте первый объект для начала работы
              </p>
              <Button onClick={onAddClick}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить объект
              </Button>
            </CardContent>
          </Card>
        ) : (
          objects.map((object) => (
            <Card key={object.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-32 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={object.images[0] || 'https://via.placeholder.com/200x150'}
                      alt={object.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{object.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Icon name="MapPin" size={14} className="mr-1" />
                          {object.address}
                        </p>
                      </div>
                      <Badge variant={statusLabels[object.status].variant}>
                        {statusLabels[object.status].label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Тип</p>
                        <p className="font-medium text-sm">{propertyTypeLabels[object.type]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Площадь</p>
                        <p className="font-medium text-sm">{object.area} м²</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Цена</p>
                        <p className="font-medium text-sm">{(object.price / 1000000).toFixed(1)} млн ₽</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Доходность</p>
                        <p className="font-medium text-sm text-primary">{object.yield}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Окупаемость</p>
                        <p className="font-medium text-sm">{object.paybackPeriod} лет</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/objects/${object.id}`)}
                      >
                        <Icon name="Eye" size={14} className="mr-1" />
                        Посмотреть
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateObjectStatus(object.id, 'available')}
                        disabled={object.status === 'available'}
                      >
                        <Icon name="CheckCircle" size={14} className="mr-1" />
                        Свободен
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateObjectStatus(object.id, 'reserved')}
                        disabled={object.status === 'reserved'}
                      >
                        <Icon name="Clock" size={14} className="mr-1" />
                        Забронировать
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateObjectStatus(object.id, 'sold')}
                        disabled={object.status === 'sold'}
                      >
                        <Icon name="XCircle" size={14} className="mr-1" />
                        Продано
                      </Button>

                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteObject(object.id)}
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BrokerObjectsManager;
