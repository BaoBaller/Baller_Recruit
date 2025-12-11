import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import type { Job } from '@shared/schema';

const jobSchema = z.object({
  jobTitleVi: z.string().min(1, 'Job title (Vietnamese) is required'),
  jobTitleEn: z.string().optional().or(z.literal('')),

  departmentVi: z.string().min(1, 'Department (Vietnamese) is required'),
  departmentEn: z.string().optional().or(z.literal('')),

  locationVi: z.string().min(1, 'Location (Vietnamese) is required'),
  locationEn: z.string().optional().or(z.literal('')),

  salaryVi: z.string().min(1, 'Salary (Vietnamese) is required'),
  salaryEn: z.string().optional().or(z.literal('')),

  descriptionVi: z.string().min(1, 'Description (Vietnamese) is required'),
  descriptionEn: z.string().optional().or(z.literal('')),

  requirementsVi: z.string().min(1, 'Requirements (Vietnamese) are required'),
  requirementsEn: z.string().optional().or(z.literal('')),

  applyEmail: z.string().email().optional().or(z.literal('')),
  applyLink: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean(),
});

type JobForm = z.infer<typeof jobSchema>;

export default function AdminJobFormPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/jobs/:id');
  const isEditing = params?.id && params.id !== 'new';
  const jobId = isEditing ? parseInt(params.id) : null;

  const { data: job, isLoading } = useQuery<Job | null>({
    queryKey: ['/api/jobs', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!jobId,
  });

  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitleVi: '',
      jobTitleEn: '',
      departmentVi: '',
      departmentEn: '',
      locationVi: '',
      locationEn: '',
      salaryVi: '',
      salaryEn: '',
      descriptionVi: '',
      descriptionEn: '',
      requirementsVi: '',
      requirementsEn: '',
      applyEmail: '',
      applyLink: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        jobTitleVi: job.jobTitleVi,
        jobTitleEn: job.jobTitleEn,
        departmentVi: job.departmentVi,
        departmentEn: job.departmentEn,
        locationVi: job.locationVi,
        locationEn: job.locationEn,
        salaryVi: job.salaryVi,
        salaryEn: job.salaryEn,
        descriptionVi: job.descriptionVi,
        descriptionEn: job.descriptionEn,
        requirementsVi: job.requirementsVi,
        requirementsEn: job.requirementsEn,
        applyEmail: job.applyEmail || '',
        applyLink: job.applyLink || '',
        isActive: job.isActive,
      });
    }
  }, [job, form]);

  const createMutation = useMutation({
    mutationFn: async (data: JobForm) => {
      const res = await apiRequest('POST', '/api/jobs', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({
        title: 'Success',
        description: 'Job created successfully',
      });
      setLocation('/admin/jobs');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create job',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: JobForm) => {
      const res = await apiRequest('PUT', `/api/jobs/${jobId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', jobId] });
      toast({
        title: 'Success',
        description: 'Job updated successfully',
      });
      setLocation('/admin/jobs');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update job',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: JobForm) => {
    const sanitizedData = {
      ...data,
      applyEmail: data.applyEmail || null,
      applyLink: data.applyLink || null,
    };
    if (isEditing) {
      updateMutation.mutate(sanitizedData as JobForm);
    } else {
      createMutation.mutate(sanitizedData as JobForm);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className='max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setLocation('/admin/jobs')}
            data-testid='button-back'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
          <div>
            <h1
              className='text-3xl font-bold text-foreground'
              data-testid='text-job-form-title'
            >
              {isEditing ? t.admin.editJob : t.admin.createJob}
            </h1>
            <p className='text-muted-foreground mt-1'>{isEditing ? 'Update the job posting details.' : 'Fill in the details for the new job posting.'}</p>
          </div>
        </div>

        <Card className='border-card-border'>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the job information in both Vietnamese and English.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && isEditing ? (
              <div className='space-y-6'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='grid grid-cols-2 gap-4'
                  >
                    <Skeleton className='h-20 w-full' />
                    <Skeleton className='h-20 w-full' />
                  </div>
                ))}
              </div>
            ) : (
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='jobTitleVi'>Job Title (Vietnamese)</Label>
                    <Input
                      id='jobTitleVi'
                      {...form.register('jobTitleVi')}
                      placeholder='Chức danh công việc'
                      data-testid='input-job-title-vi'
                    />
                    {form.formState.errors.jobTitleVi && <p className='text-sm text-destructive'>{form.formState.errors.jobTitleVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='jobTitleEn'>Job Title (English)</Label>
                    <Input
                      id='jobTitleEn'
                      {...form.register('jobTitleEn')}
                      placeholder='Job title'
                      data-testid='input-job-title-en'
                    />
                    {form.formState.errors.jobTitleEn && <p className='text-sm text-destructive'>{form.formState.errors.jobTitleEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='departmentVi'>Department (Vietnamese)</Label>
                    <Input
                      id='departmentVi'
                      {...form.register('departmentVi')}
                      placeholder='Phòng ban'
                      data-testid='input-department-vi'
                    />
                    {form.formState.errors.departmentVi && <p className='text-sm text-destructive'>{form.formState.errors.departmentVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='departmentEn'>Department (English)</Label>
                    <Input
                      id='departmentEn'
                      {...form.register('departmentEn')}
                      placeholder='Department'
                      data-testid='input-department-en'
                    />
                    {form.formState.errors.departmentEn && <p className='text-sm text-destructive'>{form.formState.errors.departmentEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='locationVi'>Location (Vietnamese)</Label>
                    <Input
                      id='locationVi'
                      {...form.register('locationVi')}
                      placeholder='Địa điểm làm việc'
                      data-testid='input-location-vi'
                    />
                    {form.formState.errors.locationVi && <p className='text-sm text-destructive'>{form.formState.errors.locationVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='locationEn'>Location (English)</Label>
                    <Input
                      id='locationEn'
                      {...form.register('locationEn')}
                      placeholder='Work location'
                      data-testid='input-location-en'
                    />
                    {form.formState.errors.locationEn && <p className='text-sm text-destructive'>{form.formState.errors.locationEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='salaryVi'>Salary (Vietnamese)</Label>
                    <Input
                      id='salaryVi'
                      {...form.register('salaryVi')}
                      placeholder='15 - 25 triệu VNĐ'
                      data-testid='input-salary-vi'
                    />
                    {form.formState.errors.salaryVi && <p className='text-sm text-destructive'>{form.formState.errors.salaryVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='salaryEn'>Salary (English)</Label>
                    <Input
                      id='salaryEn'
                      {...form.register('salaryEn')}
                      placeholder='$1,000 - $2,000'
                      data-testid='input-salary-en'
                    />
                    {form.formState.errors.salaryEn && <p className='text-sm text-destructive'>{form.formState.errors.salaryEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='descriptionVi'>Description (Vietnamese)</Label>
                    <Textarea
                      id='descriptionVi'
                      {...form.register('descriptionVi')}
                      placeholder='Mô tả công việc chi tiết...'
                      rows={5}
                      data-testid='input-description-vi'
                    />
                    {form.formState.errors.descriptionVi && <p className='text-sm text-destructive'>{form.formState.errors.descriptionVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='descriptionEn'>Description (English)</Label>
                    <Textarea
                      id='descriptionEn'
                      {...form.register('descriptionEn')}
                      placeholder='Detailed job description...'
                      rows={5}
                      data-testid='input-description-en'
                    />
                    {form.formState.errors.descriptionEn && <p className='text-sm text-destructive'>{form.formState.errors.descriptionEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='requirementsVi'>Requirements (Vietnamese)</Label>
                    <Textarea
                      id='requirementsVi'
                      {...form.register('requirementsVi')}
                      placeholder='Yêu cầu công việc...'
                      rows={5}
                      data-testid='input-requirements-vi'
                    />
                    {form.formState.errors.requirementsVi && <p className='text-sm text-destructive'>{form.formState.errors.requirementsVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='requirementsEn'>Requirements (English)</Label>
                    <Textarea
                      id='requirementsEn'
                      {...form.register('requirementsEn')}
                      placeholder='Job requirements...'
                      rows={5}
                      data-testid='input-requirements-en'
                    />
                    {form.formState.errors.requirementsEn && <p className='text-sm text-destructive'>{form.formState.errors.requirementsEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='applyEmail'>Apply Email (optional)</Label>
                    <Input
                      id='applyEmail'
                      type='email'
                      {...form.register('applyEmail')}
                      placeholder='hr@company.com'
                      data-testid='input-apply-email'
                    />
                    {form.formState.errors.applyEmail && <p className='text-sm text-destructive'>{form.formState.errors.applyEmail.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='applyLink'>Apply Link (optional)</Label>
                    <Input
                      id='applyLink'
                      {...form.register('applyLink')}
                      placeholder='https://jobs.company.com/apply'
                      data-testid='input-apply-link'
                    />
                    {form.formState.errors.applyLink && <p className='text-sm text-destructive'>{form.formState.errors.applyLink.message}</p>}
                  </div>
                </div>

                <div className='flex items-center gap-3 p-4 rounded-lg border bg-muted/30'>
                  <Switch
                    id='isActive'
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                    data-testid='switch-is-active'
                  />
                  <div>
                    <Label
                      htmlFor='isActive'
                      className='font-medium cursor-pointer'
                    >
                      Active Status
                    </Label>
                    <p className='text-sm text-muted-foreground'>When active, this job will be visible on the public website.</p>
                  </div>
                </div>

                <div className='flex justify-end gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setLocation('/admin/jobs')}
                    data-testid='button-cancel'
                  >
                    {t.admin.cancel}
                  </Button>
                  <Button
                    type='submit'
                    disabled={isPending}
                    data-testid='button-save-job'
                  >
                    {isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        {t.admin.save}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
