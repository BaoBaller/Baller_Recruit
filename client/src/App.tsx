import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import LandingPage from '@/pages/LandingPage';
import { JobDetailPage } from '@/pages/JobDetailPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminHeroPage from '@/pages/admin/AdminHeroPage';
import AdminJobsPage from '@/pages/admin/AdminJobsPage';
import AdminJobFormPage from '@/pages/admin/AdminJobFormPage';
import { AdminApplicationsPage } from '@/pages/admin/AdminApplicationsPage';
import NotFound from '@/pages/not-found';
import JobsListPage from '@/components/landing/JobsListPage';

function Router() {
  return (
    <Switch>
      <Route
        path='/'
        component={LandingPage}
      />
      <Route
        path='/jobs/:id'
        component={JobDetailPage}
      />
      <Route
        path='/admin/login'
        component={AdminLoginPage}
      />
      <Route
        path='/admin'
        component={AdminDashboard}
      />
      <Route
        path='/admin/hero'
        component={AdminHeroPage}
      />
      <Route
        path='/admin/jobs'
        component={AdminJobsPage}
      />
      <Route
        path='/admin/jobs/new'
        component={AdminJobFormPage}
      />
      <Route
        path='/admin/jobs/:id'
        component={AdminJobFormPage}
      />
      <Route
        path='/admin/applications'
        component={AdminApplicationsPage}
      />
      <Route
        path='/jobs'
        component={JobsListPage}
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
