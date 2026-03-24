import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getAllNews, createNews, updateNews, deleteNews } from '@/db/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { News } from '@/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminNews() {
  const { t } = useLanguage();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const { uploadFile, uploading, progress } = useImageUpload('app-ahhdeyjp6akh_opserdecor_images');

  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    content_tr: '',
    content_en: '',
    cover_image_url: '',
    status: 'draft' as 'draft' | 'published',
    published_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Haberler yükleme hatası:', error);
      toast.error(t('Haberler yüklenemedi.', 'Failed to load news.'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setFormData({ ...formData, cover_image_url: url });
      toast.success(t('Görsel yüklendi.', 'Image uploaded.'));
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error(t('Görsel yüklenemedi.', 'Failed to upload image.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_tr || !formData.title_en || !formData.content_tr || !formData.content_en) {
      toast.error(t('Lütfen tüm zorunlu alanları doldurun.', 'Please fill in all required fields.'));
      return;
    }

    try {
      if (editingNews) {
        await updateNews(editingNews.id, formData);
        toast.success(t('Haber güncellendi.', 'News updated.'));
      } else {
        await createNews(formData);
        toast.success(t('Haber eklendi.', 'News added.'));
      }
      setDialogOpen(false);
      resetForm();
      loadNews();
    } catch (error) {
      console.error('Haber kaydetme hatası:', error);
      toast.error(t('Haber kaydedilemedi.', 'Failed to save news.'));
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title_tr: newsItem.title_tr,
      title_en: newsItem.title_en,
      content_tr: newsItem.content_tr,
      content_en: newsItem.content_en,
      cover_image_url: newsItem.cover_image_url || '',
      status: newsItem.status,
      published_date: newsItem.published_date.split('T')[0]
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNews(id);
      toast.success(t('Haber silindi.', 'News deleted.'));
      loadNews();
    } catch (error) {
      console.error('Haber silme hatası:', error);
      toast.error(t('Haber silinemedi.', 'Failed to delete news.'));
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title_tr: '',
      title_en: '',
      content_tr: '',
      content_en: '',
      cover_image_url: '',
      status: 'draft',
      published_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('Haber Yönetimi', 'News Management')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('Yeni Haber', 'New News')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? t('Haber Düzenle', 'Edit News') : t('Yeni Haber Ekle', 'Add New News')}
                </DialogTitle>
                <DialogDescription>
                  {t('Haber bilgilerini her iki dilde girin.', 'Enter news information in both languages.')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Başlık (TR)', 'Title (TR)')} *</Label>
                    <Input value={formData.title_tr} onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('Başlık (EN)', 'Title (EN)')} *</Label>
                    <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('İçerik (TR)', 'Content (TR)')} *</Label>
                    <Textarea rows={8} value={formData.content_tr} onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('İçerik (EN)', 'Content (EN)')} *</Label>
                    <Textarea rows={8} value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Durum', 'Status')}</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t('Taslak', 'Draft')}</SelectItem>
                        <SelectItem value="published">{t('Yayınlandı', 'Published')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('Yayın Tarihi', 'Published Date')}</Label>
                    <Input type="date" value={formData.published_date} onChange={(e) => setFormData({ ...formData, published_date: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label>{t('Kapak Görseli', 'Cover Image')}</Label>
                  <div className="flex items-center space-x-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <span className="text-sm text-muted-foreground">{progress}%</span>}
                  </div>
                  {formData.cover_image_url && (
                    <img src={formData.cover_image_url} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    {t('İptal', 'Cancel')}
                  </Button>
                  <Button type="submit">{t('Kaydet', 'Save')}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                <TableRow>
                  <TableCell colSpan={4} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell>
                </TableRow>
              ) : news.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {t('Henüz haber eklenmemiş.', 'No news added yet.')}
                  </TableCell>
                </TableRow>
              ) : (
                news.map((item) => (
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
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('Emin misiniz?', 'Are you sure?')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('Bu haber kalıcı olarak silinecektir.', 'This news will be permanently deleted.')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                {t('Sil', 'Delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
