'use client';
import Link from 'next/link';
import { useLanguage } from '@/features/i18n';

type Copy = { ru: string; en: string };
export type LegalSection = { title: Copy; paragraphs?: Copy[]; items?: Copy[] };

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: Copy;
  intro: Copy;
  sections: LegalSection[];
}) {
  const { language } = useLanguage();
  const pick = (copy: Copy) => copy[language];
  return (
    <main className="container-x py-12 sm:py-20">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow text-brown">SPHINX · Legal</p>
        <h1 className="display text-4xl sm:text-6xl mt-4">{pick(title)}</h1>
        <p className="text-muted leading-7 mt-6">{pick(intro)}</p>
        <p className="text-xs text-muted mt-3">
          {language === 'en' ? 'Last updated: September 3, 2026' : 'Обновлено: 3 сентября 2026 г.'}
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section className="bg-white border border-black/10 p-5 sm:p-8" key={section.title.en}>
              <h2 className="display text-2xl">{pick(section.title)}</h2>
              <div className="text-sm text-muted leading-7 mt-4 space-y-3">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.en}>{pick(paragraph)}</p>
                ))}
                {section.items && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.items.map((item) => (
                      <li key={item.en}>{pick(item)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
        <Link href="/contact" className="btn btn-dark mt-10">
          {language === 'en' ? 'Contact us' : 'Связаться с нами'}
        </Link>
      </div>
    </main>
  );
}
