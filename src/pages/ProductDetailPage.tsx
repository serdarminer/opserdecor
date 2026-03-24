import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductById } from '@/db/api';
import type { Product } from '@/types';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Ürün yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const getCategoryName = (category: string) => {
    const names: Record<string, { tr: string; en: string }> = {
      finish_foil: { tr: 'Finish Folyo', en: 'Finish Foil' },
      decorative_paper: { tr: 'Dekor Kağıdı', en: 'Decorative Paper' },
      pp_foil: { tr: 'PP Folyo', en: 'PP Foil' }
    };
    return language === 'tr' ? names[category]?.tr : names[category]?.en;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full bg-muted" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 bg-muted" />
              <Skeleton className="h-6 w-full bg-muted" />
              <Skeleton className="h-6 w-full bg-muted" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-foreground">{t('Ürün Bulunamadı', 'Product Not Found')}</h2>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Ürünlere Dön', 'Back to Products')}
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
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Ürünlere Dön', 'Back to Products')}
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={getCategoryName(product.category) || ''}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">{getCategoryName(product.category)}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'tr' ? product.description_tr : product.description_en}
            </p>

            {/* Usage Areas */}
            {(product.usage_areas_tr || product.usage_areas_en) && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  {t('Kullanım Alanları', 'Usage Areas')}
                </h2>
                <div className="space-y-2">
                  {(language === 'tr' ? product.usage_areas_tr : product.usage_areas_en)
                    ?.split(',')
                    .map((area: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{area.trim()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Technical Specs */}
            {(product.technical_specs_tr || product.technical_specs_en) && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  {t('Teknik Özellikler', 'Technical Specifications')}
                </h2>
                <div className="space-y-2">
                  {(language === 'tr' ? product.technical_specs_tr : product.technical_specs_en)
                    ?.split(',')
                    .map((spec: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{spec.trim()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

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
