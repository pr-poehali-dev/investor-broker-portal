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
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6" onClick={onRegisterClick}>
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
                benefit: 'Получите персональный инвестиционный план за 5 минут',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                icon: 'Search',
                title: 'Найдите идеальный объект',
                description: 'Умный каталог с актуальными проверенными предложениями',
                benefit: 'Фильтруйте объекты по доходности, сумме входа, локации',
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '03',
                icon: 'Handshake',
                title: 'Совершите сделку',
                description: 'Рейтинги, отзывы и полная юридическая защита',
                benefit: 'Сравнивайте рейтинги брокеров и читайте реальные отзывы',
                color: 'from-pink-500 to-pink-600'
              },
              {
                step: '04',
                icon: 'LineChart',
                title: 'Отслеживайте рост',
                description: 'Аналитика денежного потока и стоимости актива в личном кабинете',
                benefit: 'Отслеживайте доходность портфеля в личном кабинете 24/7',
                color: 'from-orange-500 to-orange-600'
              }
            ].map((item, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.color}`}></div>
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon name={item.icon} size={32} className="text-white" />
                  </div>
                  <div className="text-5xl font-bold text-muted-foreground/20 absolute top-4 right-4">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3 border border-primary/10">
                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-primary">{item.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6" onClick={onRegisterClick}>
              <Icon name="Rocket" className="mr-2" size={20} />
              Начать инвестировать
            </Button>
          </div>
        </div>
      </section>

      <section id="growth" data-animate className={`py-20 px-6 bg-muted/30 transition-all duration-1000 ${visibleSections.has('growth') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

      <section id="testimonials" data-animate className={`py-20 px-6 bg-background transition-all duration-1000 ${visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">95% клиентов рекомендуют</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Истории успеха наших инвесторов
            </h2>
            <p className="text-xl text-muted-foreground">
              Реальные отзывы от тех, кто уже зарабатывает на недвижимости
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Алексей Морозов',
                city: 'Москва',
                avatar: '👨‍💼',
                investment: 'Инвестор в апартаменты',
                date: 'Октябрь 2024',
                rating: 5,
                text: 'За 8 месяцев мой портфель вырос на 18%. Платформа помогла разобраться в инвестициях с нуля. Особенно понравился персональный план и прозрачная аналитика.'
              },
              {
                name: 'Мария Соколова',
                city: 'Санкт-Петербург',
                avatar: '👩‍💼',
                investment: 'Вложилась в 2 объекта',
                date: 'Сентябрь 2024',
                rating: 5,
                text: 'Долго искала надежную площадку для инвестиций. Здесь все понятно: рейтинги брокеров, проверенные объекты, юридическое сопровождение. Уже получила первую прибыль!'
              },
              {
                name: 'Дмитрий Кузнецов',
                city: 'Казань',
                avatar: '👨‍💻',
                investment: 'Портфель из 4 объектов',
                date: 'Август 2024',
                rating: 5,
                text: 'Начинал с 500 тысяч, сейчас управляю портфелем в 3 млн. Удобный личный кабинет показывает всю статистику в реальном времени. Рекомендую!'
              }
            ].map((review, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription className="text-sm">{review.city}</CardDescription>
                      <Badge className="mt-2 bg-primary/10 text-primary text-xs">{review.investment}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{review.text}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="for-brokers" data-animate className={`py-20 px-6 bg-gradient-to-br from-secondary via-secondary/90 to-primary text-white transition-all duration-1000 ${visibleSections.has('for-brokers') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                title: 'Персональная визитка брокера',
                description: 'Страница с портфолио, рейтингом и отзывами клиентов',
                benefit: 'Укрепите репутацию и привлекайте больше клиентов',
                features: ['Портфолио объектов', 'История сделок', 'Отзывы клиентов']
              },
              {
                icon: 'LayoutDashboard',
                title: 'Управление объектами',
                description: 'Моментальное обновление статусов, архив проданных объектов',
                benefit: 'Избавьтесь от устаревших объявлений навсегда',
                features: ['Обновление в 1 клик', 'Архив сделок', 'Аналитика просмотров']
              },
              {
                icon: 'Video',
                title: 'Дистанционные сделки',
                description: 'Встроенные инструменты для онлайн-показов и документооборота',
                benefit: 'Экономьте время на рутинных процессах',
                features: ['Онлайн-показы', '3D-туры', 'Электронный документооборот']
              },
              {
                icon: 'Users',
                title: 'Теплые лиды',
                description: 'Заявки от инвесторов, прошедших обучение на платформе',
                benefit: 'Работайте только с заинтересованными клиентами',
                features: ['Целевые заявки', 'Профиль инвестора', 'История запросов']
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
                  <div className="flex items-start gap-2 bg-white/10 rounded-lg p-3 mb-4">
                    <Icon name="Sparkles" size={16} className="text-yellow-300 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/90 font-medium">{item.benefit}</p>
                  </div>
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-white/80">
                        <Icon name="CheckCircle2" size={14} className="mr-2 text-white/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6" onClick={onRegisterClick}>
              <Icon name="Rocket" className="mr-2" size={20} />
              Подключиться как брокер
            </Button>
          </div>
        </div>
      </section>

      <section id="security" data-animate className={`py-20 px-6 bg-background transition-all duration-1000 ${visibleSections.has('security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                description: 'Средства защищены до завершения сделки',
                detail: 'Каждая сделка проходит через счет эскроу с гарантией возврата'
              },
              {
                icon: 'FileCheck',
                title: 'Аудит всех объектов',
                description: 'Проверка документов и юридической чистоты',
                detail: 'Каждый объект проходит 3-этапную проверку юристами'
              },
              {
                icon: 'Users',
                title: 'Сопровождение сделки',
                description: 'Юрист проверяет все документы по сделке',
                detail: 'Персональный юрист ведет вашу сделку от начала до конца'
              },
              {
                icon: 'Headphones',
                title: 'Поддержка 24/7',
                description: 'Всегда на связи для решения вопросов',
                detail: 'Персональный менеджер и техподдержка в любое время'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg hover:scale-105 transition-all">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
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