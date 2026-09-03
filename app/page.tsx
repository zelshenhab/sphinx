'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturedProductGrid, ProductGrid, useCatalog } from '@/features/catalog';
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
  return (
    <main>
      <section className="min-h-[78vh] bg-sand relative overflow-hidden flex items-end">
        {banner?.image && (
          <Image
            src={banner.image}
            alt={bannerTitle ?? banner.title}
            fill
            priority
            className={`object-cover hero-image ${banner.mobileImage ? 'hidden md:block' : ''}`}
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
        <div className="absolute right-0 top-0 hidden md:grid w-1/2 h-full place-items-center border-l border-brown/10 bg-ivory/45">
          <BrandWordmark className="px-8" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-sand via-sand/85 to-transparent" />
        <div className="container-x relative w-full pb-20 md:pb-28">
          <p className="eyebrow mb-6">{bannerSubtitle || 'The Guardian · 2026'}</p>
          <h1 className="display text-6xl md:text-8xl tracking-[.08em] hero-wordmark">
            {bannerTitle || 'SPHINX'}
          </h1>
          <p className="text-xl md:text-3xl display mt-5 max-w-lg">
            Наследие Египта.
            <br />
            Создано для настоящего.
          </p>
          <div className="flex gap-3 mt-9">
            <Link href={banner?.ctaUrl || '/shop'} className="btn btn-dark">
              {bannerCta || 'Смотреть коллекцию'}
            </Link>
            <Link href="/shop?sort=new" className="btn btn-light">
              Новинки
            </Link>
          </div>
        </div>
      </section>
      {collections
        .filter((collection) => collection.active)
        .map((collection) => {
          const collectionProducts = products.filter(
            (product) =>
              collection.productIds.includes(product.id) &&
              categories.some((category) => category.slug === product.category && category.active),
          );
          const collectionName =
            language === 'en' && collection.nameEn ? collection.nameEn : collection.name;
          const collectionDescription =
            language === 'en' && collection.descriptionEn
              ? collection.descriptionEn
              : collection.description;
          if (collection.status === 'coming-soon') {
            return (
              <section className="container-x pb-24" key={collection.id}>
                <div className="relative min-h-80 overflow-hidden bg-sand grid place-items-center text-white">
                  {collection.image && (
                    <Image
                      src={collection.image}
                      alt={collectionName}
                      fill
                      className="object-cover scale-110 blur-xl brightness-[.4] category-unavailable-image"
                    />
                  )}
                  <div className="relative text-center p-8">
                    <h2 className="display text-4xl">{collectionName}</h2>
                    {collectionDescription && (
                      <p className="mt-3 text-white/75">{collectionDescription}</p>
                    )}
                    <p className="display text-2xl mt-5">
                      {language === 'en' ? 'Coming soon' : 'Скоро в продаже'}
                    </p>
                  </div>
                </div>
              </section>
            );
          }
          if (!collectionProducts.length) return null;
          return (
            <section className="container-x pb-24" key={collection.id}>
              <p className="eyebrow text-brown">Коллекция</p>
              <h2 className="display text-4xl mt-3">{collectionName}</h2>
              {collectionDescription && (
                <p className="text-muted mt-3 mb-10">{collectionDescription}</p>
              )}
              {!collectionDescription && <div className="mb-10" />}
              <ProductGrid products={collectionProducts} />
            </section>
          );
        })}
      <section className="container-x py-24">
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
      <section className="container-x pb-24">
        <p className="eyebrow text-brown">Избранные модели</p>
        <h2 className="display text-4xl mt-3 mb-10">Избранное</h2>
        <FeaturedProductGrid limit={8} />
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
