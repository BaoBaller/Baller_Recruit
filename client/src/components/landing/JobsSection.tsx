import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { JobCard } from "./JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import type { Job } from "@shared/schema";

interface JobsSectionProps {
  jobs: Job[];
  isLoading: boolean;
}

export function JobsSection({ jobs, isLoading }: JobsSectionProps) {
  const { t } = useLanguage();

  const activeJobs = jobs.filter((job) => job.isActive);

  return (
    <section id="jobs" className="py-20 bg-muted/30" data-testid="section-jobs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            data-testid="text-jobs-title"
          >
            {t.jobs.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.jobs.subtitle}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-80">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground" data-testid="text-no-jobs">
              {t.jobs.noJobs}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
