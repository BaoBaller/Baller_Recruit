import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Banknote, ArrowRight, Mail } from "lucide-react";
import type { Job } from "@shared/schema";

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const { language, t } = useLanguage();

  const title = language === "vi" ? job.jobTitleVi : job.jobTitleEn;
  const department = language === "vi" ? job.departmentVi : job.departmentEn;
  const location = language === "vi" ? job.locationVi : job.locationEn;
  const salary = language === "vi" ? job.salaryVi : job.salaryEn;
  const description = language === "vi" ? job.descriptionVi : job.descriptionEn;

  const applyUrl = job.applyLink || (job.applyEmail ? `mailto:${job.applyEmail}` : null);
  const isEmailApply = !job.applyLink && job.applyEmail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-card-border"
        data-testid={`card-job-${job.id}`}
      >
        <CardHeader className="pb-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-xl font-semibold text-foreground line-clamp-2"
              data-testid={`text-job-title-${job.id}`}
            >
              {title}
            </h3>
            <Badge
              variant={job.isActive ? "default" : "secondary"}
              className="shrink-0"
              data-testid={`badge-job-status-${job.id}`}
            >
              {job.isActive
                ? language === "vi"
                  ? "Đang tuyển"
                  : "Hiring"
                : language === "vi"
                ? "Đã đóng"
                : "Closed"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="text-sm" data-testid={`text-job-department-${job.id}`}>
                {department}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="text-sm" data-testid={`text-job-location-${job.id}`}>
                {location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Banknote className="h-4 w-4 shrink-0" />
              <span className="text-sm" data-testid={`text-job-salary-${job.id}`}>
                {salary}
              </span>
            </div>
          </div>

          <p
            className="text-muted-foreground text-sm line-clamp-3 leading-relaxed"
            data-testid={`text-job-description-${job.id}`}
          >
            {description}
          </p>
        </CardContent>

        <CardFooter className="pt-4">
          {applyUrl && job.isActive ? (
            <Button asChild className="w-full" data-testid={`button-apply-${job.id}`}>
              <a href={applyUrl} target={isEmailApply ? undefined : "_blank"} rel="noopener noreferrer">
                {isEmailApply ? (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {t.jobs.applyNow}
                  </>
                ) : (
                  <>
                    {t.jobs.applyNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </a>
            </Button>
          ) : (
            <Button disabled className="w-full">
              {language === "vi" ? "Không thể ứng tuyển" : "Not Available"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
