import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { coursesData } from './education/courseData';
import CourseDetailView from './education/CourseDetailView';
import CoursesGrid from './education/CoursesGrid';
import type { Course } from './education/courseData';

const STORAGE_KEY = 'education_completed_lessons';

const EducationTab = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons]);

  const handleLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (completedLessons.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  if (selectedCourse) {
    return (
      <CourseDetailView
        course={selectedCourse}
        completedLessons={completedLessons}
        onBack={() => setSelectedCourse(null)}
        onToggleComplete={handleLessonComplete}
      />
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
          <CoursesGrid
            courses={coursesData}
            completedLessons={completedLessons}
            onSelectCourse={setSelectedCourse}
            filterLevel="all"
          />
        </TabsContent>

        <TabsContent value="beginner" className="mt-6">
          <CoursesGrid
            courses={coursesData}
            completedLessons={completedLessons}
            onSelectCourse={setSelectedCourse}
            filterLevel="beginner"
          />
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <CoursesGrid
            courses={coursesData}
            completedLessons={completedLessons}
            onSelectCourse={setSelectedCourse}
            filterLevel="intermediate"
          />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <CoursesGrid
            courses={coursesData}
            completedLessons={completedLessons}
            onSelectCourse={setSelectedCourse}
            filterLevel="advanced"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationTab;