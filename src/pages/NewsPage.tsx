import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPublishedNews } from '@/db/api';
import type { News } from '@/types';
import { Newspaper, Calendar } from 'lucide-react';

export default function NewsPage() {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getPublishedNews();
        setNews(data);
      } catch (error) {
        console.error('Haberler yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('Haberler', 'News')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Şirketimiz ve sektörümüzle ilgili en güncel haberler ve duyurular.',
              'Latest news and announcements about our company and industry.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full bg-muted" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                </CardHeader>
              </Card>
            ))
          ) : news.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('Henüz haber eklenmemiş.', 'No news added yet.')}</p>
            </div>
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
                    <div className="flex items-center space-x-2 mb-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">
                        {new Date(item.published_date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
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
      </div>
    </PublicLayout>
  );
}
