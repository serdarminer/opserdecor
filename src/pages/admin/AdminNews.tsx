import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getAllNews, deleteNews } from '@/db/api';
import type { News } from '@/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminNews() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    try {
      setNews(await getAllNews());
    } catch {
      toast.error(t('Haberler yüklenemedi.', 'Failed to load news.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id);
      toast.success(t('Haber silindi.', 'News deleted.'));
      loadNews();
    } catch {
      toast.error(t('Haber silinemedi.', 'Failed to delete news.'));
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('Haber Yönetimi', 'News Management')}</h1>
          <Button onClick={() => navigate('/admin/news/new')}>
            <Plus className="mr-2 h-4 w-4" />{t('Yeni Haber', 'New News')}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Başlık (TR)', 'Title (TR)')}</TableHead>
                <TableHead>{t('Tarih', 'Date')}</TableHead>
                <TableHead>{t('Durum', 'Status')}</TableHead>
                <TableHead className="text-right">{t('İşlemler', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell></TableRow>
              ) : news.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">{t('Henüz haber eklenmemiş.', 'No news yet.')}</TableCell></TableRow>
              ) : news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title_tr}</TableCell>
                  <TableCell>{new Date(item.published_date).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                      {item.status === 'published' ? t('Yayında', 'Published') : t('Taslak', 'Draft')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/news/${item.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('Emin misiniz?', 'Are you sure?')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('Bu haber kalıcı olarak silinecektir.', 'This news will be permanently deleted.')}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>{t('Sil', 'Delete')}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
