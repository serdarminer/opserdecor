import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts, getDecors, getPublishedNews, getSiteContentByKey } from '@/db/api';
import type { Product, Decor, News, SiteContent } from '@/types';
import { ArrowRight, Package, Palette, Newspaper } from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [heroContent, setHeroContent] = useState<SiteContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [decors, setDecors] = useState<Decor[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [heroData, productsData, decorsData, newsData] = await Promise.all([
          getSiteContentByKey('hero_title'),
          getProducts(),
          getDecors(),
          getPublishedNews(3)
        ]);
        setHeroContent(heroData);
        setProducts(productsData);
        setDecors(decorsData.slice(0, 6));
        setNews(newsData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {loading ? (
              <>
                <Skeleton className="h-12 w-3/4 mx-auto mb-6 bg-muted" />
                <Skeleton className="h-6 w-full mb-8 bg-muted" />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  {heroContent ? (language === 'tr' ? heroContent.content_tr : heroContent.content_en) : 'OPSERDECOR'}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  {t(
                    'Mobilya, kapı, süpürgelik, parke ve MDF panel kaplamalarında kullanılan finish folyo, dekor kağıdı ve PP folyo ürünlerinde uzman çözümler sunuyoruz.',
                    'We offer expert solutions in finish foil, decorative paper and PP foil products used in furniture, door, baseboard, parquet and MDF panel coatings.'
                  )}
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" asChild>
                  <span>
                    {t('Ürünlerimizi İnceleyin', 'Explore Our Products')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" asChild>
                  <span>{t('İletişime Geçin', 'Contact Us')}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t('Ürün Kategorilerimiz', 'Our Product Categories')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Geniş ürün yelpazemiz ile her türlü ihtiyacınıza çözüm sunuyoruz.',
                'We offer solutions for all your needs with our wide product range.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))
            ) : (
              products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <CardTitle>{getCategoryName(product.category)}</CardTitle>
                      </div>
                      <CardDescription>
                        {language === 'tr' ? product.description_tr : product.description_en}
                      </CardDescription>
                    </CardHeader>
                    {product.image_url && (
                      <CardContent>
                        <img
                          src={product.image_url}
                          alt={getCategoryName(product.category) || ''}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/products">
                {t('Tüm Ürünleri Görüntüle', 'View All Products')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Decors Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t('Öne Çıkan Dekorlar', 'Featured Decors')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Geniş dekor koleksiyonumuzdan seçili tasarımlar.',
                'Selected designs from our extensive decor collection.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square bg-muted" />
              ))
            ) : (
              decors.map((decor) => (
                <Link key={decor.id} to={`/decors/${decor.id}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square rounded-lg overflow-hidden border border-border bg-card">
                      <img
                        src={decor.image_url}
                        alt={decor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-center text-foreground">{decor.name}</p>
                    <p className="text-xs text-center text-muted-foreground">{decor.code}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/decors">
                <Palette className="mr-2 h-4 w-4" />
                {t('Tüm Dekorları Görüntüle', 'View All Decors')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t('Son Haberler', 'Latest News')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('Şirketimiz ve sektörümüzle ilgili güncel haberler.', 'Latest news about our company and industry.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full bg-muted" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                  </CardHeader>
                </Card>
              ))
            ) : (
              news.map((item) => (
                <Link key={item.id} to={`/news/${item.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {item.cover_image_url && (
                      <img
                        src={item.cover_image_url}
                        alt={language === 'tr' ? item.title_tr : item.title_en}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <Newspaper className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.published_date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {language === 'tr' ? item.title_tr : item.title_en}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {language === 'tr' ? item.content_tr.substring(0, 150) : item.content_en.substring(0, 150)}...
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/news">
                {t('Tüm Haberleri Görüntüle', 'View All News')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
