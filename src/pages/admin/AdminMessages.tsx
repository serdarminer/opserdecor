import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getContactMessages, markMessageAsRead, deleteContactMessage } from '@/db/api';
import type { ContactMessage } from '@/types';
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';

export default function AdminMessages() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Mesajlar yükleme hatası:', error);
      toast.error(t('Mesajlar yüklenemedi.', 'Failed to load messages.'));
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id);
        loadMessages();
      } catch (error) {
        console.error('Mesaj okundu işaretleme hatası:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMessage(id);
      toast.success(t('Mesaj silindi.', 'Message deleted.'));
      loadMessages();
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
      toast.error(t('Mesaj silinemedi.', 'Failed to delete message.'));
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-foreground">{t('İletişim Mesajları', 'Contact Messages')}</h1>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Durum', 'Status')}</TableHead>
                <TableHead>{t('Ad Soyad', 'Full Name')}</TableHead>
                <TableHead>{t('E-posta', 'Email')}</TableHead>
                <TableHead>{t('Konu', 'Subject')}</TableHead>
                <TableHead>{t('Tarih', 'Date')}</TableHead>
                <TableHead className="text-right">{t('İşlemler', 'Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">{t('Yükleniyor...', 'Loading...')}</TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t('Henüz mesaj yok.', 'No messages yet.')}
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id} className={!message.is_read ? 'bg-accent/50' : ''}>
                    <TableCell>
                      <Badge variant={message.is_read ? 'secondary' : 'default'}>
                        {message.is_read ? t('Okundu', 'Read') : t('Yeni', 'New')}
                      </Badge>
                    </TableCell>
                    <TableCell>{message.full_name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{new Date(message.created_at).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(message)}>
                          <Eye className="h-4 w-4" />
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
                                {t('Bu mesaj kalıcı olarak silinecektir.', 'This message will be permanently deleted.')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('İptal', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(message.id)}>
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('Mesaj Detayı', 'Message Details')}</DialogTitle>
              <DialogDescription>
                {selectedMessage && new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t('Ad Soyad', 'Full Name')}</p>
                  <p className="text-foreground">{selectedMessage.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t('E-posta', 'Email')}</p>
                  <p className="text-foreground">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">{t('Telefon', 'Phone')}</p>
                    <p className="text-foreground">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t('Konu', 'Subject')}</p>
                  <p className="text-foreground">{selectedMessage.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t('Mesaj', 'Message')}</p>
                  <p className="text-foreground whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
