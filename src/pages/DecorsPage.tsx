import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getDecors } from '@/db/api';
import type { Decor, DecorFilters } from '@/types';
import { Search, Palette } from 'lucide-react';

export default function DecorsPage() {
  const { language, t } = useLanguage();
  const [decors, setDecors] = useState<Decor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DecorFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadDecors() {
      try {
        const data = await getDecors(filters);
        setDecors(data);
      } catch (error) {
        console.error('Dekorlar yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDecors();
  }, [filters]);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof DecorFilters, value: string) => {
    setFilters({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('Dekorlarımız', 'Our Decors')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Geniş dekor koleksiyonumuzdan ihtiyacınıza uygun tasarımları keşfedin.',
              'Discover designs that suit your needs from our extensive decor collection.'
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="flex space-x-2">
                <Input
                  placeholder={t('Dekor adı veya kodu ile ara...', 'Search by name or code...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Product Type Filter */}
            <Select onValueChange={(value) => handleFilterChange('productType', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('Ürün Tipi', 'Product Type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('Tümü', 'All')}</SelectItem>
                <SelectItem value="finish_foil">{t('Finish Folyo', 'Finish Foil')}</SelectItem>
                <SelectItem value="decorative_paper">{t('Dekor Kağıdı', 'Decorative Paper')}</SelectItem>
                <SelectItem value="pp_foil">{t('PP Folyo', 'PP Foil')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Color Group Filter */}
            <Select onValueChange={(value) => handleFilterChange('colorGroup', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('Renk Grubu', 'Color Group')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('Tümü', 'All')}</SelectItem>
                <SelectItem value="light">{t('Açık Renkler', 'Light Colors')}</SelectItem>
                <SelectItem value="dark">{t('Koyu Renkler', 'Dark Colors')}</SelectItem>
                <SelectItem value="natural">{t('Doğal Tonlar', 'Natural Tones')}</SelectItem>
                <SelectItem value="colorful">{t('Renkli', 'Colorful')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Decors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square bg-muted" />
                <Skeleton className="h-4 w-3/4 mt-2 bg-muted" />
              </div>
            ))
          ) : decors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('Arama kriterlerinize uygun dekor bulunamadı.', 'No decors found matching your criteria.')}
              </p>
            </div>
          ) : (
            decors.map((decor) => (
              <Link key={decor.id} to={`/decors/${decor.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-square rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
                    <img
                      src={decor.image_url}
                      alt={decor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground line-clamp-1">{decor.name}</p>
                  <p className="text-xs text-muted-foreground">{decor.code}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
