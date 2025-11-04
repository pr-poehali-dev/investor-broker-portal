import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
}

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const HomePage = ({ investmentObjects }: HomePageProps) => {
  const [dashboardStats, setDashboardStats] = useState<StatItem[]>([
    { label: 'Активных объектов', value: '0', change: '0%', icon: 'Building2', color: 'text-primary' },
    { label: 'Общий объем', value: '₽0', change: '0%', icon: 'TrendingUp', color: 'text-secondary' },
    { label: 'Средняя доходность', value: '0%', change: '0%', icon: 'Percent', color: 'text-primary' },
    { label: 'Инвесторов', value: '0', change: '0', icon: 'Users', color: 'text-secondary' }
  ]);

  useEffect(() => {
    loadDashboardStats();
    const interval = setInterval(loadDashboardStats, 2000);
    return () => clearInterval(interval);
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
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              Экосистема будущих миллионеров
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Инвестируйте<br />в недвижимость с умом
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Ваш капитал растет, пока вы живете своей жизнью
            </p>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Rielvestor — экосистема, где будущие миллионеры встречаются с проверенными брокерами. 
              Начните с малого и масштабируйтесь безопасно.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                <Icon name="TrendingUp" className="mr-2" size={20} />
                Начать инвестировать
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => scrollToSection('for-brokers')}
              >
                <Icon name="Briefcase" className="mr-2" size={20} />
                Для брокеров
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon name={stat.icon} size={24} className="text-white" />
                    <Badge className="bg-white/20 text-white text-xs">{stat.change}</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              От мечты к доходу — за 4 простых шага
            </h2>
            <p className="text-xl text-muted-foreground">
              Инвестируйте в недвижимость без сложностей и рисков
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: 'Target',
                title: 'Выбирайте стратегию',
                description: 'Пройдите тест и получите персональный инвестиционный план',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                icon: 'Search',
                title: 'Найдите идеальный объект',
                description: 'Умный каталог с актуальными проверенными предложениями',
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '03',
                icon: 'Handshake',
                title: 'Совершите сделку',
                description: 'Рейтинги, отзывы и полная юридическая защита',
                color: 'from-pink-500 to-pink-600'
              },
              {
                step: '04',
                icon: 'LineChart',
                title: 'Отслеживайте рост',
                description: 'Аналитика денежного потока и стоимости актива в личном кабинете',
                color: 'from-orange-500 to-orange-600'
              }
            ].map((item, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.color}`}></div>
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <Icon name={item.icon} size={32} className="text-white" />
                  </div>
                  <div className="text-5xl font-bold text-muted-foreground/20 absolute top-4 right-4">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Больше чем сделка
            </h2>
            <p className="text-xl text-muted-foreground">
              Ваш капитал работает по стратегии
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Blocks',
                title: 'Инвестиционный конструктор',
                description: 'Сборка портфеля из разных типов недвижимости',
                features: ['Диверсификация рисков', 'Гибкая стратегия', 'Автоматическая ребалансировка']
              },
              {
                icon: 'ShoppingCart',
                title: 'Биржа проверенных объектов',
                description: 'Покупка и продажа долей с прозрачной историей',
                features: ['Ликвидность активов', 'Прозрачное ценообразование', 'Безопасные сделки']
              },
              {
                icon: 'GraduationCap',
                title: 'Академия Rielvestor',
                description: 'Курсы и вебинары по стратегиям приумножения капитала',
                features: ['Обучение от экспертов', 'Практические кейсы', 'Сертификаты']
              }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <Icon name={item.icon} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <Icon name="CheckCircle2" size={16} className="mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="for-brokers" className="py-20 px-6 bg-gradient-to-br from-secondary via-secondary/90 to-primary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Для профессионалов рынка
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ваш цифровой офис<br />и источник клиентов
            </h2>
            <p className="text-xl text-white/80">
              Перестаньте терять сделки в соцсетях
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: 'Store',
                title: 'Персональная брокерская витрина',
                description: 'Портфолио с рейтингами и историей сделок',
                benefit: 'Укрепите репутацию и привлекайте больше клиентов'
              },
              {
                icon: 'Video',
                title: 'Дистанционные сделки',
                description: 'Онлайн-показы, 3D-туры и электронный документооборот',
                benefit: 'Экономьте время на рутинных процессах'
              },
              {
                icon: 'RefreshCw',
                title: 'Автоматическая актуальность',
                description: 'Мгновенное обновление статусов объектов',
                benefit: 'Избавьтесь от устаревших объявлений'
              },
              {
                icon: 'UserCheck',
                title: 'База лояльных инвесторов',
                description: 'Целевые заявки от подготовленных пользователей',
                benefit: 'Работайте только с заинтересованными клиентами'
              }
            ].map((item, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={28} className="text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl mb-2">{item.title}</CardTitle>
                      <CardDescription className="text-white/70">{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 bg-white/10 rounded-lg p-3">
                    <Icon name="Sparkles" size={16} className="text-yellow-300 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/90">{item.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              <Icon name="Rocket" className="mr-2" size={20} />
              Подключиться как брокер
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Инвестируйте с уверенностью
            </h2>
            <p className="text-xl text-muted-foreground">
              Многоуровневая система защиты ваших интересов
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'Shield',
                title: 'Юридический эскроу',
                description: 'Средства защищены до завершения сделки'
              },
              {
                icon: 'FileCheck',
                title: 'Аудит всех объектов',
                description: 'Проверка документов и юридической чистоты'
              },
              {
                icon: 'Star',
                title: 'Рейтинги и отзывы',
                description: 'Прозрачная репутационная система'
              },
              {
                icon: 'Headphones',
                title: 'Поддержка 24/7',
                description: 'Всегда на связи для решения вопросов'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ваш путь к финансовой свободе<br />начинается здесь
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Присоединяйтесь к сообществу умных инвесторов и прогрессивных брокеров
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              <Icon name="UserPlus" className="mr-2" size={20} />
              Зарегистрироваться как инвестор
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <Icon name="Building" className="mr-2" size={20} />
              Подключиться как брокер
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2,500+', label: 'Инвесторов' },
              { value: '₽15B+', label: 'Объем сделок' },
              { value: '350+', label: 'Брокеров' },
              { value: '98%', label: 'Довольных клиентов' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
