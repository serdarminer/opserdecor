import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getDecors, deleteDecor } from '@/db/api';
import type { Decor } from '@/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminDecors() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [decors, setDecors] = useState<Decor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDecors(); }, []);

  const loadDecors = async () => {
    try {
      setDecors(await getDecors());
    } catch {
      toast.error(t('Dekorlar yüklenemedi.', 'Failed to load decors.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDecor(id);
      toast.success(t('Dekor silindi.', 'Decor deleted.'));
      loadDecors();
    } catch {
      toast.error(t('Dekor silinemedi.', 'Failed to delete decor.'));
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('Dekor Yönetimi', 'Decor Management')}</h1>
          <Button onClick={() => navigate('/admin/decors/new')}>
            <Plus className="mr-2 h-4 w-4" />{t('Yeni Dekor', 'New Decor')}
          </Button>
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
                <TableRow><TableCell colSpan={5} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell></TableRow>
              ) : decors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">{t('Henüz dekor eklenmemiş.', 'No decors yet.')}</TableCell></TableRow>
              ) : decors.map((decor) => (
                <TableRow key={decor.id}>
                  <TableCell><img src={decor.image_url} alt={decor.name} className="h-12 w-12 object-cover rounded" /></TableCell>
                  <TableCell>{decor.name}</TableCell>
                  <TableCell>{decor.code}</TableCell>
                  <TableCell>{decor.color_group}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/decors/${decor.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('Emin misiniz?', 'Are you sure?')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('Bu dekor kalıcı olarak silinecektir.', 'This decor will be permanently deleted.')}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(decor.id)}>{t('Sil', 'Delete')}</AlertDialogAction>
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
