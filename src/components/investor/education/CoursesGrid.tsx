import CourseCard from './CourseCard';
import type { Course } from './courseData';

interface CoursesGridProps {
  courses: Course[];
  completedLessons: Set<string>;
  onSelectCourse: (course: Course) => void;
  filterLevel?: Course['level'] | 'all';
}

const CoursesGrid = ({ 
  courses, 
  completedLessons, 
  onSelectCourse,
  filterLevel = 'all'
}: CoursesGridProps) => {
  const filteredCourses = filterLevel === 'all' 
    ? courses 
    : courses.filter(c => c.level === filterLevel);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          completedLessons={completedLessons}
          onSelectCourse={onSelectCourse}
        />
      ))}
    </div>
  );
};

export default CoursesGrid;
