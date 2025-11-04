import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import { InvestmentObject, Broker } from '@/types/investment-object';

const ObjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [object, setObject] = useState<InvestmentObject | null>(null);
  const [broker, setBroker] = useState<Broker | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: 'investor' | 'broker' } | null>(() => {
    const savedUser = localStorage.getItem('investpro-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      loadObject(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (object) {
      document.title = `${object.title} - InvestPro`;
    }
  }, [object]);

  const loadObject = (objectId: number) => {
    const savedObjects = localStorage.getItem('investment-objects');
    if (savedObjects) {
      const objects: InvestmentObject[] = JSON.parse(savedObjects);
      const foundObject = objects.find(obj => obj.id === objectId);
      if (foundObject) {
        setObject(foundObject);
        loadBroker(foundObject.brokerId);
        
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(objectId));
      }
    }
  };

  const loadBroker = (brokerId: number) => {
    const mockBroker: Broker = {
      id: brokerId,
      name: 'Иван Петров',
      company: 'Премиум Недвижимость',
      photo: 'https://via.placeholder.com/150',
      rating: 4.8,
      phone: '+7 (495) 123-45-67',
      email: 'broker@example.com',
      dealsCompleted: 156
    };
    setBroker(mockBroker);
  };

  const propertyTypeLabels: Record<string, string> = {
    flats: 'Квартиры',
    apartments: 'Апартаменты',
    commercial: 'Коммерческая',
    country: 'Загородная'
  };

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    available: { label: 'Свободен', variant: 'default' },
    reserved: { label: 'Бронь', variant: 'secondary' },
    sold: { label: 'Продано', variant: 'destructive' }
  };

  const toggleFavorite = () => {
    if (!object) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((favId: number) => favId !== object.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      localStorage.setItem('favorites', JSON.stringify([...favorites, object.id]));
      setIsFavorite(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'home') navigate('/');
    else if (tab === 'objects') navigate('/objects');
    else if (tab === 'calculator') navigate('/');
    else if (tab === 'dashboard') navigate('/');
  };

  if (!object) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          activeTab="objects"
          onTabChange={handleTabChange}
          user={user}
          onAuthClick={() => navigate('/')}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem('investpro-user');
            navigate('/');
          }}
          onRoleSwitch={() => {
            if (user) {
              const newUser = { ...user, role: user.role === 'broker' ? 'investor' as const : 'broker' as const };
              setUser(newUser);
              localStorage.setItem('investpro-user', JSON.stringify(newUser));
            }
          }}
        />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertCircle" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Объект не найден</h2>
            <Button onClick={() => navigate('/objects')}>
              Вернуться к каталогу
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const monthlyReturn = (object.price * object.yield / 100 / 12);

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab="objects"
        onTabChange={handleTabChange}
        user={user}
        onAuthClick={() => navigate('/')}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('investpro-user');
          navigate('/');
        }}
        onRoleSwitch={() => {
          if (user) {
            const newUser = { ...user, role: user.role === 'broker' ? 'investor' as const : 'broker' as const };
            setUser(newUser);
            localStorage.setItem('investpro-user', JSON.stringify(newUser));
          }
        }}
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate('/objects')} className="mb-6">
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Вернуться к каталогу
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="relative bg-muted rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
                <img
                  src={object.images[currentImageIndex] || 'https://via.placeholder.com/800x400'}
                  alt={object.title}
                  className="w-full h-full object-cover"
                />
                {object.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? object.images.length - 1 : prev - 1)}
                    >
                      <Icon name="ChevronLeft" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex(prev => prev === object.images.length - 1 ? 0 : prev + 1)}
                    >
                      <Icon name="ChevronRight" />
                    </Button>
                  </>
                )}
              </div>

              {object.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {object.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{object.title}</h1>
                  <p className="text-muted-foreground flex items-center">
                    <Icon name="MapPin" size={18} className="mr-2" />
                    {object.address}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFavorite}
                >
                  <Icon 
                    name="Heart" 
                    size={20} 
                    className={isFavorite ? 'fill-red-500 text-red-500' : ''} 
                  />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant={statusLabels[object.status].variant}>
                  {statusLabels[object.status].label}
                </Badge>
                <Badge variant="outline">{propertyTypeLabels[object.type]}</Badge>
                <Badge variant="outline">{object.area} м²</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{object.yield}%</div>
                    <div className="text-sm text-muted-foreground">Доходность</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1">{(object.price / 1000000).toFixed(1)} млн</div>
                    <div className="text-sm text-muted-foreground">Сумма входа</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1">{object.paybackPeriod} лет</div>
                    <div className="text-sm text-muted-foreground">Окупаемость</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Описание объекта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {object.description || 'Описание объекта будет добавлено позже.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Расчет доходности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость объекта:</span>
                    <span className="font-semibold">{object.price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Годовая доходность:</span>
                    <span className="font-semibold">{object.yield}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доход в год:</span>
                    <span className="font-semibold text-primary">
                      {(object.price * object.yield / 100).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доход в месяц:</span>
                    <span className="font-semibold text-primary">
                      {monthlyReturn.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-muted-foreground">Срок окупаемости:</span>
                    <span className="font-semibold">{object.paybackPeriod} лет</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {object.coordinates && (
              <Card>
                <CardHeader>
                  <CardTitle>Расположение на карте</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Карта будет здесь</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {broker && (
              <Card>
                <CardHeader>
                  <CardTitle>Ответственный брокер</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={broker.photo}
                      alt={broker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{broker.name}</h3>
                      <p className="text-sm text-muted-foreground">{broker.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="Star" size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{broker.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Phone" size={16} />
                      <span>{broker.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Mail" size={16} />
                      <span>{broker.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Briefcase" size={16} />
                      <span>Сделок: {broker.dealsCompleted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Запрос на консультацию</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Расскажите о своих пожеланиях..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>

            {object.documents && object.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Документы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {object.documents.map((doc, idx) => (
                    <Button key={idx} variant="outline" className="w-full justify-start">
                      <Icon name="FileText" size={18} className="mr-2" />
                      {doc.title}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetailPage;