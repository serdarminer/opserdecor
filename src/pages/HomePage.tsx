import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts, getDecors, getPublishedNews } from '@/db/api';
import type { Product, Decor, News } from '@/types';
import { ArrowRight, Palette } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

const CATEGORY_LABELS: Record<string, { tr: string; en: string }> = {
  finish_foil: { tr: 'Finish Folyo', en: 'Finish Foil' },
  decorative_paper: { tr: 'Dekor Kağıdı', en: 'Decorative Paper' },
  pp_foil: { tr: 'PP Folyo', en: 'PP Foil' },
};

const CATEGORY_BG: Record<string, string> = {
  finish_foil: '/images/photos/ffoil.jpg',
  decorative_paper: '/images/photos/decor1.jpg',
  pp_foil: '/images/photos/ppfoil.jpg',
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [decors, setDecors] = useState<Decor[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, decorsData, newsData] = await Promise.all([
          getProducts(),
          getDecors(),
          getPublishedNews(3),
        ]);
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

  const activeProduct = activeIndex !== null ? products[activeIndex] : null;

  return (
    <PublicLayout>
      {/* Interactive Hero / Products Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{ backgroundImage: "url('/images/photos/woodgrain.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* Background images per product */}
        {products.map((product, i) => {
          const bgImage = CATEGORY_BG[product.category] ?? product.image_url;
          return (
            <div
              key={product.id}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
              style={{
                backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                opacity: activeIndex === i ? 1 : 0,
                zIndex: 0,
              }}
            />
          );
        })}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.25) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-20 py-28 -mt-32">
          {/* Heading */}
          <div className="mb-10">
            <p className="text-neutral-400 text-xs uppercase tracking-[0.25em] mb-2">
              {t('Ürün Kategorilerimiz', 'Our Product Categories')}
            </p>
          </div>

          {/* Product list */}
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-2/3 bg-white/10" />
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {products.map((product, i) => {
                const isActive = activeIndex === i;
                const label = CATEGORY_LABELS[product.category];
                const categoryName = language === 'tr' ? label?.tr : label?.en;
                const productName = language === 'tr' ? product.name_tr : product.name_en;
                const description = language === 'tr' ? product.description_tr : product.description_en;

                return (
                  <li key={product.id}>
                    <Link
                      to={`/products/${product.id}`}
                      className="flex items-start gap-6 py-8 md:py-10 group"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {/* Number */}
                      <span
                        className="text-sm w-10 shrink-0 mt-1 transition-colors duration-300"
                        style={{ color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
                      >
                        {String(i + 1).padStart(2, '0')}.
                      </span>

                      {/* Text block */}
                      <div
                        className="transition-all duration-300"
                        style={{ transform: isActive ? 'translateX(8px)' : 'translateX(0)' }}
                      >
                        <p
                          className="text-xs uppercase tracking-widest mb-1 transition-colors duration-300"
                          style={{ color: isActive ? '#7eb8d4' : 'rgba(255,255,255,0.3)' }}
                        >
                          {categoryName}
                        </p>
                        <p
                          className="text-4xl md:text-6xl font-bold tracking-tight mb-2 transition-colors duration-300"
                          style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }}
                        >
                          {productName}
                        </p>
                        <p
                          className="text-sm max-w-xl leading-relaxed transition-all duration-300"
                          style={{
                            color: 'rgba(255,255,255,0.45)',
                            opacity: isActive ? 1 : 0.6,
                          }}
                        >
                          {description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span
                        className="ml-auto text-white text-xl mt-2 shrink-0 transition-all duration-300"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateX(0)' : 'translateX(-10px)',
                        }}
                      >
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}


        </div>

        {/* Floating cursor image */}
        {activeProduct && (
          <div
            className="pointer-events-none fixed z-50 w-48 h-32 md:w-64 md:h-44 rounded-xl overflow-hidden shadow-2xl transition-opacity duration-300"
            style={{
              left: mousePos.x + 28,
              top: mousePos.y - 70,
              opacity: activeIndex !== null ? 1 : 0,
            }}
          >
            <img
              src={CATEGORY_BG[activeProduct.category] ?? activeProduct.image_url ?? ''}
              alt={language === 'tr' ? activeProduct.name_tr : activeProduct.name_en}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </section>

      {/* Featured Decors Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t('Öne Çıkan Dekorlar', 'Featured Decors')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('Geniş dekor koleksiyonumuzdan seçili tasarımlar.', 'Selected designs from our extensive decor collection.')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square bg-muted" />
                ))
              : decors.map((decor) => (
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
                ))}
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
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full bg-muted" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted" />
                    </CardHeader>
                  </Card>
                ))
              : news.map((item) => (
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
                ))}
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
