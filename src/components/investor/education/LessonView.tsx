import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Lesson } from './courseData';

interface LessonViewProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
}

const LessonView = ({ lesson, isCompleted, onToggleComplete }: LessonViewProps) => {
  return (
    <Card className={isCompleted ? 'border-green-500' : ''}>
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
            onClick={() => onToggleComplete(lesson.id)}
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
};

export default LessonView;
