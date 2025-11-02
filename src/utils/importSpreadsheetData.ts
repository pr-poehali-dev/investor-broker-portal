import type { PropertyObject } from '@/types/investment';

export const importSpreadsheetProperties = (): PropertyObject[] => {
  const danilinData = [
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Сахарный завод Рязанская область', price: '10 млрд.р', type: 'commercial', city: 'Рязанская область', partner: 'Ольга', commission: '3%', expectedReturn: 16 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Сахарный завод Краснодар', price: '1,6 млрд.р', type: 'commercial', city: 'Краснодар', partner: 'Ольга', commission: '3%', expectedReturn: 18 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Завод твердных сыров Смоленск', price: '400 млн.р', type: 'commercial', city: 'Смоленск', partner: '', commission: '59 млн.р', expectedReturn: 17 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Завод молочно-сырный Краснодар', price: '160 млн.р', type: 'commercial', city: 'Краснодар', partner: '', commission: '3%', expectedReturn: 19 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Завод сыров Краснодар (Адыгея)', price: '410 млн.р', type: 'commercial', city: 'Адыгея', partner: '', commission: '50 млн.р', expectedReturn: 16 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Завод минеральных вод', price: '750 млн.р', type: 'commercial', city: 'Россия', partner: 'Эдуард', commission: '3%', expectedReturn: 15 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Земельный участок с/х назначения 5000 га', price: '1.5 млрд.р', type: 'land', city: 'Россия', partner: 'Ольга', commission: '3%', expectedReturn: 18 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Земельный участок с/х назначения 17680 га', price: '1.4 млрд.р', type: 'land', city: 'Россия', partner: 'Ольга', commission: '3%', expectedReturn: 17 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Земельный участок с/х назначения 30000 га', price: '10,5 млрд.р', type: 'land', city: 'Россия', partner: 'Ольга', commission: '1,5 %', expectedReturn: 16 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Земельный участок с/х назначения 9000 га Тульская обл.', price: '900 млн.р', type: 'land', city: 'Тульская область', partner: 'Ольга', commission: '3%', expectedReturn: 19 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Мукомольный завод Ставропольский край', price: '250 млн.р', type: 'commercial', city: 'Ставропольский край', partner: 'Ольга', commission: '3%', expectedReturn: 17 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Горнолыжный комплекс г.Рязань', price: '500 млн.р', type: 'commercial', city: 'Рязань', partner: 'Денис', commission: '', expectedReturn: 20 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Здание в центре г.Рязани Детский мир', price: '250 млн.р', type: 'commercial', city: 'Рязань', partner: 'Владимир', commission: '6 млн.р', expectedReturn: 15 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'НПЗ Буденовск', price: '1,5 млрд.', type: 'commercial', city: 'Буденовск', partner: 'Ольга', commission: '3%', expectedReturn: 14 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'ГАБ Магнит МО д.Борзые', price: '200 млн.р', type: 'commercial', city: 'Московская область', partner: 'Сергей', commission: '', expectedReturn: 16 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Земля рекреации п.Хотьково МО', price: '20 млн.р', type: 'land', city: 'Московская область', partner: 'Владимир', commission: '5 млн.р', expectedReturn: 22 },
    { broker: 'Данилин Дмитрий', brokerId: 'broker-danilin', name: 'Здание ТЦ Москва Волгоградский пр-т 177', price: '1,1 млрд.р', type: 'commercial', city: 'Москва', partner: 'Сергей', commission: '3%', expectedReturn: 15 },
  ];

  const morozkinData = [
    { broker: 'Морозкин Юрий', brokerId: 'broker-morozkin', name: 'ДА Га', price: '240000', type: 'land', city: 'Россия', partner: 'Кирай', commission: '25000', expectedReturn: 100 },
    { broker: 'Морозкин Юрий', brokerId: 'broker-morozkin', name: 'Земли Петушки', price: '400000', type: 'land', city: 'Петушки', partner: 'Клыкова', commission: '50000', expectedReturn: 60 },
    { broker: 'Морозкин Юрий', brokerId: 'broker-morozkin', name: 'Земля Горный Чарыш / Г.Алтай', price: '400000', type: 'land', city: 'Горный Алтай', partner: 'Морозов', commission: '50000', expectedReturn: 45 },
    { broker: 'Морозкин Юрий', brokerId: 'broker-morozkin', name: 'Паркинг Санкт-Петербург', price: '600000', type: 'parking', city: 'Санкт-Петербург', partner: 'Андреева', commission: '60000', expectedReturn: 85 },
    { broker: 'Морозкин Юрий', brokerId: 'broker-morozkin', name: 'Апартаменты комфорт класс Уфа', price: '4500000', type: 'apartment', city: 'Уфа', partner: 'Морозкин', commission: '120000', expectedReturn: 83 },
    { broker: 'Морозкин Юрий', brokerId: 'broker-morozkin', name: 'Апартаменты бизнес класс Уфа', price: '5200000', type: 'apartment', city: 'Уфа', partner: 'Морозкин', commission: '140000', expectedReturn: 70 },
  ];

  const loginovData = [
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Земля НН', price: '400000', type: 'land', city: 'Нижний Новгород', partner: 'Антипина И', commission: '100000', expectedReturn: 50 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Шерегеш', price: '1200000', type: 'commercial', city: 'Шерегеш', partner: 'Пивоварова', commission: '100000', expectedReturn: 35 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Да Га', price: '240000', type: 'land', city: 'Россия', partner: 'Кирай', commission: '25000', expectedReturn: 45 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Земская среда КП Светлица (Московская обл.)', price: '1500000', type: 'land', city: 'Московская область', partner: 'Светлана С.', commission: '150000', expectedReturn: 40 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Новостройки Москвы', price: '400000', type: 'apartment', city: 'Москва', partner: 'Светлана С.', commission: '50000', expectedReturn: 30 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Дубай', price: '14 млн.р', type: 'apartment', city: 'Дубай', partner: 'Ткаченко Юлия', commission: '560000', expectedReturn: 25 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'о. Бали', price: '14 млн.р', type: 'commercial', city: 'Бали', partner: 'Ткаченко Юлия', commission: '560000', expectedReturn: 28 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Дом на продажу', price: '1500000', type: 'house', city: 'Россия', partner: 'Замятина, Клыкова', commission: '180000', expectedReturn: 20 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Земли Петушки', price: '400000', type: 'land', city: 'Петушки', partner: 'Клыкова', commission: '50000', expectedReturn: 35 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Квартиры МСК Б, без ПВ сем', price: '300000', type: 'apartment', city: 'Москва', partner: '', commission: '50000', expectedReturn: 40 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Квартиры МСК, без ПВ сем', price: '100000', type: 'apartment', city: 'Москва', partner: '', commission: '50000', expectedReturn: 45 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Камбоджа (море)', price: '800000', type: 'apartment', city: 'Камбоджа', partner: 'Алена Ганза', commission: '200000', expectedReturn: 50 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Камбоджа (столица/центр)', price: '1400000', type: 'apartment', city: 'Камбоджа', partner: 'Алена Ганза', commission: '350000', expectedReturn: 48 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Камбоджа (коммерция)', price: '4 млн.р', type: 'commercial', city: 'Камбоджа', partner: 'Алена Ганза', commission: '800000', expectedReturn: 55 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'ГАБ в Москве', price: '3 млн.р', type: 'commercial', city: 'Москва', partner: 'Антон Л.', commission: '75000', expectedReturn: 22 },
    { broker: 'Логинов Вадим', brokerId: 'broker-loginov', name: 'Парковки, Казань', price: '585000', type: 'parking', city: 'Казань', partner: 'Вадим Логинов', commission: '50000', expectedReturn: 30 },
  ];

  const spreadsheetData = [...danilinData, ...morozkinData, ...loginovData];

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/\s/g, '').replace(',', '.');
    
    if (cleaned.includes('млрд')) {
      const value = parseFloat(cleaned.replace('млрд.р', '').replace('млрд', ''));
      return value * 1000000000;
    }
    
    if (cleaned.includes('млн')) {
      const value = parseFloat(cleaned.replace('млн.р', '').replace('млн', ''));
      return value * 1000000;
    }
    
    return parseFloat(cleaned) || 0;
  };

  const getMinInvestment = (totalPrice: number): number => {
    if (totalPrice >= 1000000000) return 100000000;
    if (totalPrice >= 500000000) return 50000000;
    if (totalPrice >= 100000000) return 10000000;
    if (totalPrice >= 50000000) return 5000000;
    if (totalPrice >= 5000000) return 500000;
    if (totalPrice >= 1000000) return 100000;
    return 50000;
  };

  return spreadsheetData.map((item, index) => {
    const totalPrice = parsePrice(item.price);
    const minInvestment = getMinInvestment(totalPrice);
    const expectedReturn = item.expectedReturn || 15;
    const term = item.type === 'land' ? 36 : item.type === 'parking' ? 24 : 24;

    return {
      id: `spreadsheet-prop-${index + 1}`,
      brokerId: item.brokerId,
      brokerName: item.broker,
      title: item.name,
      description: `${item.name}. Партнер: ${item.partner || 'не указан'}. Комиссия: ${item.commission || 'не указана'}.`,
      propertyType: item.type as 'commercial' | 'land' | 'parking' | 'apartment',
      status: 'active' as const,
      location: {
        city: item.city,
        district: '',
        address: item.city,
        metro: undefined,
        metroDistance: undefined,
      },
      pricing: {
        totalPrice,
        pricePerMeter: undefined,
        minInvestment,
        currency: 'RUB',
      },
      financing: {
        method: 'cash' as const,
        mortgageRate: undefined,
        installmentMonths: undefined,
        downPayment: undefined,
      },
      investment: {
        strategy: ['rental_and_resale' as const],
        expectedReturn,
        term,
        riskLevel: totalPrice > 500000000 ? 'high' : 'medium' as const,
        currentInvestment: 0,
        targetInvestment: totalPrice,
        investors: 0,
      },
      rental: undefined,
      resale: undefined,
      details: {
        area: undefined,
        rooms: undefined,
        floor: undefined,
        totalFloors: undefined,
        buildYear: undefined,
        condition: undefined,
        parking: false,
        furnishing: undefined,
      },
      media: {
        images: [],
        videos: [],
        virtualTour: undefined,
        floorPlan: undefined,
      },
      documents: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        favorites: 0,
        source: 'spreadsheet_import',
        externalId: `spreadsheet-${index + 1}`,
      },
      sharing: {
        telegramPublished: false,
        telegramUrl: undefined,
        vkPublished: false,
        vkUrl: undefined,
      },
    };
  });
};

export const loadSpreadsheetData = () => {
  try {
    const existingProperties = localStorage.getItem('investpro-properties');
    const properties = existingProperties ? JSON.parse(existingProperties) : [];
    
    const spreadsheetIds = new Set(
      properties
        .filter((p: PropertyObject) => p.metadata.source === 'spreadsheet_import')
        .map((p: PropertyObject) => p.id)
    );
    
    const newProperties = importSpreadsheetProperties();
    const propertiesToAdd = newProperties.filter(p => !spreadsheetIds.has(p.id));
    
    if (propertiesToAdd.length > 0) {
      const updated = [...properties, ...propertiesToAdd];
      localStorage.setItem('investpro-properties', JSON.stringify(updated));
      console.log(`Imported ${propertiesToAdd.length} properties from spreadsheet`);
      return propertiesToAdd.length;
    }
    
    return 0;
  } catch (error) {
    console.error('Error loading spreadsheet data:', error);
    return 0;
  }
};