import CourseCard from './CourseCard'
import dummyimg from '../../assets/image/19199494.jpg'

const CourseContainer = ({ isLoading }) => {
  const courses = [
    {
      id: 1,
      title: "Beginner's Guide to Frontend",
      instructor: 'Jane Doe',
      progress: 60,
    },
    {
      id: 2,
      title: "Beginner's Guide to Backend",
      instructor: 'John Smith',
      progress: 30,
    },
    {
      id: 3,
      title: 'Product Design Basics',
      instructor: 'Emily Brown',
      progress: 85,
    },
    {
      id: 4,
      title: "Beginner's Guide to Frontend",
      instructor: 'Jane Doe',
      progress: 60,
    },
    {
      id: 5,
      title: "Beginner's Guide to Backend",
      instructor: 'John Smith',
      progress: 30,
    },
    {
      id: 6,
      title: 'Product Design Basics',
      instructor: 'Emily Brown',
      progress: 85,
    }
  ]

  return (
    <div className='max-w-4xl flex items-center justify-center flex-col'>
      <h2 className='text-2xl font-bold text-blue-600 mb-4'>
        Continue Watching
      </h2>
      {isLoading ? (
        // Skeleton loader for course card
        <div className='flex flex-wrap justify-center gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='bg-gray-300 rounded-lg h-64 w-64 animate-pulse'
            ></div>
          ))}
        </div>
      ) : (
        <div className='flex flex-wrap justify-center gap-4'>
          {courses.map(course => (
            <CourseCard
              key={course.id}
              Id={course.id}
              title={course.title}
              instructor={course.instructor}
              progress={course.progress}
              image={dummyimg}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseContainer
