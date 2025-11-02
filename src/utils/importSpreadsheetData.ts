import type { PropertyObject } from '@/types/investment';

export const importSpreadsheetProperties = (): PropertyObject[] => {
  const spreadsheetData = [
    { name: 'Сахарный завод Рязанская область', price: '10 млрд.р', type: 'commercial', city: 'Рязанская область', partner: 'Ольга', commission: '3%' },
    { name: 'Сахарный завод Краснодар', price: '1,6 млрд.р', type: 'commercial', city: 'Краснодар', partner: 'Ольга', commission: '3%' },
    { name: 'Завод твердных сыров Смоленск', price: '400 млн.р', type: 'commercial', city: 'Смоленск', partner: '', commission: '59 млн.р' },
    { name: 'Завод молочно-сырный Краснодар', price: '160 млн.р', type: 'commercial', city: 'Краснодар', partner: '', commission: '3%' },
    { name: 'Завод сыров Краснодар (Адыгея)', price: '410 млн.р', type: 'commercial', city: 'Адыгея', partner: '', commission: '50 млн.р' },
    { name: 'Завод минеральных вод', price: '750 млн.р', type: 'commercial', city: 'Россия', partner: 'Эдуард', commission: '3%' },
    { name: 'Земельный участок с/х назначения 5000 га', price: '1.5 млрд.р', type: 'land', city: 'Россия', partner: 'Ольга', commission: '3%' },
    { name: 'Земельный участок с/х назначения 17680 га', price: '1.4 млрд.р', type: 'land', city: 'Россия', partner: 'Ольга', commission: '3%' },
    { name: 'Земельный участок с/х назначения 30000 га', price: '10,5 млрд.р', type: 'land', city: 'Россия', partner: 'Ольга', commission: '1,5 %' },
    { name: 'Земельный участок с/х назначения 9000 га Тульская обл.', price: '900 млн.р', type: 'land', city: 'Тульская область', partner: 'Ольга', commission: '3%' },
    { name: 'Мукомольный завод Ставропольский край', price: '250 млн.р', type: 'commercial', city: 'Ставропольский край', partner: 'Ольга', commission: '3%' },
    { name: 'Горнолыжный комплекс г.Рязань', price: '500 млн.р', type: 'commercial', city: 'Рязань', partner: 'Денис', commission: '' },
    { name: 'Здание в центре г.Рязани Детский мир', price: '250 млн.р', type: 'commercial', city: 'Рязань', partner: 'Владимир', commission: '6 млн.р' },
    { name: 'НПЗ Буденовск', price: '1,5 млрд.', type: 'commercial', city: 'Буденовск', partner: 'Ольга', commission: '3%' },
    { name: 'ГАБ Магнит МО д.Борзые', price: '200 млн.р', type: 'commercial', city: 'Московская область', partner: 'Сергей', commission: '' },
    { name: 'Земля рекреации п.Хотьково МО', price: '20 млн.р', type: 'land', city: 'Московская область', partner: 'Владимир', commission: '5 млн.р' },
    { name: 'Здание ТЦ Москва Волгоградский пр-т 177', price: '1,1 млрд.р', type: 'commercial', city: 'Москва', partner: 'Сергей', commission: '3%' },
  ];

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
    return 1000000;
  };

  const getExpectedReturn = (type: string): number => {
    if (type === 'land') return Math.floor(Math.random() * 5) + 15;
    return Math.floor(Math.random() * 8) + 12;
  };

  return spreadsheetData.map((item, index) => {
    const totalPrice = parsePrice(item.price);
    const minInvestment = getMinInvestment(totalPrice);
    const expectedReturn = getExpectedReturn(item.type);
    const term = item.type === 'land' ? 36 : 24;

    return {
      id: `spreadsheet-prop-${index + 1}`,
      brokerId: 'broker-danilin',
      brokerName: 'Данилин Дмитрий',
      title: item.name,
      description: `${item.name}. Партнер: ${item.partner || 'не указан'}. Комиссия: ${item.commission || 'не указана'}.`,
      propertyType: item.type as 'commercial' | 'land',
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
