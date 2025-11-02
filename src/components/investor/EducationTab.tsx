import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: Lesson[];
  icon: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  completed?: boolean;
}

const EducationTab = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const courses: Course[] = [
    {
      id: 'basics',
      title: 'Основы инвестирования',
      description: 'Узнайте базовые принципы инвестирования в недвижимость',
      level: 'beginner',
      duration: '2 часа',
      icon: 'GraduationCap',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Что такое инвестиции в недвижимость',
          content: `Инвестиции в недвижимость — это вложение денежных средств в объекты недвижимости с целью получения дохода.

**Основные виды доходов:**
- Рентный доход (сдача в аренду)
- Прирост стоимости (продажа дороже)
- Дивиденды от инвестиционных фондов

**Преимущества:**
✓ Стабильный пассивный доход
✓ Защита от инфляции
✓ Материальный актив
✓ Возможность использования заемных средств

**Риски:**
⚠ Низкая ликвидность
⚠ Высокий порог входа
⚠ Требует управления
⚠ Зависимость от рынка`,
        },
        {
          id: 'lesson-2',
          title: 'Типы недвижимости для инвестиций',
          content: `**Жилая недвижимость:**
- Квартиры
- Дома
- Апартаменты
Доходность: 5-8% годовых

**Коммерческая недвижимость:**
- Офисы
- Торговые площади
- Склады
Доходность: 8-15% годовых

**Земельные участки:**
- Под застройку
- Сельскохозяйственные
Доходность: зависит от развития региона

**Инвестиционные проекты:**
- Новостройки на этапе котлована
- Редевелопмент
Доходность: 15-30% годовых (выше риск)`,
        },
        {
          id: 'lesson-3',
          title: 'Как оценить объект недвижимости',
          content: `**Ключевые факторы оценки:**

1. **Локация**
   - Транспортная доступность
   - Инфраструктура района
   - Перспективы развития

2. **Техническое состояние**
   - Год постройки
   - Материал стен
   - Состояние инженерных систем

3. **Юридическая чистота**
   - Проверка документов
   - Отсутствие обременений
   - История собственности

4. **Финансовые показатели**
   - Рыночная стоимость
   - Потенциальный доход
   - Операционные расходы
   - Окупаемость инвестиций

5. **Рыночная ситуация**
   - Спрос и предложение
   - Динамика цен
   - Конкуренция`,
        },
      ],
    },
    {
      id: 'analysis',
      title: 'Анализ и оценка рисков',
      description: 'Научитесь анализировать инвестиционные возможности',
      level: 'intermediate',
      duration: '3 часа',
      icon: 'BarChart3',
      lessons: [
        {
          id: 'lesson-4',
          title: 'Расчет доходности инвестиций',
          content: `**Основные показатели:**

**1. ROI (Return on Investment)**
ROI = (Прибыль - Затраты) / Затраты × 100%

**2. Cap Rate (Капитализация)**
Cap Rate = Годовой доход / Стоимость объекта × 100%

**3. Cash-on-Cash Return**
CoC = Годовой денежный поток / Вложенные средства × 100%

**4. IRR (Внутренняя норма доходности)**
Учитывает временную стоимость денег

**Пример расчета:**
Стоимость квартиры: 5 000 000 ₽
Аренда в месяц: 35 000 ₽
Годовой доход: 420 000 ₽
Cap Rate = 420 000 / 5 000 000 = 8.4%

**Операционные расходы:**
- Коммунальные платежи
- Налоги
- Управление и обслуживание
- Ремонт и амортизация

Чистый доход = 420 000 - 80 000 = 340 000 ₽
Чистая доходность = 6.8%`,
        },
        {
          id: 'lesson-5',
          title: 'Управление рисками',
          content: `**Типы рисков:**

**1. Рыночные риски**
- Падение цен на недвижимость
- Снижение спроса на аренду
- Изменение процентных ставок

**Защита:** Диверсификация, долгосрочная стратегия

**2. Финансовые риски**
- Проблемы с выплатой кредита
- Неожиданные расходы
- Низкая ликвидность

**Защита:** Резервный фонд, страхование

**3. Операционные риски**
- Простой объекта
- Проблемные арендаторы
- Необходимость ремонта

**Защита:** Тщательный отбор арендаторов, регулярное обслуживание

**4. Юридические риски**
- Проблемы с документами
- Изменение законодательства
- Споры с арендаторами

**Защита:** Юридическая проверка, правильное оформление договоров

**Принципы управления рисками:**
✓ Диверсификация портфеля
✓ Страхование активов
✓ Резервный фонд (10-15% от стоимости)
✓ Профессиональное управление
✓ Регулярный мониторинг`,
        },
        {
          id: 'lesson-6',
          title: 'Налогообложение недвижимости',
          content: `**Основные налоги:**

**1. Налог на имущество физлиц**
- Ставка: 0.1% - 2% от кадастровой стоимости
- Зависит от региона и типа объекта

**2. НДФЛ с дохода от аренды**
- Ставка: 13% для резидентов
- Возможность применения вычетов

**3. НДФЛ при продаже**
- Если в собственности < 5 лет: 13% с дохода
- Если > 5 лет: освобождается
- Вычет: 1 000 000 ₽

**Оптимизация налогов:**

**Самозанятость**
- 4% при работе с физлицами
- 6% при работе с юрлицами
- Лимит дохода: 2.4 млн ₽/год

**ИП на УСН**
- 6% с доходов
- Или 15% с разницы доходы-расходы

**Инвестиционные вычеты**
- При долгосрочном владении
- Через ИИС (индивидуальный инвестиционный счет)`,
        },
      ],
    },
    {
      id: 'strategies',
      title: 'Инвестиционные стратегии',
      description: 'Продвинутые стратегии для опытных инвесторов',
      level: 'advanced',
      duration: '4 часа',
      icon: 'TrendingUp',
      lessons: [
        {
          id: 'lesson-7',
          title: 'Buy and Hold (Купи и держи)',
          content: `**Суть стратегии:**
Покупка недвижимости для долгосрочной аренды и роста стоимости.

**Преимущества:**
✓ Пассивный доход от аренды
✓ Рост стоимости активов
✓ Налоговые преимущества
✓ Использование кредитного плеча

**Недостатки:**
⚠ Требует управления
⚠ Низкая ликвидность
⚠ Риски простоя

**Оптимальные объекты:**
- Квартиры в растущих районах
- Коммерческая недвижимость с долгосрочными арендаторами
- Многоквартирные дома

**Ключевые метрики:**
- Cap Rate > 8%
- Положительный денежный поток
- Потенциал роста стоимости 5-10% в год

**Горизонт инвестирования:** 5-15+ лет`,
        },
        {
          id: 'lesson-8',
          title: 'Fix and Flip (Ремонт и продажа)',
          content: `**Суть стратегии:**
Покупка объекта, требующего ремонта, его улучшение и быстрая продажа.

**Этапы:**
1. Поиск недооцененного объекта
2. Оценка стоимости ремонта
3. Быстрый качественный ремонт
4. Продажа по рыночной цене

**Целевая прибыль:** 20-40%

**Преимущества:**
✓ Быстрая окупаемость (3-6 месяцев)
✓ Высокая доходность
✓ Не требует долгосрочного управления

**Риски:**
⚠ Ошибки в оценке стоимости ремонта
⚠ Затягивание сроков
⚠ Проблемы с продажей
⚠ Высокие налоги

**Формула успеха:**
Покупка ≤ 70% рыночной стоимости - Стоимость ремонта

**Пример:**
Рыночная стоимость: 6 000 000 ₽
Максимальная покупка: 4 200 000 ₽
Ремонт: 600 000 ₽
Итого вложено: 4 800 000 ₽
Прибыль: 1 200 000 ₽ (25%)`,
        },
        {
          id: 'lesson-9',
          title: 'Диверсификация портфеля',
          content: `**Принципы диверсификации:**

**1. По типу объектов**
- 40% - жилая недвижимость
- 30% - коммерческая недвижимость
- 20% - инвестиционные проекты
- 10% - земля

**2. По географии**
- Не более 50% в одном городе
- Разные районы города
- Разные регионы страны

**3. По стратегиям**
- 60% - долгосрочная аренда
- 30% - краткосрочная аренда
- 10% - перепродажа

**4. По уровню риска**
- 50% - низкий риск (стабильные объекты)
- 30% - средний риск (развивающиеся локации)
- 20% - высокий риск (новые проекты)

**Пример портфеля на 10 млн ₽:**
- Квартира в центре для аренды: 5 млн
- 2 квартиры в спальных районах: 3 млн
- Доля в коммерческом проекте: 1.5 млн
- Земельный участок: 0.5 млн

**Правило:** Не более 20-25% капитала в один объект`,
        },
      ],
    },
  ];

  const handleLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (completedLessons.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  const getLevelBadge = (level: Course['level']) => {
    const badges = {
      beginner: { text: 'Начальный', color: 'bg-green-100 text-green-700' },
      intermediate: { text: 'Средний', color: 'bg-blue-100 text-blue-700' },
      advanced: { text: 'Продвинутый', color: 'bg-purple-100 text-purple-700' },
    };
    return badges[level];
  };

  if (selectedCourse) {
    const completedCount = selectedCourse.lessons.filter(l => completedLessons.has(l.id)).length;
    const progress = (completedCount / selectedCourse.lessons.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedCourse(null)}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад к курсам
          </Button>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
            <p className="text-muted-foreground">
              Прогресс: {completedCount} из {selectedCourse.lessons.length} уроков
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Завершено</div>
            <div className="text-3xl font-bold text-primary">{Math.round(progress)}%</div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedCourse.lessons.map((lesson) => {
            const isCompleted = completedLessons.has(lesson.id);
            return (
              <Card key={lesson.id} className={isCompleted ? 'border-green-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-muted'}`}>
                        <Icon 
                          name={isCompleted ? 'CheckCircle2' : 'BookOpen'} 
                          className={isCompleted ? 'text-green-600' : 'text-muted-foreground'}
                          size={24}
                        />
                      </div>
                      <CardTitle>{lesson.title}</CardTitle>
                    </div>
                    <Button
                      variant={isCompleted ? 'outline' : 'default'}
                      onClick={() => handleLessonComplete(lesson.id)}
                    >
                      {isCompleted ? 'Отменить' : 'Завершить'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none whitespace-pre-line">
                    {lesson.content}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Обучающие материалы</h3>
        <p className="text-muted-foreground">Изучите основы инвестирования в недвижимость</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Все курсы</TabsTrigger>
          <TabsTrigger value="beginner">Начальный</TabsTrigger>
          <TabsTrigger value="intermediate">Средний</TabsTrigger>
          <TabsTrigger value="advanced">Продвинутый</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const badge = getLevelBadge(course.level);
              const completedCount = course.lessons.filter(l => completedLessons.has(l.id)).length;
              const progress = (completedCount / course.lessons.length) * 100;

              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course)}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon name={course.icon as any} className="text-primary" size={32} />
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Clock" size={16} />
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.lessons.length} уроков</span>
                      </div>
                      
                      {progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-semibold">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <Button className="w-full mt-4">
                        {progress > 0 ? 'Продолжить' : 'Начать курс'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {['beginner', 'intermediate', 'advanced'].map((level) => (
          <TabsContent key={level} value={level} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => c.level === level).map((course) => {
                const badge = getLevelBadge(course.level);
                const completedCount = course.lessons.filter(l => completedLessons.has(l.id)).length;
                const progress = (completedCount / course.lessons.length) * 100;

                return (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course)}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon name={course.icon as any} className="text-primary" size={32} />
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Clock" size={16} />
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span>{course.lessons.length} уроков</span>
                        </div>
                        
                        {progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Прогресс</span>
                              <span className="font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <Button className="w-full mt-4">
                          {progress > 0 ? 'Продолжить' : 'Начать курс'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EducationTab;
