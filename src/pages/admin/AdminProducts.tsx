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
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/db/api';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';

export default function AdminProducts() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { uploadFile, uploading, progress } = useImageUpload('app-ahhdeyjp6akh_opserdecor_images');

  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    description_tr: '',
    description_en: '',
    usage_areas_tr: '',
    usage_areas_en: '',
    technical_specs_tr: '',
    technical_specs_en: '',
    image_url: '',
    category: 'finish_foil' as 'finish_foil' | 'decorative_paper' | 'pp_foil',
    display_order: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yükleme hatası:', error);
      toast.error(t('Ürünler yüklenemedi.', 'Failed to load products.'));
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

    if (!formData.name_tr || !formData.name_en || !formData.description_tr || !formData.description_en) {
      toast.error(t('Lütfen tüm zorunlu alanları doldurun.', 'Please fill in all required fields.'));
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success(t('Ürün güncellendi.', 'Product updated.'));
      } else {
        await createProduct(formData);
        toast.success(t('Ürün eklendi.', 'Product added.'));
      }
      setDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      toast.error(t('Ürün kaydedilemedi.', 'Failed to save product.'));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_tr: product.name_tr,
      name_en: product.name_en,
      description_tr: product.description_tr,
      description_en: product.description_en,
      usage_areas_tr: product.usage_areas_tr || '',
      usage_areas_en: product.usage_areas_en || '',
      technical_specs_tr: product.technical_specs_tr || '',
      technical_specs_en: product.technical_specs_en || '',
      image_url: product.image_url || '',
      category: product.category,
      display_order: product.display_order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success(t('Ürün silindi.', 'Product deleted.'));
      loadProducts();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      toast.error(t('Ürün silinemedi.', 'Failed to delete product.'));
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name_tr: '',
      name_en: '',
      description_tr: '',
      description_en: '',
      usage_areas_tr: '',
      usage_areas_en: '',
      technical_specs_tr: '',
      technical_specs_en: '',
      image_url: '',
      category: 'finish_foil',
      display_order: 0
    });
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('Ürün Yönetimi', 'Product Management')}</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('Yeni Ürün', 'New Product')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? t('Ürün Düzenle', 'Edit Product') : t('Yeni Ürün Ekle', 'Add New Product')}
                </DialogTitle>
                <DialogDescription>
                  {t('Ürün bilgilerini her iki dilde girin.', 'Enter product information in both languages.')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Kategori', 'Category')}</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finish_foil">{t('Finish Folyo', 'Finish Foil')}</SelectItem>
                        <SelectItem value="decorative_paper">{t('Dekor Kağıdı', 'Decorative Paper')}</SelectItem>
                        <SelectItem value="pp_foil">{t('PP Folyo', 'PP Foil')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('Sıralama', 'Display Order')}</Label>
                    <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Ürün Adı (TR)', 'Product Name (TR)')}</Label>
                    <Input value={formData.name_tr} onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('Ürün Adı (EN)', 'Product Name (EN)')}</Label>
                    <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Açıklama (TR)', 'Description (TR)')}</Label>
                    <Textarea value={formData.description_tr} onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('Açıklama (EN)', 'Description (EN)')}</Label>
                    <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Kullanım Alanları (TR)', 'Usage Areas (TR)')}</Label>
                    <Input value={formData.usage_areas_tr} onChange={(e) => setFormData({ ...formData, usage_areas_tr: e.target.value })} placeholder={t('Virgülle ayırın', 'Separate with commas')} />
                  </div>
                  <div>
                    <Label>{t('Kullanım Alanları (EN)', 'Usage Areas (EN)')}</Label>
                    <Input value={formData.usage_areas_en} onChange={(e) => setFormData({ ...formData, usage_areas_en: e.target.value })} placeholder={t('Virgülle ayırın', 'Separate with commas')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('Teknik Özellikler (TR)', 'Technical Specs (TR)')}</Label>
                    <Input value={formData.technical_specs_tr} onChange={(e) => setFormData({ ...formData, technical_specs_tr: e.target.value })} placeholder={t('Virgülle ayırın', 'Separate with commas')} />
                  </div>
                  <div>
                    <Label>{t('Teknik Özellikler (EN)', 'Technical Specs (EN)')}</Label>
                    <Input value={formData.technical_specs_en} onChange={(e) => setFormData({ ...formData, technical_specs_en: e.target.value })} placeholder={t('Virgülle ayırın', 'Separate with commas')} />
                  </div>
                </div>

                <div>
                  <Label>{t('Görsel', 'Image')}</Label>
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
                <TableHead>{t('Kategori', 'Category')}</TableHead>
                <TableHead>{t('Ad (TR)', 'Name (TR)')}</TableHead>
                <TableHead>{t('Ad (EN)', 'Name (EN)')}</TableHead>
                <TableHead>{t('Sıralama', 'Order')}</TableHead>
                <TableHead className="text-right">{t('İşlemler', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t('Henüz ürün eklenmemiş.', 'No products added yet.')}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.name_tr}</TableCell>
                    <TableCell>{product.name_en}</TableCell>
                    <TableCell>{product.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
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
                                {t('Bu ürün kalıcı olarak silinecektir.', 'This product will be permanently deleted.')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)}>
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
