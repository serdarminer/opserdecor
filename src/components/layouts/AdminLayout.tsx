import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Package, 
  Palette, 
  Newspaper, 
  MessageSquare, 
  FileText, 
  LogOut, 
  Menu,
  Home
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/');
    }
  }, [profile, navigate]);

  const menuItems = [
    { path: '/admin', label: t('Dashboard', 'Dashboard'), icon: LayoutDashboard },
    { path: '/admin/products', label: t('Ürünler', 'Products'), icon: Package },
    { path: '/admin/decors', label: t('Dekorlar', 'Decors'), icon: Palette },
    { path: '/admin/news', label: t('Haberler', 'News'), icon: Newspaper },
    { path: '/admin/messages', label: t('Mesajlar', 'Messages'), icon: MessageSquare },
    { path: '/admin/site-content', label: t('Site İçeriği', 'Site Content'), icon: FileText }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">OPSERDECOR</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('Yönetim Paneli', 'Admin Panel')}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <Home className="mr-2 h-4 w-4" />
            {t('Ana Sayfaya Dön', 'Back to Home')}
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('Çıkış Yap', 'Logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-primary">OPSERDECOR</h2>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}
