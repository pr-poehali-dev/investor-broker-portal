import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TestimonialsSectionProps {
  isVisible: boolean;
}

const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
  const reviews = [
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
  ];

  return (
    <section 
      id="testimonials" 
      data-animate 
      className={`py-20 px-6 bg-background transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
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
          {reviews.map((review, index) => (
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
  );
};

export default TestimonialsSection;
