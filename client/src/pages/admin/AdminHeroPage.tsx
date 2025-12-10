import { useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Image, Video } from 'lucide-react';
import type { Hero } from '@shared/schema';

const heroSchema = z.object({
  titleVi: z.string().min(1, 'Title (Vietnamese) is required'),
  titleEn: z.string().min(1, 'Title (English) is required'),
  subtitleVi: z.string().min(1, 'Subtitle (Vietnamese) is required'),
  subtitleEn: z.string().min(1, 'Subtitle (English) is required'),
  backgroundType: z.enum(['image', 'video']),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  ctaTextVi: z.string().min(1, 'CTA text (Vietnamese) is required'),
  ctaTextEn: z.string().min(1, 'CTA text (English) is required'),
  ctaLink: z.string().min(1, 'CTA link is required'),
});

type HeroForm = z.infer<typeof heroSchema>;

export default function AdminHeroPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: hero, isLoading } = useQuery<Hero | null>({
    queryKey: ['/api/hero'],
    queryFn: async () => {
      const res = await fetch('/api/hero');
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch hero');
      return res.json();
    },
  });

  const form = useForm<HeroForm>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      titleVi: '',
      titleEn: '',
      subtitleVi: '',
      subtitleEn: '',
      backgroundType: 'image',
      imageUrl: '',
      videoUrl: '',
      ctaTextVi: '',
      ctaTextEn: '',
      ctaLink: '#jobs',
    },
  });

  useEffect(() => {
    if (hero) {
      form.reset({
        titleVi: hero.titleVi,
        titleEn: hero.titleEn,
        subtitleVi: hero.subtitleVi,
        subtitleEn: hero.subtitleEn,
        backgroundType: hero.backgroundType as 'image' | 'video',
        imageUrl: hero.imageUrl || '',
        videoUrl: hero.videoUrl || '',
        ctaTextVi: hero.ctaTextVi,
        ctaTextEn: hero.ctaTextEn,
        ctaLink: hero.ctaLink,
      });
    }
  }, [hero, form]);

  const mutation = useMutation({
    mutationFn: async (data: HeroForm) => {
      const res = await apiRequest('PUT', '/api/hero', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero'] });
      toast({
        title: 'Success',
        description: 'Hero section updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update hero',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: HeroForm) => {
    mutation.mutate(data);
  };

  const backgroundType = form.watch('backgroundType');

  return (
    <AdminLayout>
      <div className='max-w-4xl mx-auto space-y-6'>
        <div>
          <h1
            className='text-3xl font-bold text-foreground'
            data-testid='text-hero-page-title'
          >
            {t.admin.heroEditor}
          </h1>
          <p className='text-muted-foreground mt-1'>Manage the hero section displayed on the landing page.</p>
        </div>

        <Card className='border-card-border'>
          <CardHeader>
            <CardTitle>Chỉnh sửa nội dung trang chủ</CardTitle>
            <CardDescription>Configure the headline, subtitle, and call-to-action for both languages.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
                    <Label htmlFor='titleVi'>Title (Vietnamese)</Label>
                    <Input
                      id='titleVi'
                      {...form.register('titleVi')}
                      placeholder='Tiêu đề tiếng Việt'
                      data-testid='input-title-vi'
                    />
                    {form.formState.errors.titleVi && <p className='text-sm text-destructive'>{form.formState.errors.titleVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='titleEn'>Title (English)</Label>
                    <Input
                      id='titleEn'
                      {...form.register('titleEn')}
                      placeholder='English title'
                      data-testid='input-title-en'
                    />
                    {form.formState.errors.titleEn && <p className='text-sm text-destructive'>{form.formState.errors.titleEn.message}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='subtitleVi'>Subtitle (Vietnamese)</Label>
                    <Textarea
                      id='subtitleVi'
                      {...form.register('subtitleVi')}
                      placeholder='Phụ đề tiếng Việt'
                      rows={3}
                      data-testid='input-subtitle-vi'
                    />
                    {form.formState.errors.subtitleVi && <p className='text-sm text-destructive'>{form.formState.errors.subtitleVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='subtitleEn'>Subtitle (English)</Label>
                    <Textarea
                      id='subtitleEn'
                      {...form.register('subtitleEn')}
                      placeholder='English subtitle'
                      rows={3}
                      data-testid='input-subtitle-en'
                    />
                    {form.formState.errors.subtitleEn && <p className='text-sm text-destructive'>{form.formState.errors.subtitleEn.message}</p>}
                  </div>
                </div>

                <div className='space-y-4'>
                  <Label>Background Type</Label>
                  <RadioGroup
                    value={backgroundType}
                    onValueChange={(value) => form.setValue('backgroundType', value as 'image' | 'video')}
                    className='flex gap-6'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='image'
                        id='bg-image'
                        data-testid='radio-bg-image'
                      />
                      <Label
                        htmlFor='bg-image'
                        className='flex items-center gap-2 cursor-pointer'
                      >
                        <Image className='w-4 h-4' />
                        Image
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='video'
                        id='bg-video'
                        data-testid='radio-bg-video'
                      />
                      <Label
                        htmlFor='bg-video'
                        className='flex items-center gap-2 cursor-pointer'
                      >
                        <Video className='w-4 h-4' />
                        Video
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {backgroundType === 'image' ? (
                  <div className='space-y-2'>
                    <Label htmlFor='imageUrl'>Image URL</Label>
                    <Input
                      id='imageUrl'
                      {...form.register('imageUrl')}
                      placeholder='https://example.com/hero-image.jpg'
                      data-testid='input-image-url'
                    />
                    <p className='text-xs text-muted-foreground'>Recommended size: 1920x1080px or larger</p>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <Label htmlFor='videoUrl'>Video URL</Label>
                    <Input
                      id='videoUrl'
                      {...form.register('videoUrl')}
                      placeholder='https://example.com/hero-video.mp4'
                      data-testid='input-video-url'
                    />
                    <p className='text-xs text-muted-foreground'>Use MP4 format for best compatibility</p>
                  </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='ctaTextVi'>CTA Button Text (Vietnamese)</Label>
                    <Input
                      id='ctaTextVi'
                      {...form.register('ctaTextVi')}
                      placeholder='Khám Phá Ngay'
                      data-testid='input-cta-vi'
                    />
                    {form.formState.errors.ctaTextVi && <p className='text-sm text-destructive'>{form.formState.errors.ctaTextVi.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='ctaTextEn'>CTA Button Text (English)</Label>
                    <Input
                      id='ctaTextEn'
                      {...form.register('ctaTextEn')}
                      placeholder='Explore Now'
                      data-testid='input-cta-en'
                    />
                    {form.formState.errors.ctaTextEn && <p className='text-sm text-destructive'>{form.formState.errors.ctaTextEn.message}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='ctaLink'>CTA Link</Label>
                  <Input
                    id='ctaLink'
                    {...form.register('ctaLink')}
                    placeholder='#jobs or https://example.com'
                    data-testid='input-cta-link'
                  />
                  {form.formState.errors.ctaLink && <p className='text-sm text-destructive'>{form.formState.errors.ctaLink.message}</p>}
                </div>

                <div className='flex justify-end pt-4'>
                  <Button
                    type='submit'
                    disabled={mutation.isPending}
                    data-testid='button-save-hero'
                  >
                    {mutation.isPending ? (
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
