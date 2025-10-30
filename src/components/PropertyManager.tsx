import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import TelegramPublisher from '@/components/TelegramPublisher';
import type { PropertyObject, PropertyType, FinancingMethod, InvestmentStrategy, RiskLevel, PropertyStatus } from '@/types/investment';

interface PropertyManagerProps {
  brokerId: string;
  brokerName: string;
}

const PropertyManager = ({ brokerId, brokerName }: PropertyManagerProps) => {
  const [properties, setProperties] = useState<PropertyObject[]>([
    {
      id: '1',
      brokerId: 'broker-001',
      brokerName: 'Иван Петров',
      title: 'Квартира в центре Москвы',
      description: 'Современная двухкомнатная квартира с панорамным остеклением',
      propertyType: 'apartment',
      status: 'active',
      location: {
        city: 'Москва',
        district: 'Пресненский',
        address: 'ул. Красная Пресня, д. 15',
        metro: 'Баррикадная',
        metroDistance: 5,
      },
      pricing: {
        totalPrice: 25000000,
        pricePerMeter: 350000,
        minInvestment: 5000000,
        currency: 'RUB',
      },
      financing: {
        method: 'mortgage',
        mortgageRate: 8.5,
        downPayment: 20,
      },
      investment: {
        strategy: ['resale', 'rental'],
        expectedReturn: 18,
        term: 36,
        riskLevel: 'medium',
        currentInvestment: 15000000,
        targetInvestment: 25000000,
        investors: 3,
      },
      rental: {
        monthlyIncome: 120000,
        occupancyRate: 95,
        rentalYield: 5.76,
      },
      resale: {
        expectedPrice: 30000000,
        expectedProfit: 5000000,
        marketGrowth: 6.5,
      },
      details: {
        area: 72,
        rooms: 2,
        floor: 12,
        totalFloors: 25,
        buildYear: 2023,
        condition: 'Отличное',
        parking: true,
        furnishing: 'С мебелью',
      },
      media: {
        images: [],
        videos: [],
      },
      metadata: {
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-10-30'),
        views: 234,
        favorites: 12,
      },
      sharing: {
        telegramPublished: true,
        telegramUrl: 'https://t.me/channel/123',
        vkPublished: false,
      },
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyObject | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyObject>>({});

  const getEmptyProperty = (): Partial<PropertyObject> => ({
    title: '',
    description: '',
    propertyType: 'apartment',
    status: 'draft',
    location: {
      city: '',
      district: '',
      address: '',
      metro: '',
      metroDistance: 0,
    },
    pricing: {
      totalPrice: 0,
      pricePerMeter: 0,
      minInvestment: 0,
      currency: 'RUB',
    },
    financing: {
      method: 'cash',
      mortgageRate: 0,
      installmentMonths: 0,
      downPayment: 0,
    },
    investment: {
      strategy: [],
      expectedReturn: 0,
      term: 0,
      riskLevel: 'medium',
      currentInvestment: 0,
      targetInvestment: 0,
      investors: 0,
    },
    rental: {
      monthlyIncome: 0,
      occupancyRate: 0,
      rentalYield: 0,
    },
    resale: {
      expectedPrice: 0,
      expectedProfit: 0,
      marketGrowth: 0,
    },
    details: {
      area: 0,
      rooms: 0,
      floor: 0,
      totalFloors: 0,
      buildYear: new Date().getFullYear(),
      condition: '',
      parking: false,
      furnishing: '',
    },
  });

  const handleAddProperty = () => {
    setFormData(getEmptyProperty());
    setIsAddModalOpen(true);
  };

  const handleEditProperty = (property: PropertyObject) => {
    setFormData(property);
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот объект?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleShareToTelegram = (property: PropertyObject) => {
    setSelectedProperty(property);
    setIsTelegramModalOpen(true);
  };

  const handleSaveProperty = () => {
    if (selectedProperty) {
      // Edit existing property
      setProperties(properties.map(p => 
        p.id === selectedProperty.id 
          ? { ...formData as PropertyObject, id: selectedProperty.id }
          : p
      ));
      setIsEditModalOpen(false);
    } else {
      // Add new property
      const newProperty: PropertyObject = {
        ...formData as PropertyObject,
        id: `prop-${Date.now()}`,
        brokerId: 'broker-001',
        brokerName: 'Иван Петров',
        media: { images: [] },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0,
          favorites: 0,
        },
        sharing: {
          telegramPublished: false,
          vkPublished: false,
        },
      };
      setProperties([...properties, newProperty]);
      setIsAddModalOpen(false);
    }
    setFormData({});
    setSelectedProperty(null);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      
      const result = { ...prev };
      let current: any = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        } else {
          current[keys[i]] = { ...current[keys[i]] };
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return result;
    });
  };

  const toggleStrategy = (strategy: InvestmentStrategy) => {
    const currentStrategies = formData.investment?.strategy || [];
    const newStrategies = currentStrategies.includes(strategy)
      ? currentStrategies.filter(s => s !== strategy)
      : [...currentStrategies, strategy];
    updateFormData('investment.strategy', newStrategies);
  };

  const getStatusBadge = (status: PropertyStatus) => {
    const statusConfig = {
      draft: { label: 'Черновик', variant: 'secondary' as const },
      moderation: { label: 'На модерации', variant: 'default' as const },
      active: { label: 'Активен', variant: 'default' as const },
      reserved: { label: 'Зарезервирован', variant: 'secondary' as const },
      sold: { label: 'Продан', variant: 'secondary' as const },
      archived: { label: 'В архиве', variant: 'outline' as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateStats = () => {
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const totalInvestmentRaised = properties.reduce((sum, p) => sum + p.investment.currentInvestment, 0);
    const avgReturn = properties.length > 0
      ? properties.reduce((sum, p) => sum + p.investment.expectedReturn, 0) / properties.length
      : 0;

    return { totalProperties, activeProperties, totalInvestmentRaised, avgReturn };
  };

  const stats = calculateStats();

  const hasRentalStrategy = formData.investment?.strategy?.includes('rental') || formData.investment?.strategy?.includes('rental_and_resale');
  const hasResaleStrategy = formData.investment?.strategy?.includes('resale') || formData.investment?.strategy?.includes('rental_and_resale');

  const renderPropertyForm = () => (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название объекта</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Например: Квартира в центре Москвы"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Подробное описание объекта..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Тип объекта</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => updateFormData('propertyType', value as PropertyType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                    <SelectItem value="commercial">Коммерческая</SelectItem>
                    <SelectItem value="land">Земля</SelectItem>
                    <SelectItem value="hotel">Отель</SelectItem>
                    <SelectItem value="garage">Гараж</SelectItem>
                    <SelectItem value="parking">Парковка</SelectItem>
                    <SelectItem value="storage">Склад</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateFormData('status', value as PropertyStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="moderation">На модерации</SelectItem>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="reserved">Зарезервирован</SelectItem>
                    <SelectItem value="sold">Продан</SelectItem>
                    <SelectItem value="archived">В архиве</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Расположение</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  value={formData.location?.city || ''}
                  onChange={(e) => updateFormData('location.city', e.target.value)}
                  placeholder="Москва"
                />
              </div>
              <div>
                <Label htmlFor="district">Район</Label>
                <Input
                  id="district"
                  value={formData.location?.district || ''}
                  onChange={(e) => updateFormData('location.district', e.target.value)}
                  placeholder="Пресненский"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={formData.location?.address || ''}
                onChange={(e) => updateFormData('location.address', e.target.value)}
                placeholder="ул. Красная Пресня, д. 15"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metro">Метро</Label>
                <Input
                  id="metro"
                  value={formData.location?.metro || ''}
                  onChange={(e) => updateFormData('location.metro', e.target.value)}
                  placeholder="Баррикадная"
                />
              </div>
              <div>
                <Label htmlFor="metroDistance">Расстояние до метро (мин)</Label>
                <Input
                  id="metroDistance"
                  type="number"
                  value={formData.location?.metroDistance || ''}
                  onChange={(e) => updateFormData('location.metroDistance', Number(e.target.value))}
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Стоимость</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalPrice">Общая стоимость (₽)</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  value={formData.pricing?.totalPrice || ''}
                  onChange={(e) => updateFormData('pricing.totalPrice', Number(e.target.value))}
                  placeholder="25000000"
                />
              </div>
              <div>
                <Label htmlFor="pricePerMeter">Цена за м² (₽)</Label>
                <Input
                  id="pricePerMeter"
                  type="number"
                  value={formData.pricing?.pricePerMeter || ''}
                  onChange={(e) => updateFormData('pricing.pricePerMeter', Number(e.target.value))}
                  placeholder="350000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minInvestment">Минимальная инвестиция (₽)</Label>
              <Input
                id="minInvestment"
                type="number"
                value={formData.pricing?.minInvestment || ''}
                onChange={(e) => updateFormData('pricing.minInvestment', Number(e.target.value))}
                placeholder="5000000"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Financing */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Финансирование</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="financingMethod">Способ финансирования</Label>
              <Select
                value={formData.financing?.method}
                onValueChange={(value) => updateFormData('financing.method', value as FinancingMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите способ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Наличные</SelectItem>
                  <SelectItem value="mortgage">Ипотека</SelectItem>
                  <SelectItem value="installment">Рассрочка</SelectItem>
                  <SelectItem value="developer_installment">Рассрочка от застройщика</SelectItem>
                  <SelectItem value="mixed">Смешанное</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.financing?.method === 'mortgage' || formData.financing?.method === 'mixed') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mortgageRate">Ставка по ипотеке (%)</Label>
                  <Input
                    id="mortgageRate"
                    type="number"
                    step="0.1"
                    value={formData.financing?.mortgageRate || ''}
                    onChange={(e) => updateFormData('financing.mortgageRate', Number(e.target.value))}
                    placeholder="8.5"
                  />
                </div>
                <div>
                  <Label htmlFor="downPayment">Первоначальный взнос (%)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={formData.financing?.downPayment || ''}
                    onChange={(e) => updateFormData('financing.downPayment', Number(e.target.value))}
                    placeholder="20"
                  />
                </div>
              </div>
            )}

            {(formData.financing?.method === 'installment' || formData.financing?.method === 'mixed') && (
              <div>
                <Label htmlFor="installmentMonths">Срок рассрочки (мес)</Label>
                <Input
                  id="installmentMonths"
                  type="number"
                  value={formData.financing?.installmentMonths || ''}
                  onChange={(e) => updateFormData('financing.installmentMonths', Number(e.target.value))}
                  placeholder="12"
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Investment */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Инвестиционная информация</h3>
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Стратегия (можно выбрать несколько)</Label>
              <div className="space-y-2">
                {[
                  { value: 'resale', label: 'Перепродажа' },
                  { value: 'rental', label: 'Аренда' },
                  { value: 'rental_and_resale', label: 'Аренда + перепродажа' },
                  { value: 'development', label: 'Развитие' },
                ].map((strategy) => (
                  <div key={strategy.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={strategy.value}
                      checked={formData.investment?.strategy?.includes(strategy.value as InvestmentStrategy)}
                      onCheckedChange={() => toggleStrategy(strategy.value as InvestmentStrategy)}
                    />
                    <Label htmlFor={strategy.value} className="cursor-pointer">{strategy.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedReturn">Ожидаемая доходность (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  value={formData.investment?.expectedReturn || ''}
                  onChange={(e) => updateFormData('investment.expectedReturn', Number(e.target.value))}
                  placeholder="18"
                />
              </div>
              <div>
                <Label htmlFor="term">Срок инвестиции (мес)</Label>
                <Input
                  id="term"
                  type="number"
                  value={formData.investment?.term || ''}
                  onChange={(e) => updateFormData('investment.term', Number(e.target.value))}
                  placeholder="36"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="riskLevel">Уровень риска</Label>
              <Select
                value={formData.investment?.riskLevel}
                onValueChange={(value) => updateFormData('investment.riskLevel', value as RiskLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentInvestment">Текущий объем инвестиций (₽)</Label>
                <Input
                  id="currentInvestment"
                  type="number"
                  value={formData.investment?.currentInvestment || ''}
                  onChange={(e) => updateFormData('investment.currentInvestment', Number(e.target.value))}
                  placeholder="15000000"
                />
              </div>
              <div>
                <Label htmlFor="targetInvestment">Целевой объем (₽)</Label>
                <Input
                  id="targetInvestment"
                  type="number"
                  value={formData.investment?.targetInvestment || ''}
                  onChange={(e) => updateFormData('investment.targetInvestment', Number(e.target.value))}
                  placeholder="25000000"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rental Info */}
        {hasRentalStrategy && (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-4">Информация об аренде</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Ежемесячный доход (₽)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={formData.rental?.monthlyIncome || ''}
                      onChange={(e) => updateFormData('rental.monthlyIncome', Number(e.target.value))}
                      placeholder="120000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupancyRate">Заполняемость (%)</Label>
                    <Input
                      id="occupancyRate"
                      type="number"
                      value={formData.rental?.occupancyRate || ''}
                      onChange={(e) => updateFormData('rental.occupancyRate', Number(e.target.value))}
                      placeholder="95"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rentalYield">Доходность от аренды (%)</Label>
                  <Input
                    id="rentalYield"
                    type="number"
                    step="0.01"
                    value={formData.rental?.rentalYield || ''}
                    onChange={(e) => updateFormData('rental.rentalYield', Number(e.target.value))}
                    placeholder="5.76"
                  />
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Resale Info */}
        {hasResaleStrategy && (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-4">Информация о перепродаже</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedPrice">Ожидаемая цена (₽)</Label>
                    <Input
                      id="expectedPrice"
                      type="number"
                      value={formData.resale?.expectedPrice || ''}
                      onChange={(e) => updateFormData('resale.expectedPrice', Number(e.target.value))}
                      placeholder="30000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedProfit">Ожидаемая прибыль (₽)</Label>
                    <Input
                      id="expectedProfit"
                      type="number"
                      value={formData.resale?.expectedProfit || ''}
                      onChange={(e) => updateFormData('resale.expectedProfit', Number(e.target.value))}
                      placeholder="5000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marketGrowth">Рост рынка (%)</Label>
                  <Input
                    id="marketGrowth"
                    type="number"
                    step="0.1"
                    value={formData.resale?.marketGrowth || ''}
                    onChange={(e) => updateFormData('resale.marketGrowth', Number(e.target.value))}
                    placeholder="6.5"
                  />
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Детали объекта</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Площадь (м²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.details?.area || ''}
                  onChange={(e) => updateFormData('details.area', Number(e.target.value))}
                  placeholder="72"
                />
              </div>
              <div>
                <Label htmlFor="rooms">Количество комнат</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.details?.rooms || ''}
                  onChange={(e) => updateFormData('details.rooms', Number(e.target.value))}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floor">Этаж</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.details?.floor || ''}
                  onChange={(e) => updateFormData('details.floor', Number(e.target.value))}
                  placeholder="12"
                />
              </div>
              <div>
                <Label htmlFor="totalFloors">Всего этажей</Label>
                <Input
                  id="totalFloors"
                  type="number"
                  value={formData.details?.totalFloors || ''}
                  onChange={(e) => updateFormData('details.totalFloors', Number(e.target.value))}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buildYear">Год постройки</Label>
                <Input
                  id="buildYear"
                  type="number"
                  value={formData.details?.buildYear || ''}
                  onChange={(e) => updateFormData('details.buildYear', Number(e.target.value))}
                  placeholder="2023"
                />
              </div>
              <div>
                <Label htmlFor="condition">Состояние</Label>
                <Input
                  id="condition"
                  value={formData.details?.condition || ''}
                  onChange={(e) => updateFormData('details.condition', e.target.value)}
                  placeholder="Отличное"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={formData.details?.parking || false}
                  onCheckedChange={(checked) => updateFormData('details.parking', checked)}
                />
                <Label htmlFor="parking" className="cursor-pointer">Парковка</Label>
              </div>
              <div>
                <Label htmlFor="furnishing">Меблировка</Label>
                <Input
                  id="furnishing"
                  value={formData.details?.furnishing || ''}
                  onChange={(e) => updateFormData('details.furnishing', e.target.value)}
                  placeholder="С мебелью"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление объектами</h1>
          <p className="text-muted-foreground">Создавайте и управляйте инвестиционными объектами</p>
        </div>
        <Button onClick={handleAddProperty} className="gap-2">
          <Icon name="Plus" size={18} />
          Добавить объект
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего объектов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Активные объекты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Привлечено инвестиций</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(stats.totalInvestmentRaised / 1000000).toFixed(1)}M ₽
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Средняя доходность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.avgReturn.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>{property.title}</CardTitle>
                    {getStatusBadge(property.status)}
                  </div>
                  <CardDescription>{property.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareToTelegram(property)}
                    className="gap-2"
                  >
                    <Icon name="Send" size={16} />
                    Telegram
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProperty(property)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={16} />
                    <span>Расположение</span>
                  </div>
                  <p className="font-semibold">{property.location.city}</p>
                  <p className="text-sm text-muted-foreground">{property.location.district}</p>
                  {property.location.metro && (
                    <p className="text-sm text-muted-foreground">
                      м. {property.location.metro} ({property.location.metroDistance} мин)
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="DollarSign" size={16} />
                    <span>Стоимость</span>
                  </div>
                  <p className="font-semibold">
                    {(property.pricing.totalPrice / 1000000).toFixed(1)}M ₽
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {property.pricing.pricePerMeter?.toLocaleString()} ₽/м²
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Мин. {(property.pricing.minInvestment / 1000000).toFixed(1)}M ₽
                  </p>
                </div>

                {/* Investment */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="TrendingUp" size={16} />
                    <span>Инвестиции</span>
                  </div>
                  <p className="font-semibold">{property.investment.expectedReturn}% доходность</p>
                  <p className="text-sm text-muted-foreground">
                    Срок: {property.investment.term} мес
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Инвесторов: {property.investment.investors}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Home" size={16} />
                    <span>Характеристики</span>
                  </div>
                  <p className="font-semibold">{property.details.area} м²</p>
                  <p className="text-sm text-muted-foreground">
                    {property.details.rooms} комн, {property.details.floor}/{property.details.totalFloors} этаж
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {property.details.buildYear}г, {property.details.condition}
                  </p>
                </div>
              </div>

              {/* Investment Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Прогресс сбора</span>
                  <span className="font-semibold">
                    {((property.investment.currentInvestment / property.investment.targetInvestment) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (property.investment.currentInvestment / property.investment.targetInvestment) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Strategy Badges */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Стратегии:</span>
                {property.investment.strategy.map((strategy) => (
                  <Badge key={strategy} variant="outline">
                    {strategy === 'resale' && 'Перепродажа'}
                    {strategy === 'rental' && 'Аренда'}
                    {strategy === 'rental_and_resale' && 'Аренда + перепродажа'}
                    {strategy === 'development' && 'Развитие'}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {properties.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Icon name="Home" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Объекты не найдены</h3>
                <p className="text-muted-foreground mb-4">
                  Начните добавлять инвестиционные объекты для управления
                </p>
                <Button onClick={handleAddProperty} className="gap-2">
                  <Icon name="Plus" size={18} />
                  Добавить первый объект
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Property Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Добавить новый объект</DialogTitle>
            <DialogDescription>
              Заполните информацию об инвестиционном объекте
            </DialogDescription>
          </DialogHeader>
          
          {renderPropertyForm()}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveProperty}>
              Создать объект
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Property Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Редактировать объект</DialogTitle>
            <DialogDescription>
              Внесите изменения в информацию об объекте
            </DialogDescription>
          </DialogHeader>
          
          {renderPropertyForm()}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveProperty}>
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Telegram Publisher Modal */}
      <Dialog open={isTelegramModalOpen} onOpenChange={setIsTelegramModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedProperty && (
            <TelegramPublisher
              property={selectedProperty}
              brokerId="broker-001"
              onClose={() => setIsTelegramModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyManager;