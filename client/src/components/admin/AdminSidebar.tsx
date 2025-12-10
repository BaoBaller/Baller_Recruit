import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, Image, Briefcase, LogOut, ExternalLink, Users } from 'lucide-react';

export function AdminSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();

  const menuItems = [
    {
      title: t.admin.dashboard,
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: t.admin.heroEditor,
      href: '/admin/hero',
      icon: Image,
    },
    {
      title: t.admin.jobsManagement,
      href: '/admin/jobs',
      icon: Briefcase,
    },
    {
      title: language === 'vi' ? 'Đơn ứng tuyển' : 'Applications',
      href: '/admin/applications',
      icon: Users,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <Sidebar>
      <SidebarHeader className='p-4 border-b'>
        <Link
          href='/'
          className='flex items-center gap-2 hover:opacity-80 transition-opacity'
        >
          <img
            src='/Baller Logo (Black).png'
            alt='Baller Logo'
            className='h-8 w-auto object-contain'
          />{' '}
          <div>
            <span className='text-lg font-bold text-foreground'>Admin Panel</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                    data-testid={`link-sidebar-${item.href.split('/').pop()}`}
                  >
                    <Link href={item.href}>
                      <item.icon className='w-4 h-4' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  data-testid='link-view-website'
                >
                  <a
                    href='/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <ExternalLink className='w-4 h-4' />
                    <span>View Website</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='p-4 border-t'>
        <div className='flex items-center gap-3 mb-4'>
          <Avatar>
            <AvatarFallback className='bg-primary/10 text-primary font-semibold'>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-foreground truncate'>{user?.name || 'Admin'}</p>
            <p className='text-xs text-muted-foreground truncate'>{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <Button
          variant='outline'
          className='w-full'
          onClick={handleLogout}
          data-testid='button-logout'
        >
          <LogOut className='w-4 h-4 mr-2' />
          {t.admin.logout}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
