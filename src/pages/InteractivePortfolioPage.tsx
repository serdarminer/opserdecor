import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProducts } from '@/db/api';
import type { Product } from '@/types';

const CATEGORY_LABELS: Record<string, { tr: string; en: string }> = {
  finish_foil: { tr: 'Finish Folyo', en: 'Finish Foil' },
  decorative_paper: { tr: 'Dekor Kağıdı', en: 'Decorative Paper' },
  pp_foil: { tr: 'PP Folyo', en: 'PP Foil' },
};

export default function InteractivePortfolioPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const activeProduct = activeIndex !== null ? products[activeIndex] : null;

  return (
    <PublicLayout>
      <div
        ref={containerRef}
        className="relative min-h-screen overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
      >
        {/* Background image layer */}
        {products.map((product, i) => (
          <div
            key={product.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out bg-cover bg-center"
            style={{
              backgroundImage: product.image_url ? `url(${product.image_url})` : undefined,
              opacity: activeIndex === i ? 1 : 0,
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1,
            opacity: activeIndex !== null ? 1 : 0.6,
          }}
        />

        {/* Default dark bg when nothing hovered */}
        {activeIndex === null && (
          <div className="absolute inset-0 bg-neutral-950" style={{ zIndex: 0 }} />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-20 py-24">
          <p className="text-neutral-400 text-sm uppercase tracking-widest mb-8">
            {language === 'tr' ? 'Ürünlerimiz' : 'Our Products'}
          </p>

          <ul className="space-y-0 divide-y divide-white/10">
            {products.map((product, i) => {
              const isActive = activeIndex === i;
              const label = CATEGORY_LABELS[product.category];
              const categoryName = language === 'tr' ? label?.tr : label?.en;
              const productName = language === 'tr' ? product.name_tr : product.name_en;

              return (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    className="group flex items-baseline gap-6 py-5 md:py-7 cursor-pointer select-none"
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {/* Number */}
                    <span
                      className="text-xs text-neutral-500 w-8 shrink-0 transition-colors duration-300"
                      style={{ color: isActive ? 'rgba(255,255,255,0.5)' : undefined }}
                    >
                      {String(i + 1).padStart(2, '0')}.
                    </span>

                    {/* Category */}
                    <span
                      className="hidden md:block text-xs uppercase tracking-widest text-neutral-500 w-36 shrink-0 transition-colors duration-300"
                      style={{ color: isActive ? 'rgba(255,255,255,0.6)' : undefined }}
                    >
                      {categoryName}
                    </span>

                    {/* Title */}
                    <span
                      className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-300"
                      style={{
                        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.25)',
                        transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                        display: 'inline-block',
                      }}
                    >
                      {productName}
                    </span>

                    {/* Arrow */}
                    <span
                      className="ml-auto text-white transition-all duration-300"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                      }}
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Floating image near cursor */}
          {activeProduct?.image_url && (
            <div
              className="pointer-events-none fixed z-50 w-48 h-32 md:w-64 md:h-44 rounded-lg overflow-hidden shadow-2xl transition-opacity duration-300"
              style={{
                left: mousePos.x + 24,
                top: mousePos.y - 60,
                opacity: activeIndex !== null ? 1 : 0,
              }}
            >
              <img
                src={activeProduct.image_url}
                alt={language === 'tr' ? activeProduct.name_tr : activeProduct.name_en}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
