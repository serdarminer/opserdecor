import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t('Ana Sayfa', 'Home') },
    { path: '/about', label: t('Hakkımızda', 'About') },
    { path: '/products', label: t('Ürünler', 'Products') },
    { path: '/decors', label: t('Dekorlar', 'Decors') },
    { path: '/news', label: t('Haberler', 'News') },
    { path: '/contact', label: t('İletişim', 'Contact') }
  ];

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">OPSERDECOR</h3>
            <p className="text-sm text-muted-foreground">
              {t(
                'Mobilya, kapı, süpürgelik, parke ve MDF panel kaplamalarında kullanılan finish folyo, dekor kağıdı ve PP folyo ürünlerinde uzman çözümler.',
                'Expert solutions in finish foil, decorative paper and PP foil products used in furniture, door, baseboard, parquet and MDF panel coatings.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('Hızlı Bağlantılar', 'Quick Links')}</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('İletişim Bilgileri', 'Contact Information')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>İkitelli OSB Mah. Hürriyet Bulvarı SS Deparko San. Sit No: 1/38 K3 Başakşehir/İstanbul</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>(212) 858 02 58 – 858 09 15</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@opserltd.com" className="hover:text-primary transition-colors">
                  info@opserltd.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 OPSERDECOR. {t('Tüm hakları saklıdır.', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
