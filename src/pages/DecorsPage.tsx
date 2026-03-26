import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getDecors } from '@/db/api';
import type { Decor, DecorFilters } from '@/types';
import { Search, Palette, LayoutGrid, Columns2 } from 'lucide-react';

type ViewMode = '4' | '2';

export default function DecorsPage() {
  const { t } = useLanguage();
  const [decors, setDecors] = useState<Decor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DecorFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('4');

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

  const handleSearch = () => setFilters({ ...filters, search: searchTerm });

  const handleFilterChange = (key: keyof DecorFilters, value: string) =>
    setFilters({ ...filters, [key]: value === 'all' ? undefined : value });

  const gridClass = viewMode === '4'
    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 gap-6';

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

        {/* Filters + View Toggle */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="flex space-x-2 flex-1">
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

            {/* Product Type Filter */}
            <Select onValueChange={(value) => handleFilterChange('productType', value)}>
              <SelectTrigger className="w-44">
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
              <SelectTrigger className="w-44">
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-border rounded-md p-1 shrink-0">
              <button
                onClick={() => setViewMode('4')}
                className={`p-1.5 rounded transition-colors ${viewMode === '4' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title={t('4\'lü görünüm', '4-column view')}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('2')}
                className={`p-1.5 rounded transition-colors ${viewMode === '2' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title={t('2\'li görünüm', '2-column view')}
              >
                <Columns2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Result count */}
        {!loading && decors.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            {decors.length} {t('dekor listeleniyor', 'decors listed')}
          </p>
        )}

        {/* Decors Grid */}
        <div className={gridClass}>
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
                <div className="group cursor-pointer relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className={`overflow-hidden ${viewMode === '2' ? 'aspect-video' : 'aspect-square'}`}>
                    <img
                      src={decor.image_url}
                      alt={decor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Overlay label like reference */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white line-clamp-1">{decor.name}</p>
                      {viewMode === '2' && <p className="text-xs text-white/60">{decor.code}</p>}
                    </div>
                    <span className="text-white/80 text-sm">→</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
