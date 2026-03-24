import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/db/api';
import type { Product } from '@/types';
import { Package, ArrowRight } from 'lucide-react';

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Ürünler yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const getCategoryName = (category: string) => {
    const names: Record<string, { tr: string; en: string }> = {
      finish_foil: { tr: 'Finish Folyo', en: 'Finish Foil' },
      decorative_paper: { tr: 'Dekor Kağıdı', en: 'Decorative Paper' },
      pp_foil: { tr: 'PP Folyo', en: 'PP Foil' }
    };
    return language === 'tr' ? names[category]?.tr : names[category]?.en;
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('Ürünlerimiz', 'Our Products')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Finish folyo, dekor kağıdı ve PP folyo ürünlerimizle geniş bir yelpazede çözümler sunuyoruz.',
              'We offer a wide range of solutions with our finish foil, decorative paper and PP foil products.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-64 w-full bg-muted" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                </CardHeader>
              </Card>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('Henüz ürün eklenmemiş.', 'No products added yet.')}</p>
            </div>
          ) : (
            products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={getCategoryName(product.category) || ''}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <CardTitle>{getCategoryName(product.category)}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {language === 'tr' ? product.description_tr : product.description_en}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-medium">
                      {t('Detayları Görüntüle', 'View Details')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
