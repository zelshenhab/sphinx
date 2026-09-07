import { LocalizedText } from '@/features/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { BrandWordmark } from '@/components/ui/brand-wordmark';

export default function About() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="container-x min-h-[58svh] py-20 sm:py-28 grid lg:grid-cols-[1fr_.8fr] gap-12 items-end">
          <div className="relative z-10 max-w-3xl">
            <p className="eyebrow text-gold">The Guardian · SPHINX</p>
            <h1 className="display text-6xl sm:text-8xl md:text-9xl tracking-[.08em] mt-6">
              SPHINX
            </h1>
            <p className="display text-2xl sm:text-4xl leading-tight mt-7 max-w-xl">
              <LocalizedText>{'Прошлое не исчезает. Оно становится частью тебя.'}</LocalizedText>
            </p>
          </div>
          <div className="relative aspect-[4/5] max-h-[480px] overflow-hidden border border-gold/25 bg-white/[.04]">
            <Image
              src="/assets/collections/4e50fc17-9a15-4706-b585-ba4a4d020e1d.png"
              alt="SPHINX collection"
              fill
              priority
              className="object-cover opacity-80 mix-blend-screen transition-transform duration-[1400ms] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-[10px] tracking-[.25em] text-white/60">
              EST. 2026
            </span>
          </div>
        </div>
      </section>
      <section className="container-x py-16 sm:py-24 grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-24">
        <div>
          <p className="eyebrow text-brown">
            <LocalizedText>{'Наша идентичность'}</LocalizedText>
          </p>
          <h2 className="display text-4xl sm:text-6xl mt-4 leading-[.95]">
            <LocalizedText>{'Наследие в движении'}</LocalizedText>
          </h2>
        </div>
        <div className="max-w-2xl">
          <p className="text-lg sm:text-xl leading-8 text-ink">
            <LocalizedText>
              {
                'SPHINX — бренд современной одежды, вдохновлённый культурой и наследием Египта. Мы переносим силу древних символов — лотоса, анкха и пирамид — в чистый язык современного streetwear.'
              }
            </LocalizedText>
          </p>
          <p className="text-muted leading-8 mt-6">
            <LocalizedText>
              {
                'Без театральности. Без сувенирной эстетики. Только точная форма, качественные материалы и графика со смыслом.'
              }
            </LocalizedText>
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/shop" className="btn btn-dark">
              <LocalizedText>{'Смотреть коллекцию'}</LocalizedText>
            </Link>
            <Link href="/contact" className="btn border border-ink">
              <LocalizedText>{'Прямая связь'}</LocalizedText>
            </Link>
          </div>
        </div>
      </section>
      <section className="border-y border-black/10 bg-white">
        <div className="container-x py-14 sm:py-20 grid sm:grid-cols-3">
          {[
            ['01', 'Материал', 'Плотные ткани и внимательная обработка каждой детали.'],
            ['02', 'Силуэт', 'Форма, которая остается комфортной и выразительной.'],
            ['03', 'Смысл', 'Символы с историей в языке современного города.'],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="py-5 sm:px-8 first:pl-0 border-b sm:border-b-0 sm:border-r last:border-0 border-black/10"
            >
              <span className="eyebrow text-gold">{number}</span>
              <h3 className="display text-2xl mt-5">
                <LocalizedText>{title}</LocalizedText>
              </h3>
              <p className="text-sm text-muted leading-6 mt-3">
                <LocalizedText>{text}</LocalizedText>
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-x py-16 sm:py-24">
        <div className="relative min-h-[360px] sm:min-h-[480px] overflow-hidden bg-sand grid place-items-center">
          <Image
            src="/assets/collections/tshirts-collection.png"
            alt="SPHINX"
            fill
            className="object-cover opacity-35 grayscale"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="relative z-10 text-center text-white px-6">
            <BrandWordmark light className="max-w-[280px] mx-auto" />
            <p className="eyebrow text-gold mt-8">
              <LocalizedText>{'Древние символы. Новая энергия.'}</LocalizedText>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
