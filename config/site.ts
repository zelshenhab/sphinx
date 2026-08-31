export const siteConfig = {
  name: 'SPHINX',
  tagline: 'THE GUARDIAN',
  telegramUsername: 'SPHINX_STORE',
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

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat(siteConfig.locale).format(value)} ₽`;
}
