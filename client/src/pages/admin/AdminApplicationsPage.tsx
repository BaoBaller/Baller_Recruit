import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Users,
  FileText,
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  Download,
  Search,
} from "lucide-react";
import type { Application, Job } from "@shared/schema";

const statusOptions = [
  { value: "new", label: "New", labelVi: "Mới" },
  { value: "reviewing", label: "Reviewing", labelVi: "Đang xem xét" },
  { value: "shortlisted", label: "Shortlisted", labelVi: "Danh sách ngắn" },
  { value: "interview", label: "Interview", labelVi: "Phỏng vấn" },
  { value: "offered", label: "Offered", labelVi: "Đã đề nghị" },
  { value: "hired", label: "Hired", labelVi: "Đã tuyển" },
  { value: "rejected", label: "Rejected", labelVi: "Từ chối" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "reviewing":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    case "shortlisted":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "interview":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "offered":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
    case "hired":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "rejected":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function AdminApplicationsPage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Application>;
    }) => {
      await apiRequest("PATCH", `/api/applications/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: "Application updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setIsDialogOpen(false);
      setSelectedApplication(null);
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const getJobTitle = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    return job ? (language === "vi" ? job.jobTitleVi : job.jobTitleEn) : "N/A";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewApplication = (app: Application) => {
    setSelectedApplication(app);
    setNotes(app.notes || "");
    setIsDialogOpen(true);
  };

  const handleStatusChange = (status: string) => {
    if (selectedApplication) {
      updateMutation.mutate({
        id: selectedApplication.id,
        data: { status },
      });
      setSelectedApplication({ ...selectedApplication, status });
    }
  };

  const handleSaveNotes = () => {
    if (selectedApplication) {
      updateMutation.mutate({
        id: selectedApplication.id,
        data: { notes },
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "vi" ? "vi-VN" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {language === "vi" ? "Quản lý Đơn ứng tuyển" : "Applications"}
            </h1>
            <p className="text-muted-foreground">
              {language === "vi"
                ? "Xem và quản lý tất cả đơn ứng tuyển"
                : "View and manage all job applications"}
            </p>
          </div>
          <Badge variant="secondary" className="gap-2 self-start">
            <Users className="h-4 w-4" />
            {applications.length}{" "}
            {language === "vi" ? "ứng viên" : "applicants"}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    language === "vi"
                      ? "Tìm theo tên hoặc email..."
                      : "Search by name or email..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                  <SelectValue
                    placeholder={language === "vi" ? "Trạng thái" : "Status"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === "vi" ? "Tất cả" : "All"}
                  </SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === "vi" ? option.labelVi : option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {language === "vi"
                  ? "Không có đơn ứng tuyển nào"
                  : "No applications found"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card"
                    data-testid={`row-application-${app.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {app.name}
                        </h3>
                        <Badge className={getStatusColor(app.status)}>
                          {statusOptions.find((s) => s.value === app.status)?.[
                            language === "vi" ? "labelVi" : "label"
                          ] || app.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {app.email}
                        </span>
                        {app.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {app.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {getJobTitle(app.jobId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewApplication(app)}
                        data-testid={`button-view-${app.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            data-testid={`button-download-${app.id}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedApplication.name}
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {statusOptions.find(
                      (s) => s.value === selectedApplication.status
                    )?.[language === "vi" ? "labelVi" : "label"] ||
                      selectedApplication.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  {selectedApplication.phone && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">
                        {language === "vi" ? "Điện thoại" : "Phone"}
                      </Label>
                      <p className="font-medium">{selectedApplication.phone}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">
                      {language === "vi" ? "Vị trí ứng tuyển" : "Applied for"}
                    </Label>
                    <p className="font-medium">
                      {getJobTitle(selectedApplication.jobId)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">
                      {language === "vi" ? "Ngày ứng tuyển" : "Applied on"}
                    </Label>
                    <p className="font-medium">
                      {formatDate(selectedApplication.appliedAt)}
                    </p>
                  </div>
                </div>

                {selectedApplication.resumeUrl && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      {language === "vi" ? "CV/Resume" : "Resume"}
                    </Label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={selectedApplication.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedApplication.resumeFilename || "Download Resume"}
                      </a>
                    </div>
                  </div>
                )}

                {selectedApplication.coverLetter && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      {language === "vi" ? "Thư giới thiệu" : "Cover Letter"}
                    </Label>
                    <p className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-lg">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{language === "vi" ? "Trạng thái" : "Status"}</Label>
                  <Select
                    value={selectedApplication.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {language === "vi" ? option.labelVi : option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === "vi" ? "Ghi chú" : "Notes"}</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder={
                      language === "vi"
                        ? "Thêm ghi chú về ứng viên..."
                        : "Add notes about this applicant..."
                    }
                    data-testid="textarea-notes"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={updateMutation.isPending}
                    data-testid="button-save-notes"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {language === "vi" ? "Lưu ghi chú" : "Save Notes"}
                  </Button>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="button-delete-application">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {language === "vi" ? "Xóa" : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {language === "vi"
                          ? "Xác nhận xóa?"
                          : "Confirm deletion?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {language === "vi"
                          ? "Hành động này không thể hoàn tác. Đơn ứng tuyển này sẽ bị xóa vĩnh viễn."
                          : "This action cannot be undone. This application will be permanently deleted."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {language === "vi" ? "Hủy" : "Cancel"}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteMutation.mutate(selectedApplication.id)
                        }
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {language === "vi" ? "Xóa" : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {language === "vi" ? "Đóng" : "Close"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
