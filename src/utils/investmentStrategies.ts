import type { PropertyObject, Investor, PropertyRecommendation, InvestmentStrategy } from '@/types/investment';

export const getStrategyLabel = (strategy: InvestmentStrategy): string => {
  const labels: Record<InvestmentStrategy, string> = {
    resale: 'Перепродажа',
    rental: 'Аренда',
    rental_and_resale: 'Аренда + Перепродажа',
    development: 'Развитие'
  };
  return labels[strategy];
};

export const calculateMonthlyIncome = (property: PropertyObject): number => {
  if (property.rental) {
    return property.rental.monthlyIncome;
  }
  if (property.resale && property.investment.term > 0) {
    return property.resale.expectedProfit / property.investment.term;
  }
  return 0;
};

export const calculateROI = (property: PropertyObject): number => {
  const { totalPrice } = property.pricing;
  const { strategy } = property.investment;
  
  let totalReturn = 0;
  
  if (strategy.includes('rental') && property.rental) {
    const rentalIncome = property.rental.monthlyIncome * property.investment.term;
    totalReturn += rentalIncome;
  }
  
  if (strategy.includes('resale') && property.resale) {
    totalReturn += property.resale.expectedProfit;
  }
  
  return (totalReturn / totalPrice) * 100;
};

export const matchInvestorToProperty = (
  investor: Investor,
  property: PropertyObject
): PropertyRecommendation | null => {
  const { investmentProfile } = investor;
  let matchScore = 0;
  const reasons: string[] = [];
  
  if (property.pricing.minInvestment > investmentProfile.budget) {
    return null;
  }
  
  const strategyMatch = property.investment.strategy.some(s => 
    investmentProfile.strategies.includes(s)
  );
  if (strategyMatch) {
    matchScore += 30;
    reasons.push('Подходящая стратегия инвестирования');
  }
  
  if (investmentProfile.preferredPropertyTypes.includes(property.propertyType)) {
    matchScore += 25;
    reasons.push('Предпочитаемый тип недвижимости');
  }
  
  if (investmentProfile.preferredLocations.some(loc => 
    property.location.city.includes(loc) || property.location.district.includes(loc)
  )) {
    matchScore += 20;
    reasons.push('Желаемая локация');
  }
  
  if (property.investment.riskLevel === investmentProfile.riskTolerance) {
    matchScore += 15;
    reasons.push('Соответствует уровню риска');
  } else if (
    (property.investment.riskLevel === 'low' && investmentProfile.riskTolerance === 'medium') ||
    (property.investment.riskLevel === 'medium' && investmentProfile.riskTolerance === 'high')
  ) {
    matchScore += 10;
  }
  
  const budgetEfficiency = (investmentProfile.budget / property.pricing.minInvestment);
  if (budgetEfficiency >= 1 && budgetEfficiency <= 2) {
    matchScore += 10;
    reasons.push('Оптимальное использование бюджета');
  }
  
  if (matchScore < 40) {
    return null;
  }
  
  const projectedReturn = calculateROI(property);
  const primaryStrategy = property.investment.strategy[0];
  
  return {
    investorId: investor.id,
    propertyId: property.id,
    matchScore,
    reasons,
    strategy: primaryStrategy,
    projectedReturn
  };
};

export const getFinancingDetails = (property: PropertyObject): string => {
  const { financing } = property;
  
  switch (financing.method) {
    case 'cash':
      return 'Наличный расчёт';
    case 'mortgage':
      return `Ипотека ${financing.mortgageRate}% годовых`;
    case 'installment':
      return `Рассрочка ${financing.installmentMonths} мес.`;
    case 'developer_installment':
      return `Рассрочка от застройщика ${financing.developerInstallment?.months} мес., ${financing.developerInstallment?.rate}%`;
    case 'mixed':
      return 'Комбинированное финансирование';
    default:
      return 'Не указано';
  }
};

export const generateReferralCode = (brokerId: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${brokerId.substring(0, 4)}-${timestamp}-${random}`.toUpperCase();
};

export const buildUtmUrl = (
  baseUrl: string,
  source: string,
  medium: string,
  campaign: string,
  referralCode?: string
): string => {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });
  
  if (referralCode) {
    params.append('ref', referralCode);
  }
  
  return `${baseUrl}?${params.toString()}`;
};

export const formatPropertyForTelegram = (property: PropertyObject): string => {
  const strategy = property.investment.strategy.map(getStrategyLabel).join(', ');
  const financing = getFinancingDetails(property);
  
  let message = `🏢 ${property.title}\n\n`;
  message += `📍 ${property.location.city}, ${property.location.district}\n`;
  if (property.location.metro) {
    message += `🚇 ${property.location.metro} (${property.location.metroDistance} мин)\n`;
  }
  message += `\n`;
  
  message += `💰 Цена: ${property.pricing.totalPrice.toLocaleString('ru-RU')} ₽\n`;
  message += `📊 Минимальная инвестиция: ${property.pricing.minInvestment.toLocaleString('ru-RU')} ₽\n`;
  message += `💳 Способ оплаты: ${financing}\n`;
  message += `\n`;
  
  message += `📈 Стратегия: ${strategy}\n`;
  message += `🎯 Ожидаемая доходность: ${property.investment.expectedReturn}%\n`;
  message += `⏱ Срок: ${property.investment.term} мес.\n`;
  message += `⚠️ Риск: ${property.investment.riskLevel === 'low' ? 'Низкий' : property.investment.riskLevel === 'medium' ? 'Средний' : 'Высокий'}\n`;
  
  if (property.rental) {
    message += `\n💵 Доход от аренды: ${property.rental.monthlyIncome.toLocaleString('ru-RU')} ₽/мес\n`;
    message += `📊 Доходность: ${property.rental.rentalYield}%\n`;
  }
  
  if (property.resale) {
    message += `\n💎 Ожидаемая цена продажи: ${property.resale.expectedPrice.toLocaleString('ru-RU')} ₽\n`;
    message += `💰 Прогноз прибыли: ${property.resale.expectedProfit.toLocaleString('ru-RU')} ₽\n`;
  }
  
  if (property.details.area) {
    message += `\n📐 Площадь: ${property.details.area} м²\n`;
  }
  if (property.details.rooms) {
    message += `🛏 Комнат: ${property.details.rooms}\n`;
  }
  
  message += `\n✍️ ${property.description}`;
  
  return message;
};
