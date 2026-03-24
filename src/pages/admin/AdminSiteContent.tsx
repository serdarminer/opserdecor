import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContent, updateSiteContent } from '@/db/api';
import type { SiteContent } from '@/types';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function AdminSiteContent() {
  const { t } = useLanguage();
  const [content, setContent] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await getSiteContent();
      const contentMap: Record<string, SiteContent> = {};
      data.forEach((item) => {
        contentMap[item.key] = item;
      });
      setContent(contentMap);
    } catch (error) {
      console.error('İçerik yükleme hatası:', error);
      toast.error(t('İçerik yüklenemedi.', 'Failed to load content.'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, content_tr: string, content_en: string) => {
    setSaving(true);
    try {
      await updateSiteContent(key, { content_tr, content_en });
      toast.success(t('İçerik güncellendi.', 'Content updated.'));
      loadContent();
    } catch (error) {
      console.error('İçerik güncelleme hatası:', error);
      toast.error(t('İçerik güncellenemedi.', 'Failed to update content.'));
    } finally {
      setSaving(false);
    }
  };

  const contentSections = [
    {
      key: 'hero_title',
      title: t('Ana Sayfa Hero Başlık', 'Homepage Hero Title'),
      description: t('Ana sayfanın üst kısmındaki büyük başlık', 'Main title at the top of the homepage')
    },
    {
      key: 'hero_description',
      title: t('Ana Sayfa Hero Açıklama', 'Homepage Hero Description'),
      description: t('Ana sayfanın üst kısmındaki açıklama metni', 'Description text at the top of the homepage')
    },
    {
      key: 'about_content',
      title: t('Hakkımızda İçeriği', 'About Content'),
      description: t('Hakkımızda sayfasının ana içeriği', 'Main content of the about page'),
      multiline: true
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('Yükleniyor...', 'Loading...')}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8 text-foreground">{t('Site İçerik Yönetimi', 'Site Content Management')}</h1>

        <div className="space-y-6">
          {contentSections.map((section) => {
            const siteContent = content[section.key];
            if (!siteContent) return null;

            return (
              <Card key={section.key}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const content_tr = formData.get('content_tr') as string;
                      const content_en = formData.get('content_en') as string;
                      handleUpdate(section.key, content_tr, content_en);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{t('Türkçe İçerik', 'Turkish Content')}</Label>
                        {section.multiline ? (
                          <Textarea
                            name="content_tr"
                            defaultValue={siteContent.content_tr}
                            rows={8}
                            required
                          />
                        ) : (
                          <Input
                            name="content_tr"
                            defaultValue={siteContent.content_tr}
                            required
                          />
                        )}
                      </div>
                      <div>
                        <Label>{t('İngilizce İçerik', 'English Content')}</Label>
                        {section.multiline ? (
                          <Textarea
                            name="content_en"
                            defaultValue={siteContent.content_en}
                            rows={8}
                            required
                          />
                        ) : (
                          <Input
                            name="content_en"
                            defaultValue={siteContent.content_en}
                            required
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? t('Kaydediliyor...', 'Saving...') : t('Kaydet', 'Save')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('İletişim Bilgileri', 'Contact Information')}</CardTitle>
            <CardDescription>
              {t('Footer ve iletişim sayfasında görünen bilgiler', 'Information displayed in footer and contact page')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>{t('Adres', 'Address')}</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {content.contact_address?.content_tr}
                </p>
              </div>
              <div>
                <Label>{t('Telefon', 'Phone')}</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {content.contact_phone?.content_tr}
                </p>
              </div>
              <div>
                <Label>{t('E-posta', 'Email')}</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {content.contact_email?.content_tr}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {t(
                  'İletişim bilgilerini güncellemek için veritabanından düzenleme yapın.',
                  'To update contact information, edit from the database.'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
