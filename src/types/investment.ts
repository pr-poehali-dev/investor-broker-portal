export type PropertyType = 
  | 'apartment'
  | 'house'
  | 'commercial'
  | 'land'
  | 'hotel'
  | 'garage'
  | 'parking'
  | 'storage';

export type FinancingMethod = 
  | 'cash'
  | 'mortgage'
  | 'installment'
  | 'developer_installment'
  | 'mixed';

export type InvestmentStrategy = 
  | 'resale'
  | 'rental'
  | 'rental_and_resale'
  | 'development';

export type RiskLevel = 'low' | 'medium' | 'high';

export type PropertyStatus = 
  | 'draft'
  | 'moderation'
  | 'active'
  | 'reserved'
  | 'sold'
  | 'archived';

export type InvestorStage = 
  | 'lead'
  | 'consultation'
  | 'analysis'
  | 'offer_sent'
  | 'negotiation'
  | 'deal_preparation'
  | 'active'
  | 'inactive';

export interface PropertyObject {
  id: string;
  brokerId: string;
  brokerName: string;
  
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  
  location: {
    city: string;
    district: string;
    address: string;
    metro?: string;
    metroDistance?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  pricing: {
    totalPrice: number;
    pricePerMeter?: number;
    minInvestment: number;
    currency: string;
  };
  
  financing: {
    method: FinancingMethod;
    mortgageRate?: number;
    installmentMonths?: number;
    downPayment?: number;
    developerInstallment?: {
      months: number;
      rate: number;
    };
  };
  
  investment: {
    strategy: InvestmentStrategy[];
    expectedReturn: number;
    term: number;
    riskLevel: RiskLevel;
    currentInvestment: number;
    targetInvestment: number;
    investors: number;
  };
  
  rental?: {
    monthlyIncome: number;
    occupancyRate: number;
    rentalYield: number;
  };
  
  resale?: {
    expectedPrice: number;
    expectedProfit: number;
    marketGrowth: number;
  };
  
  details: {
    area?: number;
    rooms?: number;
    floor?: number;
    totalFloors?: number;
    buildYear?: number;
    condition?: string;
    parking?: boolean;
    furnishing?: string;
  };
  
  media: {
    images: string[];
    videos?: string[];
    virtualTour?: string;
    floorPlan?: string;
  };
  
  documents?: {
    name: string;
    url: string;
    type: string;
  }[];
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    views: number;
    favorites: number;
    source?: string;
    externalId?: string;
  };
  
  sharing: {
    telegramPublished: boolean;
    telegramUrl?: string;
    vkPublished: boolean;
    vkUrl?: string;
  };
}

export interface Investor {
  id: string;
  brokerId: string;
  
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  
  stage: InvestorStage;
  
  investmentProfile: {
    budget: number;
    strategies: InvestmentStrategy[];
    riskTolerance: RiskLevel;
    preferredPropertyTypes: PropertyType[];
    preferredLocations: string[];
  };
  
  portfolio: {
    totalInvested: number;
    activeInvestments: number;
    totalReturn: number;
    properties: string[];
  };
  
  interaction: {
    source: string;
    utmParams?: {
      source: string;
      medium: string;
      campaign: string;
      content?: string;
    };
    referralCode?: string;
    lastContact?: Date;
    notes: string;
  };
  
  timeline: {
    date: Date;
    action: string;
    details: string;
  }[];
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface PropertyRecommendation {
  investorId: string;
  propertyId: string;
  matchScore: number;
  reasons: string[];
  strategy: InvestmentStrategy;
  projectedReturn: number;
}

export interface UserInvestment {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  date: Date;
  currentValue: number;
  profit: number;
  roi: number;
}