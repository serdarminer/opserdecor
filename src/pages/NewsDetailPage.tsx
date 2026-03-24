import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getNewsById } from '@/db/api';
import type { News } from '@/types';
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      if (!id) return;
      try {
        const data = await getNewsById(id);
        setNews(data);
      } catch (error) {
        console.error('Haber yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-96 w-full mb-8 bg-muted" />
            <Skeleton className="h-10 w-3/4 mb-4 bg-muted" />
            <Skeleton className="h-6 w-full mb-2 bg-muted" />
            <Skeleton className="h-6 w-full bg-muted" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!news || news.status !== 'published') {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-foreground">{t('Haber Bulunamadı', 'News Not Found')}</h2>
          <Button asChild>
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Haberlere Dön', 'Back to News')}
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
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Haberlere Dön', 'Back to News')}
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          {news.cover_image_url && (
            <img
              src={news.cover_image_url}
              alt={language === 'tr' ? news.title_tr : news.title_en}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex items-center space-x-2 text-muted-foreground mb-4">
            <Calendar className="h-5 w-5" />
            <span>
              {new Date(news.published_date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
            {language === 'tr' ? news.title_tr : news.title_en}
          </h1>

          <div className="prose prose-lg max-w-none">
            <div className="text-foreground whitespace-pre-line leading-relaxed">
              {language === 'tr' ? news.content_tr : news.content_en}
            </div>
          </div>
        </article>
      </div>
    </PublicLayout>
  );
}
