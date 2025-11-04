import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import ObjectsFilters from './ObjectsFilters';
import ObjectCard from './ObjectCard';
import { InvestmentObject, ObjectFilters } from '@/types/investment-object';
import { api, InvestmentObjectDB } from '@/services/api';

const ObjectsPage = () => {
  const navigate = useNavigate();
  const [objects, setObjects] = useState<InvestmentObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ObjectFilters>({
    search: '',
    cities: [],
    types: [],
    priceRange: [0, 500000000],
    yieldRanges: [],
    paybackRanges: [],
    status: undefined
  });
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: 'investor' | 'broker' } | null>(() => {
    const savedUser = localStorage.getItem('investpro-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    document.title = 'Каталог объектов для инвестиций - InvestPro';
    loadObjects();
    loadFiltersFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem('object-filters', JSON.stringify(filters));
  }, [filters]);

  const loadObjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dbObjects = await api.getObjects({ status: 'available' });
      
      const convertedObjects: InvestmentObject[] = dbObjects.map((obj: InvestmentObjectDB) => ({
        id: obj.id,
        title: obj.title,
        city: obj.city,
        address: obj.address,
        type: obj.property_type,
        price: obj.price,
        yield: obj.yield_percent,
        paybackPeriod: obj.payback_years,
        images: obj.images || [],
        status: obj.status,
        createdAt: obj.created_at || new Date().toISOString()
      }));
      
      setObjects(convertedObjects);
      
      const savedLocalObjects = localStorage.getItem('investment-objects');
      if (savedLocalObjects) {
        const localObjects = JSON.parse(savedLocalObjects);
        setObjects([...convertedObjects, ...localObjects]);
      }
    } catch (err) {
      console.error('Failed to load objects from API:', err);
      setError(err instanceof Error ? err.message : 'Failed to load objects');
      
      const savedObjects = localStorage.getItem('investment-objects');
      if (savedObjects) {
        setObjects(JSON.parse(savedObjects));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFiltersFromStorage = () => {
    const savedFilters = localStorage.getItem('object-filters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  };

  const filteredObjects = useMemo(() => {
    let result = [...objects];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(obj => 
        obj.title.toLowerCase().includes(searchLower) ||
        obj.address.toLowerCase().includes(searchLower)
      );
    }

    if (filters.cities.length > 0) {
      result = result.filter(obj => filters.cities.includes(obj.city));
    }

    if (filters.types.length > 0) {
      result = result.filter(obj => filters.types.includes(obj.type));
    }

    result = result.filter(obj => 
      obj.price >= filters.priceRange[0] && obj.price <= filters.priceRange[1]
    );

    if (filters.yieldRanges.length > 0) {
      result = result.filter(obj => {
        return filters.yieldRanges.some(range => {
          if (range === '0-30') return obj.yield <= 30;
          if (range === '31-50') return obj.yield >= 31 && obj.yield <= 50;
          if (range === '51-100') return obj.yield >= 51 && obj.yield <= 100;
          if (range === '100+') return obj.yield > 100;
          return false;
        });
      });
    }

    if (filters.paybackRanges.length > 0) {
      result = result.filter(obj => {
        return filters.paybackRanges.some(range => {
          if (range === '0-5') return obj.paybackPeriod <= 5;
          if (range === '5-8') return obj.paybackPeriod >= 5 && obj.paybackPeriod <= 8;
          if (range === '8-12') return obj.paybackPeriod >= 8 && obj.paybackPeriod <= 12;
          if (range === '12+') return obj.paybackPeriod > 12;
          return false;
        });
      });
    }

    if (filters.status) {
      result = result.filter(obj => obj.status === filters.status);
    }

    switch (sortBy) {
      case 'yield-asc':
        result.sort((a, b) => a.yield - b.yield);
        break;
      case 'yield-desc':
        result.sort((a, b) => b.yield - a.yield);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [objects, filters, sortBy]);

  const getMockObjects = (): InvestmentObject[] => {
    return [];
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'home') navigate('/');
    else if (tab === 'objects') navigate('/objects');
    else if (tab === 'calculator') navigate('/');
    else if (tab === 'dashboard') navigate('/');
  };

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

      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Каталог объектов для инвестиций
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Подберите объект по вашим критериям доходности и бюджета
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/')}>
            <Icon name="Sparkles" className="mr-2" />
            Получить персональную подборку
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <ObjectsFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">
                  Найдено объектов: <span className="font-semibold text-foreground">{filteredObjects.length}</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Icon name="SlidersHorizontal" size={16} className="mr-2" />
                  Фильтры
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Сортировка:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">По умолчанию</SelectItem>
                    <SelectItem value="yield-desc">По доходности ↓</SelectItem>
                    <SelectItem value="yield-asc">По доходности ↑</SelectItem>
                    <SelectItem value="price-asc">По цене ↑</SelectItem>
                    <SelectItem value="price-desc">По цене ↓</SelectItem>
                    <SelectItem value="date">По дате добавления</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <ObjectsFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Загрузка объектов...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16">
                <Icon name="AlertCircle" size={48} className="mx-auto text-destructive mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ошибка загрузки</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={loadObjects}>Попробовать снова</Button>
              </div>
            )}

            {!loading && !error && filteredObjects.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Объекты не найдены</h3>
                <p className="text-muted-foreground mb-4">
                  Попробуйте изменить параметры фильтрации
                </p>
                <Button variant="outline" onClick={() => setFilters({
                  search: '',
                  cities: [],
                  types: [],
                  priceRange: [0, 500000000],
                  yieldRanges: [],
                  paybackRanges: [],
                  status: undefined
                })}>
                  Сбросить фильтры
                </Button>
              </div>
            ) : !loading && !error && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredObjects.map((object) => (
                  <ObjectCard key={object.id} object={object} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ObjectsPage;