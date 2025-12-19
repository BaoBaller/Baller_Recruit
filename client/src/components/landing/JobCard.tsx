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
  const { language } = useLanguage();

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
      <Card className='h-full flex flex-col p-8 rounded-3xl min-w-[340px] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-card-border bg-white'>
        <CardHeader className='pb-6 space-y-4'>
          <div className='flex items-start justify-between gap-3'>
            <h3 className='text-2xl font-bold text-foreground leading-snug line-clamp-2'>{title}</h3>
            <Badge className={`px-3 py-1 rounded-full text-white ${job.isActive ? 'bg-green-600' : 'bg-gray-400'}`}>
              {job.isActive ? (language === 'vi' ? 'Đang tuyển' : 'Hiring') : language === 'vi' ? 'Đã đóng' : 'Closed'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='flex-1 space-y-6 text-base overflow-hidden'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Building2 className='h-4 w-4' />
              <span className='text-base font-medium'>{department}</span>
            </div>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='h-4 w-4' />
              <span className='text-base font-medium'>{location}</span>
            </div>
            <div className='flex items-center gap-2 text-primary font-medium'>
              <Banknote className='h-4 w-4' />
              <span className='text-base font-medium'>{salary}</span>
            </div>
          </div>

          <p className='text-muted-foreground text-base font-medium leading-relaxed line-clamp-4'>{description}</p>
        </CardContent>

        <CardFooter className='pt-6'>
          <Link
            href={`/jobs/${job.id}`}
            className='w-full'
          >
            <Button
              className='w-full'
              variant={job.isActive ? 'default' : 'secondary'}
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
