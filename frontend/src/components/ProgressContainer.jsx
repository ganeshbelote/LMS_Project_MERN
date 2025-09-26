import ProgressTab from './ProgressTab';

const ProgressContainer = () => {
  const progressData = [
    { title: 'Frontend', progress: '8/15 Watched' },
    { title: 'Backend', progress: '3/14 Watched' },
    { title: 'Product Design', progress: '2/6 Watched' },
    { title: 'Project Manager', progress: '9/10 Watched' },
  ];

  return (
    <div className="mt-6 w-full max-w-4xl flex flex-wrap items-center justify-center gap-4">
      {progressData.map((item, index) => (
        <ProgressTab
          key={index}
          Title={item.title}
          Progress={item.progress}
        />
      ))}
    </div>
  );
};

export default ProgressContainer;