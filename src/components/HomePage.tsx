import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './home/HeroSection';
import HowItWorksSection from './home/HowItWorksSection';
import GrowthSection from './home/GrowthSection';
import SecuritySection from './home/SecuritySection';
import TestimonialsSection from './home/TestimonialsSection';
import BrokersSection from './home/BrokersSection';
import FinalCTASection from './home/FinalCTASection';

interface InvestmentObject {
  id: number;
  title: string;
  location: string;
  type: string;
  price?: number;
  minInvestment?: number;
  expectedReturn: number;
  term: number;
  risk: string;
  progress?: number;
  image: string;
}

interface HomePageProps {
  investmentObjects: InvestmentObject[];
  onRegisterClick?: () => void;
}

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const HomePage = ({ investmentObjects, onRegisterClick }: HomePageProps) => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState<StatItem[]>([
    { label: 'Активных объектов', value: '0', change: '0%', icon: 'Building2', color: 'text-primary' },
    { label: 'Общий объем', value: '₽0', change: '0%', icon: 'TrendingUp', color: 'text-secondary' },
    { label: 'Средняя доходность', value: '0%', change: '0%', icon: 'Percent', color: 'text-primary' },
    { label: 'Инвесторов', value: '0', change: '0', icon: 'Users', color: 'text-secondary' }
  ]);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDashboardStats();
    const interval = setInterval(loadDashboardStats, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const loadDashboardStats = () => {
    try {
      const savedBrokerObjects = localStorage.getItem('broker-objects');
      
      let activeObjects = investmentObjects.length;
      let totalVolume = 0;
      let avgReturn = 0;
      let investorsCount = 0;

      if (savedBrokerObjects) {
        const brokerObjects = JSON.parse(savedBrokerObjects);
        activeObjects = brokerObjects.filter((obj: any) => obj.status === 'active').length;
        totalVolume = brokerObjects.reduce((sum: number, obj: any) => sum + (obj.price || 0), 0);
        avgReturn = brokerObjects.length > 0
          ? brokerObjects.reduce((sum: number, obj: any) => sum + obj.expectedReturn, 0) / brokerObjects.length
          : 0;
        investorsCount = brokerObjects.reduce((sum: number, obj: any) => sum + (obj.investors || 0), 0);
      }
      
      setDashboardStats([
        { label: 'Активных объектов', value: activeObjects.toString(), change: '+12%', icon: 'Building2', color: 'text-primary' },
        { label: 'Общий объем', value: `₽${(totalVolume / 1000000).toFixed(1)}M`, change: '+8.3%', icon: 'TrendingUp', color: 'text-secondary' },
        { label: 'Средняя доходность', value: `${avgReturn.toFixed(1)}%`, change: '+2.1%', icon: 'Percent', color: 'text-primary' },
        { label: 'Инвесторов', value: investorsCount.toString(), change: `+${Math.max(1, Math.floor(investorsCount * 0.1))}`, icon: 'Users', color: 'text-secondary' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <HeroSection 
        dashboardStats={dashboardStats}
        onRegisterClick={onRegisterClick}
        scrollToSection={scrollToSection}
      />

      <HowItWorksSection onRegisterClick={onRegisterClick} />

      <GrowthSection isVisible={visibleSections.has('growth')} />

      <SecuritySection isVisible={visibleSections.has('security')} />

      <TestimonialsSection isVisible={visibleSections.has('testimonials')} />

      <BrokersSection 
        isVisible={visibleSections.has('for-brokers')}
        onRegisterClick={onRegisterClick}
      />

      <FinalCTASection onRegisterClick={onRegisterClick} />
    </div>
  );
};

export default HomePage;