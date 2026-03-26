import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getProducts, deleteProduct } from '@/db/api';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      setProducts(await getProducts());
    } catch {
      toast.error(t('Ürünler yüklenemedi.', 'Failed to load products.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success(t('Ürün silindi.', 'Product deleted.'));
      loadProducts();
    } catch {
      toast.error(t('Ürün silinemedi.', 'Failed to delete product.'));
    }
  };

  const CATEGORY_LABELS: Record<string, string> = {
    finish_foil: t('Finish Folyo', 'Finish Foil'),
    decorative_paper: t('Dekor Kağıdı', 'Decorative Paper'),
    pp_foil: t('PP Folyo', 'PP Foil'),
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('Ürün Yönetimi', 'Product Management')}</h1>
          <Button onClick={() => navigate('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('Yeni Ürün', 'New Product')}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Görsel', 'Image')}</TableHead>
                <TableHead>{t('Kategori', 'Category')}</TableHead>
                <TableHead>{t('Ad (TR)', 'Name (TR)')}</TableHead>
                <TableHead>{t('Ad (EN)', 'Name (EN)')}</TableHead>
                <TableHead>{t('Sıralama', 'Order')}</TableHead>
                <TableHead className="text-right">{t('İşlemler', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell></TableRow>
              ) : products.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">{t('Henüz ürün eklenmemiş.', 'No products yet.')}</TableCell></TableRow>
              ) : products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url && <img src={product.image_url} alt={product.name_tr} className="h-12 w-12 object-cover rounded" />}
                  </TableCell>
                  <TableCell>{CATEGORY_LABELS[product.category] || product.category}</TableCell>
                  <TableCell>{product.name_tr}</TableCell>
                  <TableCell>{product.name_en}</TableCell>
                  <TableCell>{product.display_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('Emin misiniz?', 'Are you sure?')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('Bu ürün kalıcı olarak silinecektir.', 'This product will be permanently deleted.')}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)}>{t('Sil', 'Delete')}</AlertDialogAction>
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
