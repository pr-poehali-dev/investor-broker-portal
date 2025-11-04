import { InvestmentObject } from '@/types/investment-object';

export const initMockObjects = () => {
  const existingObjects = localStorage.getItem('investment-objects');
  
  if (existingObjects) {
    return;
  }

  const mockObjects: InvestmentObject[] = [
    {
      id: 1,
      title: 'Апартаменты в ЖК «Престиж»',
      type: 'apartments',
      city: 'Москва',
      address: 'ЦАО, ул. Тверская, 15',
      price: 3200000,
      yield: 12,
      paybackPeriod: 7,
      area: 45,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260066-6bc35f0a3e74?w=800&h=600&fit=crop'
      ],
      description: 'Премиальные апартаменты с готовым ремонтом в центре Москвы. Развитая инфраструктура, близость к метро. Идеально для сдачи в аренду.',
      brokerId: 1,
      createdAt: new Date().toISOString(),
      monthlyIncome: 32000,
      rentalYield: 12,
      documents: [
        { title: 'Презентация объекта', url: '#' },
        { title: 'Финансовая модель', url: '#' }
      ],
      coordinates: { lat: 55.7558, lng: 37.6173 }
    },
    {
      id: 2,
      title: 'Студия в ЖК «Солнечный»',
      type: 'flats',
      city: 'Санкт-Петербург',
      address: 'Приморский р-н, пр. Королева, 32',
      price: 2500000,
      yield: 15,
      paybackPeriod: 6,
      area: 28,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      description: 'Компактная студия в новом районе Санкт-Петербурга. Отличная транспортная доступность, высокий спрос на аренду.',
      brokerId: 1,
      createdAt: new Date().toISOString(),
      monthlyIncome: 31250,
      rentalYield: 15
    },
    {
      id: 3,
      title: 'Офис в БЦ «Альфа Плаза»',
      type: 'commercial',
      city: 'Москва',
      address: 'ЗАО, Кутузовский пр-т, 36',
      price: 8500000,
      yield: 18,
      paybackPeriod: 5,
      area: 75,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
      ],
      description: 'Офисное помещение класса А в престижном бизнес-центре. Высокая доходность от аренды, надежный арендатор.',
      brokerId: 2,
      createdAt: new Date().toISOString(),
      monthlyIncome: 127500,
      rentalYield: 18
    },
    {
      id: 4,
      title: 'Апарт-отель «Прибрежный»',
      type: 'apartments',
      city: 'Сочи',
      address: 'Адлерский р-н, ул. Ленина, 219',
      price: 4800000,
      yield: 25,
      paybackPeriod: 4,
      area: 38,
      status: 'reserved',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
      ],
      description: 'Апартаменты в апарт-отеле у моря. Высокая доходность за счет туристического сезона. Управляющая компания берет на себя все заботы.',
      brokerId: 1,
      createdAt: new Date().toISOString(),
      monthlyIncome: 100000,
      rentalYield: 25
    },
    {
      id: 5,
      title: 'Двухкомнатная квартира в ЖК «Riverside»',
      type: 'flats',
      city: 'Казань',
      address: 'Приволжский р-н, ул. Чистопольская, 71',
      price: 3800000,
      yield: 14,
      paybackPeriod: 7,
      area: 58,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
      ],
      description: 'Просторная двухкомнатная квартира в современном ЖК. Развитая инфраструктура, школы, детские сады рядом.',
      brokerId: 3,
      createdAt: new Date().toISOString(),
      monthlyIncome: 44333,
      rentalYield: 14
    },
    {
      id: 6,
      title: 'Загородный коттедж «Лесная поляна»',
      type: 'country',
      city: 'Москва',
      address: 'Новорижское шоссе, 25 км',
      price: 12000000,
      yield: 10,
      paybackPeriod: 10,
      area: 180,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
      ],
      description: 'Уютный коттедж в закрытом поселке. Охрана 24/7, собственная инфраструктура, близость к Москве.',
      brokerId: 2,
      createdAt: new Date().toISOString(),
      monthlyIncome: 100000,
      rentalYield: 10
    },
    {
      id: 7,
      title: 'Торговое помещение в ТЦ',
      type: 'commercial',
      city: 'Екатеринбург',
      address: 'Ленинский р-н, ул. 8 Марта, 46',
      price: 5500000,
      yield: 20,
      paybackPeriod: 5,
      area: 42,
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555529902-5261145633bf?w=800&h=600&fit=crop'
      ],
      description: 'Торговое помещение в крупном ТЦ с высоким трафиком. Долгосрочный арендатор – федеральная сеть.',
      brokerId: 3,
      createdAt: new Date().toISOString(),
      monthlyIncome: 91666,
      rentalYield: 20
    },
    {
      id: 8,
      title: 'Апартаменты с видом на город',
      type: 'apartments',
      city: 'Санкт-Петербург',
      address: 'Центральный р-н, Невский пр., 88',
      price: 6200000,
      yield: 11,
      paybackPeriod: 9,
      area: 65,
      status: 'sold',
      images: [
        'https://images.unsplash.com/photo-1502672260066-6bc35f0a3e74?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      description: 'Элитные апартаменты в историческом центре с панорамными видами. Premium класс.',
      brokerId: 1,
      createdAt: new Date().toISOString(),
      monthlyIncome: 56833,
      rentalYield: 11
    }
  ];

  localStorage.setItem('investment-objects', JSON.stringify(mockObjects));
};
