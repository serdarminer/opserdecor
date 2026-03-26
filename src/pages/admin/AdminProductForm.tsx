import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProductById, createProduct, updateProduct } from '@/db/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function AdminProductForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { uploadFile, uploading, progress } = useImageUpload('app-ahhdeyjp6akh_opserdecor_images');

  const [formData, setFormData] = useState({
    name_tr: '', name_en: '',
    description_tr: '', description_en: '',
    usage_areas_tr: '', usage_areas_en: '',
    technical_specs_tr: '', technical_specs_en: '',
    image_url: '',
    category: 'finish_foil' as 'finish_foil' | 'decorative_paper' | 'pp_foil',
    display_order: 0,
  });

  useEffect(() => {
    if (!isEdit) return;
    getProductById(id).then((p) => {
      if (!p) return;
      setFormData({
        name_tr: p.name_tr, name_en: p.name_en,
        description_tr: p.description_tr, description_en: p.description_en,
        usage_areas_tr: p.usage_areas_tr || '', usage_areas_en: p.usage_areas_en || '',
        technical_specs_tr: p.technical_specs_tr || '', technical_specs_en: p.technical_specs_en || '',
        image_url: p.image_url || '',
        category: p.category,
        display_order: p.display_order,
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
    if (!formData.name_tr || !formData.name_en || !formData.description_tr || !formData.description_en) {
      toast.error(t('Lütfen zorunlu alanları doldurun.', 'Please fill required fields.'));
      return;
    }
    try {
      if (isEdit) {
        await updateProduct(id, formData);
        toast.success(t('Ürün güncellendi.', 'Product updated.'));
      } else {
        await createProduct(formData);
        toast.success(t('Ürün eklendi.', 'Product added.'));
      }
      navigate('/admin/products');
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Geri', 'Back')}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? t('Ürün Düzenle', 'Edit Product') : t('Yeni Ürün', 'New Product')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('Kategori', 'Category')}</Label>
              <Select value={formData.category} onValueChange={(v: any) => setFormData((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="finish_foil">{t('Finish Folyo', 'Finish Foil')}</SelectItem>
                  <SelectItem value="decorative_paper">{t('Dekor Kağıdı', 'Decorative Paper')}</SelectItem>
                  <SelectItem value="pp_foil">{t('PP Folyo', 'PP Foil')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('Sıralama', 'Display Order')}</Label>
              <Input type="number" value={formData.display_order} onChange={(e) => setFormData((f) => ({ ...f, display_order: Number.parseInt(e.target.value) }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Ürün Adı (TR)', 'Product Name (TR)')} *</Label><Input value={formData.name_tr} onChange={set('name_tr')} required /></div>
            <div><Label>{t('Ürün Adı (EN)', 'Product Name (EN)')} *</Label><Input value={formData.name_en} onChange={set('name_en')} required /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Açıklama (TR)', 'Description (TR)')} *</Label><Textarea rows={5} value={formData.description_tr} onChange={set('description_tr')} required /></div>
            <div><Label>{t('Açıklama (EN)', 'Description (EN)')} *</Label><Textarea rows={5} value={formData.description_en} onChange={set('description_en')} required /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Kullanım Alanları (TR)', 'Usage Areas (TR)')}</Label><Input value={formData.usage_areas_tr} onChange={set('usage_areas_tr')} /></div>
            <div><Label>{t('Kullanım Alanları (EN)', 'Usage Areas (EN)')}</Label><Input value={formData.usage_areas_en} onChange={set('usage_areas_en')} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>{t('Teknik Özellikler (TR)', 'Technical Specs (TR)')}</Label><Input value={formData.technical_specs_tr} onChange={set('technical_specs_tr')} /></div>
            <div><Label>{t('Teknik Özellikler (EN)', 'Technical Specs (EN)')}</Label><Input value={formData.technical_specs_en} onChange={set('technical_specs_en')} /></div>
          </div>

          <div>
            <Label>{t('Görsel', 'Image')}</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <span className="text-sm text-muted-foreground">{progress}%</span>}
            </div>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="mt-3 h-40 w-auto object-cover rounded-lg border border-border" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>{t('İptal', 'Cancel')}</Button>
            <Button type="submit">{t('Kaydet', 'Save')}</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
