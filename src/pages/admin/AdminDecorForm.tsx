import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDecorById, createDecor, updateDecor } from '@/db/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function AdminDecorForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { uploadFile, uploading, progress } = useImageUpload('app-ahhdeyjp6akh_opserdecor_images');

  const [formData, setFormData] = useState({
    name: '', code: '',
    description_tr: '', description_en: '',
    image_url: '',
    color_group: '',
    pattern_category: '',
    compatible_product_type: 'all',
    display_order: 0,
  });

  useEffect(() => {
    if (!isEdit) return;
    getDecorById(id).then((d) => {
      if (!d) return;
      setFormData({
        name: d.name, code: d.code,
        description_tr: d.description_tr || '', description_en: d.description_en || '',
        image_url: d.image_url,
        color_group: d.color_group || '',
        pattern_category: d.pattern_category || '',
        compatible_product_type: d.compatible_product_type || 'all',
        display_order: d.display_order,
      });
    });
  }, [id, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setFormData((f) => ({ ...f, image_url: url }));
      toast.success(t('Görsel yüklendi.', 'Image uploaded.'));
    } catch {
      toast.error(t('Görsel yüklenemedi.', 'Failed to upload image.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.image_url) {
      toast.error(t('Lütfen zorunlu alanları doldurun.', 'Please fill required fields.'));
      return;
    }
    try {
      if (isEdit) {
        await updateDecor(id, formData);
        toast.success(t('Dekor güncellendi.', 'Decor updated.'));
      } else {
        await createDecor(formData);
        toast.success(t('Dekor eklendi.', 'Decor added.'));
      }
      navigate('/admin/decors');
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/decors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />{t('Geri', 'Back')}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? t('Dekor Düzenle', 'Edit Decor') : t('Yeni Dekor', 'New Decor')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-8">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Dekor Adı', 'Decor Name')} *</Label><Input value={formData.name} onChange={set('name')} required /></div>
            <div><Label>{t('Dekor Kodu', 'Decor Code')} *</Label><Input value={formData.code} onChange={set('code')} required /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Açıklama (TR)', 'Description (TR)')}</Label><Textarea rows={4} value={formData.description_tr} onChange={set('description_tr')} /></div>
            <div><Label>{t('Açıklama (EN)', 'Description (EN)')}</Label><Textarea rows={4} value={formData.description_en} onChange={set('description_en')} /></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>{t('Renk Grubu', 'Color Group')}</Label>
              <Select value={formData.color_group} onValueChange={(v) => setFormData((f) => ({ ...f, color_group: v }))}>
                <SelectTrigger><SelectValue placeholder={t('Seçin', 'Select')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('Açık', 'Light')}</SelectItem>
                  <SelectItem value="dark">{t('Koyu', 'Dark')}</SelectItem>
                  <SelectItem value="natural">{t('Doğal', 'Natural')}</SelectItem>
                  <SelectItem value="colorful">{t('Renkli', 'Colorful')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>{t('Desen Kategorisi', 'Pattern Category')}</Label><Input value={formData.pattern_category} onChange={set('pattern_category')} /></div>
            <div>
              <Label>{t('Uyumlu Ürün', 'Compatible Product')}</Label>
              <Select value={formData.compatible_product_type} onValueChange={(v) => setFormData((f) => ({ ...f, compatible_product_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('Tümü', 'All')}</SelectItem>
                  <SelectItem value="finish_foil">{t('Finish Folyo', 'Finish Foil')}</SelectItem>
                  <SelectItem value="decorative_paper">{t('Dekor Kağıdı', 'Decorative Paper')}</SelectItem>
                  <SelectItem value="pp_foil">{t('PP Folyo', 'PP Foil')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t('Görsel', 'Image')} *</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <span className="text-sm text-muted-foreground">{progress}%</span>}
            </div>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="mt-3 h-40 w-auto object-cover rounded-lg border border-border" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/decors')}>{t('İptal', 'Cancel')}</Button>
            <Button type="submit">{t('Kaydet', 'Save')}</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
