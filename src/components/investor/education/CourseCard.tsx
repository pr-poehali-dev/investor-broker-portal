import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Course } from './courseData';

interface CourseCardProps {
  course: Course;
  completedLessons: Set<string>;
  onSelectCourse: (course: Course) => void;
}

export const getLevelBadge = (level: Course['level']) => {
  const badges = {
    beginner: { text: 'Начальный', color: 'bg-green-100 text-green-700' },
    intermediate: { text: 'Средний', color: 'bg-blue-100 text-blue-700' },
    advanced: { text: 'Продвинутый', color: 'bg-purple-100 text-purple-700' },
  };
  return badges[level];
};

const CourseCard = ({ course, completedLessons, onSelectCourse }: CourseCardProps) => {
  const badge = getLevelBadge(course.level);
  const completedCount = course.lessons.filter(l => completedLessons.has(l.id)).length;
  const progress = (completedCount / course.lessons.length) * 100;

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onSelectCourse(course)}
    >
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
};

export default CourseCard;
