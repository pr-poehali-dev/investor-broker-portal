import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LessonView from './LessonView';
import type { Course } from './courseData';

interface CourseDetailViewProps {
  course: Course;
  completedLessons: Set<string>;
  onBack: () => void;
  onToggleComplete: (lessonId: string) => void;
}

const CourseDetailView = ({ 
  course, 
  completedLessons, 
  onBack, 
  onToggleComplete 
}: CourseDetailViewProps) => {
  const completedCount = course.lessons.filter(l => completedLessons.has(l.id)).length;
  const progress = (completedCount / course.lessons.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Назад к курсам
        </Button>
        <div className="flex-1">
          <h3 className="text-2xl font-bold">{course.title}</h3>
          <p className="text-muted-foreground">
            Прогресс: {completedCount} из {course.lessons.length} уроков
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Завершено</div>
          <div className="text-3xl font-bold text-primary">{Math.round(progress)}%</div>
        </div>
      </div>

      <div className="space-y-4">
        {course.lessons.map((lesson) => (
          <LessonView
            key={lesson.id}
            lesson={lesson}
            isCompleted={completedLessons.has(lesson.id)}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseDetailView;
