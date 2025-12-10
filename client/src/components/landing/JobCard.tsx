import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Banknote, ArrowRight } from 'lucide-react';
import type { Job } from '@shared/schema';

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const { language, t } = useLanguage();

  const title = language === 'vi' ? job.jobTitleVi : job.jobTitleEn;
  const department = language === 'vi' ? job.departmentVi : job.departmentEn;
  const location = language === 'vi' ? job.locationVi : job.locationEn;
  const salary = language === 'vi' ? job.salaryVi : job.salaryEn;
  const description = language === 'vi' ? job.descriptionVi : job.descriptionEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className='
    flex-1 
    bg-gray-50 
    rounded-3xl 
    shadow-lg 
    p-10 
    flex 
    flex-col 
    justify-between
    hover:shadow-xl 
    transition-all 
    duration-300
  '
        data-testid={`card-job-${job.id}`}
      >
        <CardHeader className='pb-3 space-y-3'>
          <div className='flex items-start justify-between gap-3'>
            <h3
              className='text-xl font-semibold text-foreground line-clamp-2'
              data-testid={`text-job-title-${job.id}`}
            >
              {title}
            </h3>
            <Badge
              variant={job.isActive ? 'default' : 'secondary'}
              className='shrink-0'
              data-testid={`badge-job-status-${job.id}`}
            >
              {job.isActive ? (language === 'vi' ? 'Đang tuyển' : 'Hiring') : language === 'vi' ? 'Đã đóng' : 'Closed'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='flex-1 space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Building2 className='h-4 w-4 shrink-0' />
              <span
                className='text-sm'
                data-testid={`text-job-department-${job.id}`}
              >
                {department}
              </span>
            </div>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='h-4 w-4 shrink-0' />
              <span
                className='text-sm'
                data-testid={`text-job-location-${job.id}`}
              >
                {location}
              </span>
            </div>
            <div className='flex items-center gap-2 text-primary font-medium'>
              <Banknote className='h-4 w-4 shrink-0' />
              <span
                className='text-sm'
                data-testid={`text-job-salary-${job.id}`}
              >
                {salary}
              </span>
            </div>
          </div>

          <p
            className='text-muted-foreground text-sm line-clamp-3 leading-relaxed'
            data-testid={`text-job-description-${job.id}`}
          >
            {description}
          </p>
        </CardContent>

        <CardFooter className='pt-4'>
          <Link
            href={`/jobs/${job.id}`}
            className='w-full'
          >
            <Button
              className='w-full'
              variant={job.isActive ? 'default' : 'secondary'}
              data-testid={`button-view-${job.id}`}
            >
              {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
