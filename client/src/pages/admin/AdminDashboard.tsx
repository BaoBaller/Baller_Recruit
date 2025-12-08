import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Briefcase, Image, Users, TrendingUp, ArrowRight } from "lucide-react";
import type { Job } from "@shared/schema";

export default function AdminDashboard() {
  const { t } = useLanguage();

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const activeJobs = jobs.filter((job) => job.isActive).length;
  const totalJobs = jobs.length;

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Inactive Jobs",
      value: totalJobs - activeJobs,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold text-foreground"
            data-testid="text-dashboard-title"
          >
            {t.admin.dashboard}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your recruiting site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-card-border" data-testid={`card-stat-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-card-border">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/hero">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  data-testid="button-quick-hero"
                >
                  <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-muted-foreground" />
                    <span>{t.admin.heroEditor}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin/jobs">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  data-testid="button-quick-jobs"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span>{t.admin.jobsManagement}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin/jobs/new">
                <Button className="w-full" data-testid="button-quick-create-job">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {t.admin.createJob}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No jobs created yet
                </p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <Link key={job.id} href={`/admin/jobs/${job.id}`}>
                      <div
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        data-testid={`link-recent-job-${job.id}`}
                      >
                        <div>
                          <p className="font-medium text-foreground">{job.jobTitleEn}</p>
                          <p className="text-sm text-muted-foreground">{job.departmentEn}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            job.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
