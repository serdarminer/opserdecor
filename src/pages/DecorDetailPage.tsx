import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getDecorById } from '@/db/api';
import type { Decor } from '@/types';
import { ArrowLeft, Palette } from 'lucide-react';

export default function DecorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [decor, setDecor] = useState<Decor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecor() {
      if (!id) return;
      try {
        const data = await getDecorById(id);
        setDecor(data);
      } catch (error) {
        console.error('Dekor yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDecor();
  }, [id]);

  const getProductTypeName = (type: string | null) => {
    if (!type) return null;
    const names: Record<string, { tr: string; en: string }> = {
      finish_foil: { tr: 'Finish Folyo', en: 'Finish Foil' },
      decorative_paper: { tr: 'Dekor Kağıdı', en: 'Decorative Paper' },
      pp_foil: { tr: 'PP Folyo', en: 'PP Foil' },
      all: { tr: 'Tüm Ürünler', en: 'All Products' }
    };
    return language === 'tr' ? names[type]?.tr : names[type]?.en;
  };

  const getColorGroupName = (group: string | null) => {
    if (!group) return null;
    const names: Record<string, { tr: string; en: string }> = {
      light: { tr: 'Açık Renkler', en: 'Light Colors' },
      dark: { tr: 'Koyu Renkler', en: 'Dark Colors' },
      natural: { tr: 'Doğal Tonlar', en: 'Natural Tones' },
      colorful: { tr: 'Renkli', en: 'Colorful' }
    };
    return language === 'tr' ? names[group]?.tr : names[group]?.en;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full bg-muted" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 bg-muted" />
              <Skeleton className="h-6 w-full bg-muted" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!decor) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-foreground">{t('Dekor Bulunamadı', 'Decor Not Found')}</h2>
          <Button asChild>
            <Link to="/decors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Dekorlara Dön', 'Back to Decors')}
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/decors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Dekorlara Dön', 'Back to Decors')}
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Decor Image */}
          <div>
            <img
              src={decor.image_url}
              alt={decor.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Decor Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">{decor.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{t('Kod:', 'Code:')} {decor.code}</p>

            {decor.description_tr || decor.description_en ? (
              <p className="text-lg text-muted-foreground mb-8">
                {language === 'tr' ? decor.description_tr : decor.description_en}
              </p>
            ) : null}

            <div className="space-y-4 mb-8">
              {decor.color_group && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    {t('Renk Grubu', 'Color Group')}
                  </h3>
                  <Badge variant="secondary">{getColorGroupName(decor.color_group)}</Badge>
                </div>
              )}

              {decor.pattern_category && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    {t('Desen Kategorisi', 'Pattern Category')}
                  </h3>
                  <Badge variant="secondary">{decor.pattern_category}</Badge>
                </div>
              )}

              {decor.compatible_product_type && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    {t('Uyumlu Ürün Tipi', 'Compatible Product Type')}
                  </h3>
                  <Badge variant="outline">{getProductTypeName(decor.compatible_product_type)}</Badge>
                </div>
              )}
            </div>

            <Button size="lg" className="w-full md:w-auto" asChild>
              <Link to="/contact">
                {t('İletişime Geçin', 'Contact Us')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
