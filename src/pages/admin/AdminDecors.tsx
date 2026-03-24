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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getDecors, createDecor, updateDecor, deleteDecor } from '@/db/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { Decor } from '@/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminDecors() {
  const { t } = useLanguage();
  const [decors, setDecors] = useState<Decor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDecor, setEditingDecor] = useState<Decor | null>(null);
  const { uploadFile, uploading, progress } = useImageUpload('app-ahhdeyjp6akh_opserdecor_images');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description_tr: '',
    description_en: '',
    image_url: '',
    color_group: '',
    pattern_category: '',
    compatible_product_type: 'all',
    display_order: 0
  });

  useEffect(() => {
    loadDecors();
  }, []);

  const loadDecors = async () => {
    try {
      const data = await getDecors();
      setDecors(data);
    } catch (error) {
      console.error('Dekorlar yükleme hatası:', error);
      toast.error(t('Dekorlar yüklenemedi.', 'Failed to load decors.'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setFormData({ ...formData, image_url: url });
      toast.success(t('Görsel yüklendi.', 'Image uploaded.'));
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error(t('Görsel yüklenemedi.', 'Failed to upload image.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.image_url) {
      toast.error(t('Lütfen tüm zorunlu alanları doldurun.', 'Please fill in all required fields.'));
      return;
    }

    try {
      if (editingDecor) {
        await updateDecor(editingDecor.id, formData);
        toast.success(t('Dekor güncellendi.', 'Decor updated.'));
      } else {
        await createDecor(formData);
        toast.success(t('Dekor eklendi.', 'Decor added.'));
      }
      setDialogOpen(false);
      resetForm();
      loadDecors();
    } catch (error) {
      console.error('Dekor kaydetme hatası:', error);
      toast.error(t('Dekor kaydedilemedi.', 'Failed to save decor.'));
    }
  };

  const handleEdit = (decor: Decor) => {
    setEditingDecor(decor);
    setFormData({
      name: decor.name,
      code: decor.code,
      description_tr: decor.description_tr || '',
      description_en: decor.description_en || '',
      image_url: decor.image_url,
      color_group: decor.color_group || '',
      pattern_category: decor.pattern_category || '',
      compatible_product_type: decor.compatible_product_type || 'all',
      display_order: decor.display_order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDecor(id);
      toast.success(t('Dekor silindi.', 'Decor deleted.'));
      loadDecors();
    } catch (error) {
      console.error('Dekor silme hatası:', error);
      toast.error(t('Dekor silinemedi.', 'Failed to delete decor.'));
    }
  };

  const resetForm = () => {
    setEditingDecor(null);
    setFormData({
      name: '',
      code: '',
      description_tr: '',
      description_en: '',
      image_url: '',
      color_group: '',
      pattern_category: '',
      compatible_product_type: 'all',
      display_order: 0
    });
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('Dekor Yönetimi', 'Decor Management')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('Yeni Dekor', 'New Decor')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDecor ? t('Dekor Düzenle', 'Edit Decor') : t('Yeni Dekor Ekle', 'Add New Decor')}
                </DialogTitle>
                <DialogDescription>
                  {t('Dekor bilgilerini girin.', 'Enter decor information.')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Dekor Adı', 'Decor Name')} *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('Dekor Kodu', 'Decor Code')} *</Label>
                    <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Açıklama (TR)', 'Description (TR)')}</Label>
                    <Textarea value={formData.description_tr} onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t('Açıklama (EN)', 'Description (EN)')}</Label>
                    <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>{t('Renk Grubu', 'Color Group')}</Label>
                    <Select value={formData.color_group} onValueChange={(value) => setFormData({ ...formData, color_group: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Seçin', 'Select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t('Açık', 'Light')}</SelectItem>
                        <SelectItem value="dark">{t('Koyu', 'Dark')}</SelectItem>
                        <SelectItem value="natural">{t('Doğal', 'Natural')}</SelectItem>
                        <SelectItem value="colorful">{t('Renkli', 'Colorful')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('Desen Kategorisi', 'Pattern Category')}</Label>
                    <Input value={formData.pattern_category} onChange={(e) => setFormData({ ...formData, pattern_category: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t('Uyumlu Ürün', 'Compatible Product')}</Label>
                    <Select value={formData.compatible_product_type} onValueChange={(value) => setFormData({ ...formData, compatible_product_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                  <div className="flex items-center space-x-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <span className="text-sm text-muted-foreground">{progress}%</span>}
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
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
                <TableHead>{t('Görsel', 'Image')}</TableHead>
                <TableHead>{t('Ad', 'Name')}</TableHead>
                <TableHead>{t('Kod', 'Code')}</TableHead>
                <TableHead>{t('Renk Grubu', 'Color Group')}</TableHead>
                <TableHead className="text-right">{t('İşlemler', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell>
                </TableRow>
              ) : decors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t('Henüz dekor eklenmemiş.', 'No decors added yet.')}
                  </TableCell>
                </TableRow>
              ) : (
                decors.map((decor) => (
                  <TableRow key={decor.id}>
                    <TableCell>
                      <img src={decor.image_url} alt={decor.name} className="h-12 w-12 object-cover rounded" />
                    </TableCell>
                    <TableCell>{decor.name}</TableCell>
                    <TableCell>{decor.code}</TableCell>
                    <TableCell>{decor.color_group}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(decor)}>
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
                                {t('Bu dekor kalıcı olarak silinecektir.', 'This decor will be permanently deleted.')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(decor.id)}>
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
