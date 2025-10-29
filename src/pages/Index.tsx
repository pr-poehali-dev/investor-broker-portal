import { useState } from 'react';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import ObjectsPage from '@/components/ObjectsPage';
import CalculatorPage from '@/components/CalculatorPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [investmentPeriod, setInvestmentPeriod] = useState(12);
  const [expectedReturn, setExpectedReturn] = useState(15);

  const investmentObjects = [
    {
      id: 1,
      title: 'ЖК «Северный квартал»',
      location: 'Москва, САО',
      type: 'Жилая недвижимость',
      minInvestment: 500000,
      expectedReturn: 22,
      term: 24,
      risk: 'Средний',
      progress: 67,
      image: '🏢'
    },
    {
      id: 2,
      title: 'ТЦ «Метрополис»',
      location: 'Санкт-Петербург',
      type: 'Коммерческая недвижимость',
      minInvestment: 1000000,
      expectedReturn: 18,
      term: 36,
      risk: 'Низкий',
      progress: 84,
      image: '🏬'
    },
    {
      id: 3,
      title: 'Апарт-отель «Прибрежный»',
      location: 'Сочи',
      type: 'Жилая недвижимость',
      minInvestment: 750000,
      expectedReturn: 25,
      term: 18,
      risk: 'Высокий',
      progress: 42,
      image: '🏨'
    },
    {
      id: 4,
      title: 'Бизнес-центр «Альфа»',
      location: 'Екатеринбург',
      type: 'Коммерческая недвижимость',
      minInvestment: 2000000,
      expectedReturn: 16,
      term: 48,
      risk: 'Низкий',
      progress: 91,
      image: '🏛️'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <HomePage investmentObjects={investmentObjects} />
        )}

        {activeTab === 'objects' && (
          <ObjectsPage investmentObjects={investmentObjects} />
        )}

        {activeTab === 'calculator' && (
          <CalculatorPage
            investmentAmount={investmentAmount}
            investmentPeriod={investmentPeriod}
            expectedReturn={expectedReturn}
            onAmountChange={setInvestmentAmount}
            onPeriodChange={setInvestmentPeriod}
            onReturnChange={setExpectedReturn}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
