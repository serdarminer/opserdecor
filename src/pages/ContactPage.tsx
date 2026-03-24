import { useState } from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createContactMessage } from '@/db/api';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.subject || !formData.message) {
      toast.error(t('Lütfen tüm zorunlu alanları doldurun.', 'Please fill in all required fields.'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('Geçerli bir e-posta adresi girin.', 'Please enter a valid email address.'));
      return;
    }

    setLoading(true);
    try {
      await createContactMessage(formData);
      toast.success(t('Mesajınız başarıyla gönderildi!', 'Your message has been sent successfully!'));
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      toast.error(t('Mesaj gönderilemedi. Lütfen tekrar deneyin.', 'Failed to send message. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('İletişim', 'Contact')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Sorularınız veya talepleriniz için bizimle iletişime geçin.',
              'Get in touch with us for your questions or requests.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('Adres', 'Address')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                İkitelli OSB Mah. Hürriyet Bulvarı SS Deparko San. Sit No: 1/38 K3 Başakşehir/İstanbul
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('Telefon', 'Phone')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">(212) 858 02 58 – 858 09 15</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('E-posta', 'Email')}</CardTitle>
            </CardHeader>
            <CardContent>
              <a href="mailto:info@opserltd.com" className="text-primary hover:underline">
                info@opserltd.com
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('İletişim Formu', 'Contact Form')}</CardTitle>
              <CardDescription>
                {t(
                  'Formu doldurarak bize mesaj gönderebilirsiniz.',
                  'You can send us a message by filling out the form.'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">
                    {t('Ad Soyad', 'Full Name')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    {t('E-posta', 'Email')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('Telefon (Opsiyonel)', 'Phone (Optional)')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">
                    {t('Konu', 'Subject')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">
                    {t('Mesaj', 'Message')} <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    t('Gönderiliyor...', 'Sending...')
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('Gönder', 'Send')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>{t('Konum', 'Location')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <iframe
                width="100%"
                height="500"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&language=en&region=cn&q=İkitelli+OSB+Mah.+Hürriyet+Bulvarı+Başakşehir+İstanbul"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
