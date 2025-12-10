import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { JobCard } from '@/components/landing/JobCard';
import type { Job } from '@shared/schema';

export default function JobsListPage() {
  const { language } = useLanguage();

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const title = language === 'vi' ? 'Tất Cả Công Việc' : 'All Job Openings';
  const subtitle = language === 'vi' ? 'Khám phá toàn bộ vị trí tuyển dụng của chúng tôi.' : 'Explore all available job opportunities.';

  return (
    <div className='min-h-screen bg-background'>
      {/* TOP HERO AREA FOR YOUR IMAGE */}
      <div className='w-full h-64 bg-muted flex items-center justify-center relative'>
        {/* Put your image here */}
        <img
          src='/hiring-process.jpg' // <-- replace with your image
          alt='Hiring Process'
          className='w-full h-full object-cover opacity-80'
        />

        <div className='absolute inset-0 bg-black/30'></div>
        <h1 className='absolute text-white text-4xl font-bold'>{title}</h1>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-16'>
        <p className='text-lg text-muted-foreground text-center mb-8'>{subtitle}</p>

        {/* JOB LIST */}
        {isLoading ? (
          <p className='text-center text-muted-foreground'>Loading...</p>
        ) : jobs.length === 0 ? (
          <p className='text-center text-muted-foreground'>{language === 'vi' ? 'Hiện không có công việc.' : 'No jobs available.'}</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
