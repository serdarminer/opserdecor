import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('Ana Sayfa', 'Home') },
    { path: '/about', label: t('Hakkımızda', 'About') },
    { path: '/products', label: t('Ürünler', 'Products') },
    { path: '/decors', label: t('Dekorlar', 'Decors') },
    { path: '/news', label: t('Haberler', 'News') },
    { path: '/contact', label: t('İletişim', 'Contact') }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-neutral-800/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-32 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo/opser-logo.png.png" alt="OPSER" className="h-40 w-auto brightness-0 invert" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-white/80 ${
                  isActive(item.path) ? 'text-white' : 'text-white/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 border border-white/20 rounded-md">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  language === 'tr' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  language === 'en' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Admin Section */}
            {user && profile?.role === 'admin' && (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('Çıkış', 'Logout')}
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(item.path) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user && profile?.role === 'admin' && (
                    <>
                      <hr className="border-border" />
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium text-foreground hover:text-primary"
                      >
                        <LayoutDashboard className="h-4 w-4 inline mr-2" />
                        Admin Panel
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="text-lg font-medium text-foreground hover:text-primary text-left"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        {t('Çıkış', 'Logout')}
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
