import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { getSiteContentByKey } from '@/db/api';
import type { SiteContent } from '@/types';
import { Building2, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useLanguage();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getSiteContentByKey('about_content');
        setContent(data);
      } catch (error) {
        console.error('İçerik yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-foreground">
            {t('Hakkımızda', 'About Us')}
          </h1>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full bg-muted" />
              <Skeleton className="h-6 w-full bg-muted" />
              <Skeleton className="h-6 w-3/4 bg-muted" />
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {content ? (language === 'tr' ? content.content_tr : content.content_en) : ''}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {t('Modern Tesisler', 'Modern Facilities')}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  'Son teknoloji üretim tesislerimizle kaliteli üretim yapıyoruz.',
                  'We produce quality products with our state-of-the-art production facilities.'
                )}
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {t('Müşteri Odaklı', 'Customer Focused')}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  'Müşteri memnuniyeti odaklı yaklaşımımızla hizmet veriyoruz.',
                  'We serve with our customer satisfaction-oriented approach.'
                )}
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {t('Kalite Garantisi', 'Quality Guarantee')}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  'ISO 9001 kalite yönetim sistemi sertifikamızla güvence altındayız.',
                  'We are secured with our ISO 9001 quality management system certificate.'
                )}
              </p>
            </div>
          </div>

          <div className="mt-16 bg-muted/50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {t('Kullanım Alanlarımız', 'Our Application Areas')}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                t('Mobilya', 'Furniture'),
                t('Kapı', 'Door'),
                t('Süpürgelik', 'Baseboard'),
                t('Parke', 'Parquet'),
                t('Mobilya Profili', 'Furniture Profile'),
                t('MDF Panel Kaplaması', 'MDF Panel Coating')
              ].map((area, index) => (
                <li key={index} className="flex items-center space-x-2 text-foreground">
                  <span className="h-2 w-2 bg-primary rounded-full"></span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
