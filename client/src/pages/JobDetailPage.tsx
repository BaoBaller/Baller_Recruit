import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Building2, DollarSign, Briefcase, Upload, Loader2, CheckCircle, FileText } from 'lucide-react';
import type { Job } from '@shared/schema';

export function JobDetailPage() {
  const [, params] = useRoute('/jobs/:id');
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const jobId = params?.id ? parseInt(params.id) : null;

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ['/api/jobs', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error('Job not found');
      return res.json();
    },
    enabled: !!jobId,
  });

  const applyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit application');
      }
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: language === 'vi' ? 'Thành công!' : 'Success!',
        description: language === 'vi' ? 'Đơn ứng tuyển của bạn đã được gửi thành công.' : 'Your application has been submitted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'vi' ? 'Lỗi' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    const data = new FormData();
    data.append('jobId', jobId.toString());
    data.append('name', formData.name);
    const normalizeName = (name: string) =>
      name
        .toLowerCase()
        .trim()
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '');

    const email = formData.email?.trim() || `${normalizeName(formData.name)}@empty.local`;

    data.append('email', email);

    if (formData.phone) data.append('phone', formData.phone);
    if (formData.coverLetter) data.append('coverLetter', formData.coverLetter);
    if (resumeFile) data.append('resume', resumeFile);

    applyMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
        toast({
          title: language === 'vi' ? 'Lỗi' : 'Error',
          description: language === 'vi' ? 'Chỉ chấp nhận file PDF hoặc Word' : 'Only PDF and Word documents are allowed',
          variant: 'destructive',
        });
        return;
      }
      setResumeFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!job) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-background gap-4'>
        <h1 className='text-2xl font-bold'>{language === 'vi' ? 'Không tìm thấy công việc' : 'Job not found'}</h1>
        <Link href='/'>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            {language === 'vi' ? 'Quay lại trang chủ' : 'Back to Home'}
          </Button>
        </Link>
      </div>
    );
  }

  const title = language === 'vi' ? job.jobTitleVi : job.jobTitleEn;
  const department = language === 'vi' ? job.departmentVi : job.departmentEn;
  const location = language === 'vi' ? job.locationVi : job.locationEn;
  const salary = language === 'vi' ? job.salaryVi : job.salaryEn;
  const description = language === 'vi' ? job.descriptionVi : job.descriptionEn;
  const requirements = language === 'vi' ? job.requirementsVi : job.requirementsEn;

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 py-4 flex items-center gap-4'>
          <Link href='/'>
            <Button
              variant='ghost'
              size='icon'
              data-testid='button-back'
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <div className='flex-1'>
            <h1 className='font-semibold truncate'>{title}</h1>
            <p className='text-sm text-muted-foreground'>{department}</p>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='text-2xl'>{title}</CardTitle>
                  <div className='flex flex-wrap gap-3 mt-4'>
                    <Badge
                      variant='secondary'
                      className='gap-1'
                    >
                      <Building2 className='h-3 w-3' />
                      {department}
                    </Badge>
                    <Badge
                      variant='secondary'
                      className='gap-1'
                    >
                      <MapPin className='h-3 w-3' />
                      {location}
                    </Badge>
                    <Badge
                      variant='secondary'
                      className='gap-1'
                    >
                      <DollarSign className='h-3 w-3' />
                      {salary}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                      <Briefcase className='h-5 w-5 text-primary' />
                      {language === 'vi' ? 'Mô tả công việc' : 'Job Description'}
                    </h3>
                    <p className='text-muted-foreground whitespace-pre-line'>{description}</p>
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                      <FileText className='h-5 w-5 text-primary' />
                      {language === 'vi' ? 'Yêu cầu' : 'Requirements'}
                    </h3>
                    <p className='text-muted-foreground whitespace-pre-line'>{requirements}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className='sticky top-24'>
                <CardHeader>
                  <CardTitle>{language === 'vi' ? 'Ứng tuyển ngay' : 'Apply Now'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className='text-center py-8 space-y-4'>
                      <CheckCircle className='h-16 w-16 text-green-500 mx-auto' />
                      <h3 className='text-xl font-semibold'>{language === 'vi' ? 'Cảm ơn bạn đã ứng tuyển!' : 'Thank you for applying!'}</h3>
                      <p className='text-muted-foreground'>{language === 'vi' ? 'Chúng tôi sẽ liên hệ với bạn sớm.' : 'We will contact you soon.'}</p>
                      <Link href='/'>
                        <Button
                          variant='outline'
                          className='mt-4'
                        >
                          {language === 'vi' ? 'Xem thêm công việc' : 'View more jobs'}
                        </Button>
                      </Link>
                    </div>
                  ) : !job.isActive ? (
                    <div className='text-center py-8 space-y-4'>
                      <p className='text-muted-foreground'>{language === 'vi' ? 'Vị trí này đã đóng tuyển dụng.' : 'This position is no longer accepting applications.'}</p>
                      <Link href='/'>
                        <Button variant='outline'>{language === 'vi' ? 'Xem công việc khác' : 'View other jobs'}</Button>
                      </Link>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className='space-y-4'
                    >
                      <div className='space-y-2'>
                        <Label htmlFor='name'>{language === 'vi' ? 'Họ và tên' : 'Full Name'} *</Label>
                        <Input
                          id='name'
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter your name'}
                          data-testid='input-name'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='phone'>{language === 'vi' ? 'Số điện thoại *' : 'Phone Number'}</Label>
                        <Input
                          id='phone'
                          type='tel'
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter your phone'}
                          data-testid='input-phone'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email </Label>
                        <Input
                          id='email'
                          type='email'
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={language === 'vi' ? 'Nhập email' : 'Enter your email'}
                          data-testid='input-email'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='resume'>{language === 'vi' ? 'CV/Resume (Không bắt buộc)' : 'Resume/CV'}</Label>
                        <div className='border-2 border-dashed rounded-lg p-4 text-center'>
                          <input
                            id='resume'
                            type='file'
                            accept='.pdf,.doc,.docx'
                            onChange={handleFileChange}
                            className='hidden'
                            data-testid='input-resume'
                          />
                          <label
                            htmlFor='resume'
                            className='cursor-pointer flex flex-col items-center gap-2'
                          >
                            <Upload className='h-8 w-8 text-muted-foreground' />
                            {resumeFile ? (
                              <span className='text-sm text-primary font-medium'>{resumeFile.name}</span>
                            ) : (
                              <span className='text-sm text-muted-foreground'>{language === 'vi' ? 'Nhấn để tải lên (PDF, DOC, DOCX)' : 'Click to upload (PDF, DOC, DOCX)'}</span>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='coverLetter'>{language === 'vi' ? 'Thư giới thiệu' : 'Cover Letter'}</Label>
                        <Textarea
                          id='coverLetter'
                          rows={4}
                          value={formData.coverLetter}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              coverLetter: e.target.value,
                            })
                          }
                          placeholder={language === 'vi' ? 'Viết vài dòng giới thiệu về bản thân...' : 'Write a few lines about yourself...'}
                          data-testid='input-cover-letter'
                        />
                      </div>

                      <Button
                        type='submit'
                        className='w-full'
                        disabled={applyMutation.isPending}
                        data-testid='button-submit-application'
                      >
                        {applyMutation.isPending ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            {language === 'vi' ? 'Đang gửi...' : 'Submitting...'}
                          </>
                        ) : (
                          <>{language === 'vi' ? 'Gửi ứng tuyển' : 'Submit Application'}</>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
