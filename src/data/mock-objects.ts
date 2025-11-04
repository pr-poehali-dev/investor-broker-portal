import { InvestmentObject } from '@/types/investment-object';

export const mockObjects: InvestmentObject[] = [
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
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260066-6bc386f7a4dc?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    description: 'Премиальные апартаменты с готовым ремонтом в самом центре Москвы. Развитая инфраструктура, высокий спрос на аренду. Идеальный вариант для стабильного пассивного дохода.',
    brokerId: 1,
    createdAt: '2024-11-01T10:00:00Z',
    monthlyIncome: 32000
  },
  {
    id: 2,
    title: 'Двухкомнатная квартира на Невском',
    type: 'flats',
    city: 'Санкт-Петербург',
    address: 'Центральный район, Невский пр., 88',
    price: 8500000,
    yield: 9,
    paybackPeriod: 11,
    area: 62,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    description: 'Просторная двухкомнатная квартира на главной улице Санкт-Петербурга. Отличный вариант для сдачи в долгосрочную или посуточную аренду туристам.',
    brokerId: 2,
    createdAt: '2024-10-28T14:30:00Z',
    monthlyIncome: 63750
  },
  {
    id: 3,
    title: 'Коммерческое помещение у метро',
    type: 'commercial',
    city: 'Москва',
    address: 'СВАО, ул. Сухонская, 3',
    price: 15000000,
    yield: 15,
    paybackPeriod: 6,
    area: 120,
    status: 'reserved',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
    ],
    description: 'Коммерческое помещение в проходном месте рядом с метро. Подходит под офис, магазин, кафе. Действующий арендатор на долгосрочной основе.',
    brokerId: 1,
    createdAt: '2024-10-25T09:15:00Z',
    monthlyIncome: 187500
  },
  {
    id: 4,
    title: 'Студия в курортной зоне',
    type: 'apartments',
    city: 'Сочи',
    address: 'Адлерский район, ул. Ленина, 280',
    price: 4200000,
    yield: 18,
    paybackPeriod: 5,
    area: 28,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1502672260066-6bc386f7a4dc?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    description: 'Студия в новом доме в 10 минутах от моря. Высокий сезонный доход от посуточной аренды. Управляющая компания берет на себя все вопросы по сдаче.',
    brokerId: 3,
    createdAt: '2024-10-20T16:45:00Z',
    monthlyIncome: 63000
  },
  {
    id: 5,
    title: 'Загородный дом с участком',
    type: 'country',
    city: 'Москва',
    address: 'Новорижское шоссе, 25км, КП "Зеленая роща"',
    price: 25000000,
    yield: 8,
    paybackPeriod: 12,
    area: 180,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    description: 'Современный дом в охраняемом поселке премиум-класса. Развитая инфраструктура, школа, детские сады. Идеален для долгосрочной аренды состоятельным семьям.',
    brokerId: 2,
    createdAt: '2024-10-15T11:20:00Z',
    monthlyIncome: 166666
  },
  {
    id: 6,
    title: 'Однокомнатная квартира в новостройке',
    type: 'flats',
    city: 'Казань',
    address: 'Советский район, ул. Чистопольская, 71',
    price: 3800000,
    yield: 11,
    paybackPeriod: 9,
    area: 38,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    description: 'Квартира в современном ЖК с отделкой от застройщика. Развивающийся район с хорошей транспортной доступностью. Стабильный спрос на аренду.',
    brokerId: 1,
    createdAt: '2024-10-10T13:00:00Z',
    monthlyIncome: 34833
  },
  {
    id: 7,
    title: 'Коммерческая недвижимость в БЦ',
    type: 'commercial',
    city: 'Екатеринбург',
    address: 'Центр, ул. Малышева, 51',
    price: 22000000,
    yield: 14,
    paybackPeriod: 7,
    area: 200,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
    ],
    description: 'Офисное помещение в престижном бизнес-центре класса А. Надежный арендатор - IT компания. Договор на 5 лет с ежегодной индексацией.',
    brokerId: 3,
    createdAt: '2024-10-05T10:30:00Z',
    monthlyIncome: 256666
  },
  {
    id: 8,
    title: 'Трехкомнатная квартира с видом на реку',
    type: 'flats',
    city: 'Санкт-Петербург',
    address: 'Петроградский район, наб. Мартынова, 4',
    price: 18000000,
    yield: 7,
    paybackPeriod: 14,
    area: 95,
    status: 'sold',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ],
    description: 'Элитная квартира с панорамным видом на Неву. Историческое здание после реконструкции. Сдается в долгосрочную аренду семье экспатов.',
    brokerId: 2,
    createdAt: '2024-09-28T15:00:00Z',
    monthlyIncome: 105000
  },
  {
    id: 9,
    title: 'Апартаменты в апарт-отеле',
    type: 'apartments',
    city: 'Сочи',
    address: 'Центральный район, Курортный пр., 75',
    price: 6500000,
    yield: 20,
    paybackPeriod: 5,
    area: 35,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1502672260066-6bc386f7a4dc?w=800',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'
    ],
    description: 'Апартаменты в управляемом апарт-отеле с собственным пляжем. Гарантированный доход от управляющей компании. Возможность личного использования до 30 дней в году.',
    brokerId: 1,
    createdAt: '2024-09-20T12:00:00Z',
    monthlyIncome: 108333
  },
  {
    id: 10,
    title: 'Пентхаус в элитном комплексе',
    type: 'apartments',
    city: 'Москва',
    address: 'ЗАО, Кутузовский пр., 36',
    price: 45000000,
    yield: 6,
    paybackPeriod: 16,
    area: 220,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ],
    description: 'Роскошный пентхаус с террасой и видом на Москву-Сити. Премиальная отделка, smart-home. Эксклюзивное предложение для VIP-арендаторов.',
    brokerId: 3,
    createdAt: '2024-09-15T09:00:00Z',
    monthlyIncome: 225000
  },
  {
    id: 11,
    title: 'Торговое помещение в ТЦ',
    type: 'commercial',
    city: 'Казань',
    address: 'Вахитовский район, ул. Петербургская, 1',
    price: 12000000,
    yield: 16,
    paybackPeriod: 6,
    area: 80,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800'
    ],
    description: 'Торговая площадь в популярном торговом центре с высокой проходимостью. Действующий арендатор - сетевой магазин одежды. Стабильный доход.',
    brokerId: 2,
    createdAt: '2024-09-10T14:20:00Z',
    monthlyIncome: 160000
  },
  {
    id: 12,
    title: 'Двухуровневая квартира в лофт-проекте',
    type: 'flats',
    city: 'Москва',
    address: 'ЦАО, Большая Татарская ул., 7',
    price: 16000000,
    yield: 10,
    paybackPeriod: 10,
    area: 110,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800'
    ],
    description: 'Уникальная двухуровневая квартира в историческом здании после реконструкции. Высокие потолки, панорамные окна, дизайнерский ремонт.',
    brokerId: 1,
    createdAt: '2024-09-05T11:45:00Z',
    monthlyIncome: 133333
  }
];

export const initializeMockObjects = () => {
  const existing = localStorage.getItem('investment-objects');
  if (!existing) {
    localStorage.setItem('investment-objects', JSON.stringify(mockObjects));
  }
};
