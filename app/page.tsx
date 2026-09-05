'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductGrid, useCatalog } from '@/features/catalog';
import { TELEGRAM_USERNAME } from '@/config/site';
import { BrandWordmark } from '@/components/ui/brand-wordmark';
import { useLanguage } from '@/features/i18n';
export default function Home() {
  const { banners, categories, collections, products } = useCatalog();
  const { language } = useLanguage();
  const [now] = useState(() => Date.now());
  const banner = banners.find((item) => {
    const started = !item.startsAt || new Date(item.startsAt).getTime() <= now;
    const notEnded = !item.endsAt || new Date(item.endsAt).getTime() >= now;
    return item.active && (item.location ?? 'home') === 'home' && started && notEnded;
  });
  const bannerTitle = language === 'en' && banner?.titleEn ? banner.titleEn : banner?.title;
  const bannerSubtitle =
    language === 'en' && banner?.subtitleEn ? banner.subtitleEn : banner?.subtitle;
  const bannerCta = language === 'en' && banner?.ctaTextEn ? banner.ctaTextEn : banner?.ctaText;
  const featuredCollection = collections.find(
    (collection) => collection.active && collection.status !== 'coming-soon',
  );
  const featuredCollectionName =
    language === 'en' && featuredCollection?.nameEn
      ? featuredCollection.nameEn
      : featuredCollection?.name;
  const featuredCollectionDescription =
    language === 'en' && featuredCollection?.descriptionEn
      ? featuredCollection.descriptionEn
      : featuredCollection?.description;
  const latestProducts = [...products]
    .filter((product) =>
      categories.some((category) => category.slug === product.category && category.active),
    )
    .sort((a, b) => Number(b.isNew) - Number(a.isNew))
    .slice(0, 4);
  const heroImage =
    banner?.image || featuredCollection?.image || '/assets/collections/tshirts-collection.png';
  const heroTitle = banner ? bannerTitle : featuredCollectionName || 'SPHINX';
  const heroSubtitle = banner ? bannerSubtitle : 'The Guardian · 2026';
  const heroCta = banner ? bannerCta : language === 'en' ? 'Shop collection' : 'Смотреть коллекцию';
  const hasHeroContent = Boolean(heroTitle || heroSubtitle || heroCta);
  return (
    <main>
      <section className="min-h-[64svh] sm:min-h-[72vh] bg-sand relative overflow-hidden flex items-end text-white">
        {heroImage && (
          <Image
            src={heroImage}
            alt={bannerTitle ?? featuredCollectionName ?? 'SPHINX collection'}
            fill
            priority
            className={`object-cover hero-image ${banner?.mobileImage ? 'hidden md:block' : ''}`}
          />
        )}
        {banner?.mobileImage && (
          <Image
            src={banner.mobileImage}
            alt={bannerTitle ?? banner.title}
            fill
            priority
            className="object-cover hero-image md:hidden"
          />
        )}
        {hasHeroContent && <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />}
        {hasHeroContent && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />}
        {hasHeroContent && (
          <div className="container-x relative w-full pb-12 sm:pb-20 md:pb-24">
            {heroSubtitle && <p className="eyebrow mb-4 sm:mb-6 text-white/75">{heroSubtitle}</p>}
            {heroTitle && <h1 className="display text-5xl sm:text-6xl md:text-7xl tracking-[.06em] hero-wordmark max-w-3xl">{heroTitle}</h1>}
            {heroTitle && !banner && (
              <p className="text-lg sm:text-xl md:text-2xl display mt-4 max-w-lg text-white/90">
                {language === 'en' ? 'Ancient power. Made for now.' : 'Древняя сила. Создано для настоящего.'}
              </p>
            )}
            {heroCta && <div className="flex gap-3 mt-7 sm:mt-9"><Link href={banner?.ctaUrl || '/shop'} className="btn btn-light">{heroCta}</Link></div>}
          </div>
        )}
      </section>
      <section className="container-x py-14 sm:py-20 grid sm:grid-cols-3 border-b border-black/10">
        {(language === 'en'
          ? [
              ['01', 'Heritage', 'Egyptian symbols reimagined for the modern wardrobe.'],
              ['02', 'Material', 'Heavy fabrics, a precise fit and attention to every detail.'],
              ['03', 'Character', 'Quiet streetwear with a distinctive point of view.'],
            ]
          : [
              ['01', 'Наследие', 'Символы Египта, переосмысленные для современного гардероба.'],
              ['02', 'Материал', 'Плотные ткани, точная посадка и внимание к каждой детали.'],
              ['03', 'Характер', 'Лаконичный streetwear, который говорит без лишнего шума.'],
            ]
        ).map(([number, title, text]) => (
          <div
            key={number}
            className="py-5 sm:px-6 first:pl-0 border-b sm:border-b-0 sm:border-r last:border-0 border-black/10"
          >
            <span className="eyebrow text-brown">{number}</span>
            <h2 className="display text-2xl mt-4">{title}</h2>
            <p className="text-sm text-muted leading-6 mt-3">{text}</p>
          </div>
        ))}
      </section>
      <section className="container-x py-14 sm:py-24">
        <div className="grid lg:grid-cols-[1.25fr_.75fr] bg-ink text-white min-h-[520px]">
          <div className="relative min-h-[420px] lg:min-h-full overflow-hidden">
            <Image
              src={
                featuredCollection?.image ||
                '/assets/collections/4e50fc17-9a15-4706-b585-ba4a4d020e1d.png'
              }
              alt={featuredCollectionName || 'SPHINX collection'}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-[1.025]"
            />
          </div>
          <div className="p-7 sm:p-12 flex flex-col justify-center">
            <p className="eyebrow text-gold">
              {language === 'en' ? 'Featured collection' : 'Избранная коллекция'}
            </p>
            <h2 className="display text-4xl sm:text-5xl mt-5">
              {featuredCollectionName || 'THE GUARDIAN'}
            </h2>
            <p className="text-white/60 leading-7 mt-6">
              {featuredCollectionDescription ||
                'Современная форма, древние символы и одежда, созданная для настоящего.'}
            </p>
            <Link href="/shop" className="btn btn-light mt-8 w-fit">
              {language === 'en' ? 'Explore collection' : 'Смотреть коллекцию'}
            </Link>
          </div>
        </div>
      </section>
      <section className="container-x pb-14 sm:pb-24">
        <div className="flex justify-between items-end mb-8 sm:mb-10">
          <div>
            <p className="eyebrow text-brown">
              {language === 'en' ? 'Latest release' : 'Последний выпуск'}
            </p>
            <h2 className="display text-4xl mt-3">
              {language === 'en' ? 'The new drop' : 'Новый дроп'}
            </h2>
          </div>
          <Link href="/shop?sort=new" className="text-xs border-b border-ink pb-1">
            {language === 'en' ? 'View all' : 'Смотреть все'}
          </Link>
        </div>
        <ProductGrid products={latestProducts} />
      </section>
      <section className="container-x py-14 sm:py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="eyebrow text-brown">Обзор</p>
            <h2 className="display text-4xl mt-3">По категориям</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      <section className="container-x pb-14 sm:pb-24 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {[
          '/assets/collections/00fcd2fc-5398-4983-bd8e-b77eafb990c7.png',
          '/assets/collections/4e50fc17-9a15-4706-b585-ba4a4d020e1d.png',
          '/assets/collections/129c8818-05a8-41b5-ac06-3b28fb84925a.png',
        ].map((src, index) => (
          <div
            key={src}
            className={`relative overflow-hidden bg-sand ${index === 2 ? 'col-span-2 lg:col-span-1 aspect-[16/10] lg:aspect-[4/5]' : 'aspect-[4/5]'}`}
          >
            <Image
              src={src}
              alt="SPHINX editorial"
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
        ))}
      </section>
      <section className="bg-ink text-white">
        <div className="container-x py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square border border-gold/20 relative grid place-items-center bg-white/[.03]">
            <BrandWordmark light className="px-8" />
          </div>
          <div>
            <p className="eyebrow text-gold">Наша история</p>
            <h2 className="display text-5xl mt-5">
              Древние символы.
              <br />
              Новая энергия.
            </h2>
            <p className="text-white/65 leading-7 mt-7 max-w-lg">
              SPHINX соединяет современную streetwear-культуру с символами и наследием древнего
              Египта. Каждая вещь — это история, переосмысленная для настоящего.
            </p>
            <Link href="/about" className="btn btn-light mt-9">
              О бренде
            </Link>
          </div>
        </div>
      </section>
      <section className="container-x py-14 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="eyebrow text-brown">Instagram</p>
            <h2 className="display text-4xl mt-3">@sphinx.store</h2>
          </div>
          <a
            href="https://instagram.com/sphinx.store"
            target="_blank"
            rel="noreferrer"
            className="text-xs border-b border-ink pb-1 w-fit"
          >
            {language === 'en' ? 'Follow the story' : 'Следить за брендом'}
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            '/assets/collections/840ae48b-a0ce-46b3-8d2d-13cf80ff5569.png',
            '/assets/collections/b5c75d38-fa88-4d89-866c-872d28f33a5c.png',
            '/assets/collections/ee60f5f3-50c6-4923-8ca3-3ffcd530ac19.png',
          ].map((src) => (
            <a
              href="https://instagram.com/sphinx.store"
              target="_blank"
              rel="noreferrer"
              key={src}
              className="relative aspect-square overflow-hidden bg-sand"
            >
              <Image
                src={src}
                alt="SPHINX Instagram"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </a>
          ))}
        </div>
      </section>
      <section className="container-x py-24 text-center">
        <p className="eyebrow text-brown">Прямая связь</p>
        <h2 className="display text-4xl mt-4">Есть вопросы?</h2>
        <p className="text-muted mt-4">Напишите нам — поможем с размером и оформлением заказа.</p>
        <a className="btn btn-dark mt-7" href={`https://t.me/${TELEGRAM_USERNAME}`}>
          Открыть Telegram
        </a>
      </section>
    </main>
  );
}

function CategoryCard({
  category,
}: {
  category: { name: string; slug: string; image: string; active: boolean };
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const available = category.active && Boolean(category.image?.trim()) && !imageFailed;
  const content = (
    <>
      <div className="absolute inset-0 bg-sand" />
      {category.image?.trim() && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          onError={() => setImageFailed(true)}
          className={`object-cover transition duration-700 ${available ? 'group-hover:scale-105' : 'category-unavailable-image scale-110 blur-xl brightness-[.45]'}`}
        />
      )}
      {available ? (
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/60 text-white">
          <h3 className="display text-2xl">{category.name}</h3>
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-black/25 text-center text-white p-5">
          <div>
            <h3 className="display text-3xl">{category.name}</h3>
            <p className="display text-2xl mt-3">Скоро в продаже</p>
            <p className="text-xs text-white/70 mt-2">Сейчас недоступно</p>
          </div>
        </div>
      )}
    </>
  );
  return available ? (
    <Link
      href={`/shop/${category.slug}`}
      className="relative aspect-[3/4] overflow-hidden group bg-sand"
    >
      {content}
    </Link>
  ) : (
    <div
      aria-disabled="true"
      className="relative aspect-[3/4] overflow-hidden bg-sand cursor-not-allowed"
    >
      {content}
      <div className="absolute inset-0 border border-black/10" />
    </div>
  );
}
