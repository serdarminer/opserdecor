import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { signInWithUsername } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error(t('Kullanıcı adı ve şifre gereklidir.', 'Username and password are required.'));
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      toast.error(
        t(
          'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.',
          'Username can only contain letters, numbers and underscores.'
        )
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithUsername(username, password);
      if (error) {
        toast.error(t('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'Login failed. Please check your credentials.'));
      } else {
        toast.success(t('Giriş başarılı!', 'Login successful!'));
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      toast.error(t('Bir hata oluştu.', 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">OPSERDECOR</div>
          <CardTitle>{t('Admin Girişi', 'Admin Login')}</CardTitle>
          <CardDescription>
            {t('Yönetim paneline erişmek için giriş yapın.', 'Login to access the admin panel.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{t('Kullanıcı Adı', 'Username')}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('Kullanıcı adınızı girin', 'Enter your username')}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">{t('Şifre', 'Password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('Şifrenizi girin', 'Enter your password')}
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                t('Giriş yapılıyor...', 'Logging in...')
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('Giriş Yap', 'Login')}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground text-center">
              {t(
                'İlk kayıt olan kullanıcı otomatik olarak admin olur.',
                'The first registered user automatically becomes admin.'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
