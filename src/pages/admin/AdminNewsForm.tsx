import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNewsById, createNews, updateNews } from '@/db/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function AdminNewsForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { uploadFile, uploading, progress } = useImageUpload('app-ahhdeyjp6akh_opserdecor_images');

  const [formData, setFormData] = useState({
    title_tr: '', title_en: '',
    content_tr: '', content_en: '',
    cover_image_url: '',
    status: 'draft' as 'draft' | 'published',
    published_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!isEdit) return;
    getNewsById(id).then((n) => {
      if (!n) return;
      setFormData({
        title_tr: n.title_tr, title_en: n.title_en,
        content_tr: n.content_tr, content_en: n.content_en,
        cover_image_url: n.cover_image_url || '',
        status: n.status,
        published_date: n.published_date.split('T')[0],
      });
    });
  }, [id, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setFormData((f) => ({ ...f, cover_image_url: url }));
      toast.success(t('Görsel yüklendi.', 'Image uploaded.'));
    } catch {
      toast.error(t('Görsel yüklenemedi.', 'Failed to upload image.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_tr || !formData.title_en || !formData.content_tr || !formData.content_en) {
      toast.error(t('Lütfen zorunlu alanları doldurun.', 'Please fill required fields.'));
      return;
    }
    try {
      if (isEdit) {
        await updateNews(id, formData);
        toast.success(t('Haber güncellendi.', 'News updated.'));
      } else {
        await createNews(formData);
        toast.success(t('Haber eklendi.', 'News added.'));
      }
      navigate('/admin/news');
    } catch {
      toast.error(t('Kaydedilemedi.', 'Failed to save.'));
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((f) => ({ ...f, [key]: e.target.value }));

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />{t('Geri', 'Back')}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? t('Haber Düzenle', 'Edit News') : t('Yeni Haber', 'New News')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-8">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Başlık (TR)', 'Title (TR)')} *</Label><Input value={formData.title_tr} onChange={set('title_tr')} required /></div>
            <div><Label>{t('Başlık (EN)', 'Title (EN)')} *</Label><Input value={formData.title_en} onChange={set('title_en')} required /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('İçerik (TR)', 'Content (TR)')} *</Label><Textarea rows={10} value={formData.content_tr} onChange={set('content_tr')} required /></div>
            <div><Label>{t('İçerik (EN)', 'Content (EN)')} *</Label><Textarea rows={10} value={formData.content_en} onChange={set('content_en')} required /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('Durum', 'Status')}</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('Taslak', 'Draft')}</SelectItem>
                  <SelectItem value="published">{t('Yayınlandı', 'Published')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>{t('Yayın Tarihi', 'Published Date')}</Label><Input type="date" value={formData.published_date} onChange={set('published_date')} /></div>
          </div>

          <div>
            <Label>{t('Kapak Görseli', 'Cover Image')}</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <span className="text-sm text-muted-foreground">{progress}%</span>}
            </div>
            {formData.cover_image_url && (
              <img src={formData.cover_image_url} alt="Preview" className="mt-3 h-40 w-auto object-cover rounded-lg border border-border" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/news')}>{t('İptal', 'Cancel')}</Button>
            <Button type="submit">{t('Kaydet', 'Save')}</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
