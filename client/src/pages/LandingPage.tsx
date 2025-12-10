import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { JobsSection } from '@/components/landing/JobsSection';
import { WhyJoinUsSection } from '@/components/landing/WhyJoinUsSection';
import { Footer } from '@/components/landing/Footer';
import { FloatingZaloButton } from '@/components/landing/FloatingZaloButton';
import type { Hero, Job } from '@shared/schema';

export default function LandingPage() {
  const { data: hero, isLoading: heroLoading } = useQuery<Hero | null>({
    queryKey: ['/api/hero'],
    queryFn: async () => {
      const res = await fetch('/api/hero');
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs');
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <HeroSection
          hero={hero ?? null}
          isLoading={heroLoading}
        />
        <JobsSection
          jobs={jobs}
          isLoading={jobsLoading}
        />
        <WhyJoinUsSection />
      </main>
      <Footer />
      <FloatingZaloButton />
    </div>
  );
}
