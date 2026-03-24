import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatistics } from '@/db/api';
import { Package, Palette, Newspaper, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0, decors: 0, news: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        console.error('İstatistik yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: t('Toplam Ürün', 'Total Products'),
      value: stats.products,
      icon: Package,
      color: 'text-primary'
    },
    {
      title: t('Toplam Dekor', 'Total Decors'),
      value: stats.decors,
      icon: Palette,
      color: 'text-secondary'
    },
    {
      title: t('Toplam Haber', 'Total News'),
      value: stats.news,
      icon: Newspaper,
      color: 'text-accent-foreground'
    },
    {
      title: t('Toplam Mesaj', 'Total Messages'),
      value: stats.messages,
      icon: MessageSquare,
      color: 'text-primary'
    }
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-foreground">{t('Dashboard', 'Dashboard')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-1/2 bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">{t('Hoş Geldiniz', 'Welcome')}</h2>
          <p className="text-muted-foreground">
            {t(
              'OPSERDECOR yönetim paneline hoş geldiniz. Sol menüden yönetmek istediğiniz bölümü seçebilirsiniz.',
              'Welcome to the OPSERDECOR admin panel. You can select the section you want to manage from the left menu.'
            )}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
