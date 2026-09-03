export const siteConfig = {
  name: 'SPHINX',
  tagline: 'THE GUARDIAN',
  telegramUsername: 'sphinx2003',
  currency: 'RUB',
  locale: 'ru-RU',
  navigation: [
    { label: 'Главная', href: '/' },
    { label: 'Магазин', href: '/shop' },
    { label: 'Футболки', href: '/shop/t-shirts' },
    { label: 'Худи', href: '/shop/hoodies' },
    { label: 'Свитшоты', href: '/shop/sweatshirts' },
    { label: 'Спорт', href: '/shop/sport' },
    { label: 'О бренде', href: '/about' },
  ],
} as const;

export const TELEGRAM_USERNAME = siteConfig.telegramUsername;

const colorSwatches: Record<string, string> = {
  black: '#1d1d1b',
  'чёрный': '#1d1d1b',
  'черный': '#1d1d1b',
  white: '#ffffff',
  'белый': '#ffffff',
  sand: '#b18a55',
  beige: '#b18a55',
  'бежевый': '#b18a55',
  olive: '#596044',
  khaki: '#596044',
  'оливковый': '#596044',
  'хаки': '#596044',
};

export function getColorSwatch(color: string) {
  const normalizedColor = color.trim().toLowerCase();
  return colorSwatches[normalizedColor] ?? normalizedColor;
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat(siteConfig.locale).format(value)} ₽`;
}
