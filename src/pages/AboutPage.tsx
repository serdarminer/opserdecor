import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const LOGOS = [
  'adopenlogo1.jpg',
  'agtlogo1.jpg',
  'asd.jpg',
  'camsan.jpg',
  'frimpekslogo.jpg',
  'gentas.jpg',
  'kastamonulogo1.jpg',
  'kordsalogo1.jpg',
  'ladix.jpg',
  'lale.jpg',
  'pelilam.jpg',
  'pelitarslan.jpg',
  'rem.jpg',
  'vezirkopru.jpg',
  'yildiz.jpg',
  'yildizlogo1.jpg',
];

export default function AboutPage() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  // Infinite scroll animation via JS
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number;
    let pos = 0;
    const speed = 0.5;

    const animate = () => {
      pos -= speed;
      const half = track.scrollWidth / 2;
      if (Math.abs(pos) >= half) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <PublicLayout>
      {/* Hero banner */}
      <div
        className="relative flex flex-col items-center justify-center py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/photos/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {t('Hakkımızda', 'About Us')}
          </h1>
          <p className="text-white/60 text-sm">
            <Link to="/" className="hover:text-white transition-colors">{t('Anasayfa', 'Home')}</Link>
            <span className="mx-2">›</span>
            <span>{t('Hakkımızda', 'About Us')}</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: text */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t('Neler Yapıyoruz', 'What We Do')}
            </h2>
            <div className="w-24 h-1 bg-foreground/20 mb-6" />

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {t(
                  'Opser, 1997 yılında kurulmuş Türkiye\'de Baskılı Dekoratif Kağıt ve Finiş Folyolarının lider üreticisidir.',
                  'Opser, founded in 1997, is a leading manufacturer of Printed Decorative Paper and Finish Foils in Turkey.'
                )}
              </p>
              <p>
                {t(
                  'Ana odak noktası, müşterilerin mobilyalardan zemine, mutfaklardan iç mekan kaplamalarına kadar geniş bir yelpazede yüzeyleri kapsayacak şekilde ürün yelpazesinden (dekoratif kağıt, Finiş folyolar – önceden emprenye edilmiş ve melamin emprenyelenmesine karşı) keyfini çıkarmasıdır.',
                  'The main focus is to enable customers to benefit from a wide product range (decorative paper, Finish foils – pre-impregnated and resistant to melamine impregnation) covering surfaces from furniture to flooring, kitchens to interior cladding.'
                )}
              </p>
              <p>
                {t(
                  'Opser, sürdürülebilirlik ve çevreye saygıyla uyumlu, en son dekor tasarım trendlerini sunar. Opser, tüm yaratıcı ve teknolojik kaynaklarını tasarım ve ürün koleksiyonunun sürekli güncellenmesine adamıştır. Ürün yelpazesinin çeşitliliği, ürün kalitesi ve yönetim etkinliği, bu iş alanındaki büyük şirketler için Opser\'le birlikte çalışmak için ideal bir ortak yapar.',
                  'Opser offers the latest decor design trends in line with sustainability and environmental respect. Opser dedicates all its creative and technological resources to the continuous updating of its design and product collection. The diversity of the product range, product quality and management efficiency make Opser an ideal partner for major companies in this field.'
                )}
              </p>
              <p>
                {t(
                  'Baskı işlemi tamamlanıncaya kadar tarama, klişe ve mürekkep miksajı gibi tam entegre bir organizasyon sayesinde Opser, 610 mm\'den 1420\'ye kadar olan genişliklerde 40 gr\'dan 200 gr / m²\'ye kadar dekoratif kağıtlara dönüştürmek üzere doğal ya da yapay herhangi bir malzemeyi alabilir.',
                  'Thanks to a fully integrated organization from scanning, cliché and ink mixing to the completion of the printing process, Opser can take any natural or artificial material to convert into decorative papers from 40 gr to 200 gr/m² in widths ranging from 610 mm to 1420.'
                )}
              </p>
            </div>
          </div>

          {/* Right: image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/images/photos/doorFoil.jpg"
              alt="Opser products"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: '🏭', tr: 'Modern Tesisler', en: 'Modern Facilities', descTr: 'Son teknoloji üretim tesislerimizle kaliteli üretim yapıyoruz.', descEn: 'We produce quality products with our state-of-the-art facilities.' },
            { icon: '🎯', tr: 'Müşteri Odaklı', en: 'Customer Focused', descTr: 'Müşteri memnuniyeti odaklı yaklaşımımızla hizmet veriyoruz.', descEn: 'We serve with our customer satisfaction-oriented approach.' },
            { icon: '🏆', tr: 'Kalite Garantisi', en: 'Quality Guarantee', descTr: 'ISO 9001 kalite yönetim sistemi sertifikamızla güvence altındayız.', descEn: 'We are secured with our ISO 9001 quality management system certificate.' },
          ].map((item) => (
            <div key={item.tr} className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{t(item.tr, item.en)}</h3>
              <p className="text-muted-foreground text-sm">{t(item.descTr, item.descEn)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* References marquee */}
      <div className="py-12 overflow-hidden">
        <div className="container mx-auto px-4 mb-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('Referanslarımız', 'Our References')}
          </h2>
          <div className="w-24 h-1 bg-foreground/20" />
        </div>

        <div className="relative overflow-hidden">
          {/* fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

          <div ref={trackRef} className="flex gap-10 items-center" style={{ width: 'max-content' }}>
            {/* duplicate for seamless loop */}
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center bg-white rounded-lg px-4 py-3 shrink-0"
                style={{ width: 280, height: 70 }}
              >
                <img
                  src={`/images/logolar/${logo}`}
                  alt={logo.replace(/\.[^.]+$/, '')}
                  className="max-h-24 max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
