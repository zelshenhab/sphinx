'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { clientStorage, storageKeys } from '@/core/storage/client-storage';
export type Language = 'ru' | 'en';
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const translations: Record<string, string> = {
  'БЕСПЛАТНАЯ ДОСТАВКА ОТ 7 000 ₽': 'FREE SHIPPING FROM 7,000 ₽',
  Главная: 'Home',
  Магазин: 'Shop',
  Футболки: 'T-Shirts',
  Худи: 'Hoodies',
  Свитшоты: 'Sweatshirts',
  Спорт: 'Sport',
  'О бренде': 'About',
  Контакты: 'Contacts',
  Корзина: 'Cart',
  'Ваша корзина пуста.': 'Your cart is empty.',
  Итого: 'Total',
  'Оформить заказ': 'Checkout',
  'Современная одежда, вдохновлённая культурой и наследием Египта.':
    'Modern clothing inspired by Egyptian culture and heritage.',
  'Наследие Египта.': 'Egyptian heritage.',
  'Создано для настоящего.': 'Created for the present.',
  'Смотреть коллекцию': 'Shop collection',
  Новинки: 'New arrivals',
  'По категориям': 'Shop by category',
  Избранное: 'Featured',
  'Древние символы.': 'Ancient symbols.',
  'Новая энергия.': 'New energy.',
  'SPHINX соединяет современную streetwear-культуру с символами и наследием древнего Египта. Каждая вещь — это история, переосмысленная для настоящего.':
    'SPHINX brings modern streetwear culture together with the symbols and heritage of ancient Egypt. Every piece is a story reimagined for today.',
  'Есть вопросы?': 'Have questions?',
  'Напишите нам — поможем с размером и оформлением заказа.':
    'Message us — we will help with sizing and your order.',
  'Открыть Telegram': 'Open Telegram',
  Коллекция: 'Collection',
  Обзор: 'Explore',
  'Избранные модели': 'Selected pieces',
  'Наша история': 'Our story',
  'Прямая связь': 'Direct contact',
  Рекомендуем: 'Recommended',
  'Наша идентичность': 'Our identity',
  'Оставайтесь на связи': 'Stay connected',
  'Страница не найдена': 'Page not found',
  'На главную': 'Go home',
  Конфиденциальность: 'Privacy',
  'Возврат и обмен': 'Returns',
  Условия: 'Terms',
  'Данные продавца': 'Seller information',
  'Все категории': 'All categories',
  'Размер: Все': 'Size: All',
  'Цвет: Все': 'Color: All',
  'Цена: Все': 'Price: All',
  'Цена: по возрастанию': 'Price: Low to high',
  'Цена: по убыванию': 'Price: High to low',
  'Быстро добавить': 'Quick add',
  'Добавить в корзину': 'Add to cart',
  'Заказать в Telegram': 'Order via Telegram',
  Описание: 'Description',
  Состав: 'Material',
  Посадка: 'Fit',
  Доставка: 'Shipping',
  'По России курьерской службой. Бесплатно от 7 000 ₽.':
    'Courier delivery across Russia. Free from 7,000 ₽.',
  'Оформление заказа': 'Checkout',
  'Контактные данные': 'Contact details',
  'Адрес доставки': 'Delivery address',
  'Укажите адрес подробно': 'Enter the full address',
  'Город *': 'City *',
  'Улица *': 'Street *',
  'Дом *': 'Building *',
  Подъезд: 'Entrance',
  Этаж: 'Floor',
  'Квартира *': 'Apartment *',
  'Ваш заказ': 'Your order',
  'Оформить заказ в Telegram': 'Prepare Telegram order',
  'Заказ почти готов!': 'Your order is almost ready!',
  'Скачать заказ': 'Download order',
  'Скопировать заказ': 'Copy order',
  'Отправить заказ': 'Send order',
  '1. Нажмите «Отправить заказ»': '1. Click “Send order”',
  '2. Проверьте готовое сообщение и нажмите Send': '2. Review the prepared message and press Send',
  'Скоро в продаже': 'Coming soon',
  'Сейчас недоступно': 'Currently unavailable',
  'Эта коллекция сейчас недоступна. Мы уже готовим её и скоро добавим товары.':
    'This collection is currently unavailable. We are preparing it and will add products soon.',
  'Смотреть доступные товары': 'Shop available products',
  'Нет в наличии': 'Out of stock',
  'НЕТ В НАЛИЧИИ': 'OUT OF STOCK',
  'Зачёркнутые цвета сейчас недоступны': 'Crossed-out colors are currently unavailable',
  'Зачёркнутые размеры сейчас недоступны': 'Crossed-out sizes are currently unavailable',
  'Таблица размеров': 'Size guide',
  Размер: 'Size',
  Грудь: 'Chest',
  Длина: 'Length',
  Рукав: 'Sleeve',
  'Заказ через Telegram': 'Telegram checkout',
  'Карточка заказа': 'Order card',
  'Выберите хотя бы один цвет': 'Select at least one color',
  'Выберите хотя бы один размер': 'Select at least one size',
  'Обновить товар': 'Update product',
  'Сохранение...': 'Saving...',
  'Записей пока нет. Нажмите «Добавить».': 'No records yet. Click “Add”.',
  Отмена: 'Cancel',
  'Сохранено в Supabase': 'Saved to Supabase',
  'Бесплатная доставка от 7 000 ₽': 'Free shipping from 7,000 ₽',
  'Прошлое не исчезает. Оно становится частью тебя.':
    'The past never disappears. It becomes part of you.',
  'Наследие в движении': 'Heritage in motion',
  'SPHINX — бренд современной одежды, вдохновлённый культурой и наследием Египта. Мы переносим силу древних символов — лотоса, анкха и пирамид — в чистый язык современного streetwear.':
    'SPHINX is a modern clothing brand inspired by Egyptian culture and heritage. We translate the power of the lotus, ankh and pyramids into the clean language of contemporary streetwear.',
  'Без театральности. Без сувенирной эстетики. Только точная форма, качественные материалы и графика со смыслом.':
    'No theatrics. No souvenir aesthetic. Just precise silhouettes, quality materials and meaningful graphics.',
  'По вопросам заказа:': 'For order enquiries:',
  'Панель управления': 'Admin dashboard',
  'Всего товаров': 'Total products',
  'Активные товары': 'Active products',
  Категории: 'Categories',
  'Товаров со скидкой': 'Sale products',
  'Последние товары': 'Latest products',
  'Популярные категории': 'Popular categories',
  Товары: 'Products',
  'Добавить товар': 'Add product',
  Закрыть: 'Close',
  'Новый товар': 'New product',
  'Сохранить товар': 'Save product',
  Настройки: 'Settings',
  Сохранить: 'Save',
  'Сохранено локально': 'Saved locally',
  Заказы: 'Orders',
  Добавить: 'Add',
  'Локальных записей пока нет. Нажмите «Добавить», чтобы проверить прототип.':
    'No local records yet. Click “Add” to test the prototype.',
  'данные сохраняются в браузере': 'data is saved in your browser',
  'Новая модель SPHINX.': 'A new SPHINX piece.',
  'Плотный премиальный трикотаж, свободный силуэт и авторская графика SPHINX.':
    'Premium heavyweight jersey, a relaxed silhouette and original SPHINX graphics.',
  'Эластичная быстросохнущая ткань для интенсивных тренировок.':
    'Stretch quick-dry fabric for intense training.',
  'Технологичная футболка с влагоотводящими свойствами.':
    'Technical T-shirt with moisture-wicking performance.',
  '100% хлопок': '100% cotton',
};
const placeholders: Record<string, string> = {
  Имя: 'Name',
  Телефон: 'Phone',
  'Telegram username (необязательно)': 'Telegram username (optional)',
  Город: 'City',
  'Комментарий к доставке': 'Delivery comment',
};
const reverse = Object.fromEntries(Object.entries(translations).map(([ru, en]) => [en, ru]));
const reversePlaceholders = Object.fromEntries(
  Object.entries(placeholders).map(([ru, en]) => [en, ru]),
);
function replaceText(value: string, map: Record<string, string>, language: Language) {
  const trimmed = value.trim();
  const replacement = map[trimmed];
  if (replacement) return value.replace(trimmed, replacement);
  const patterns: Array<[RegExp, string]> =
    language === 'en'
      ? [
          [/^Осталось всего (\d+) шт\.$/, 'Only $1 left'],
          [/^Осталось (\d+) шт\.$/, 'Only $1 left'],
          [/^Осталось (\d+) шт\.: (.+) \/ (.+)$/, 'Only $1 left: $2 / $3'],
          [/^(\d+) см$/, '$1 cm'],
          [/^Цвет: (.+)$/, 'Color: $1'],
          [/^Размер: (.+)$/, 'Size: $1'],
          [/^(\d+) товаров · сохранение в браузере$/, '$1 products · saved in browser'],
        ]
      : [
          [/^Only (\d+) left$/, 'Осталось всего $1 шт.'],
          [/^Color: (.+)$/, 'Цвет: $1'],
          [/^Size: (.+)$/, 'Размер: $1'],
          [/^(\d+) products · saved in browser$/, '$1 товаров · сохранение в браузере'],
        ];
  for (const [pattern, next] of patterns) {
    if (pattern.test(trimmed)) return value.replace(trimmed, trimmed.replace(pattern, next));
  }
  return value;
}
function translatePage(language: Language) {
  document.documentElement.lang = language;
  const map = language === 'en' ? translations : reverse;
  const pmap = language === 'en' ? placeholders : reversePlaceholders;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (parent && !['SCRIPT', 'STYLE'].includes(parent.tagName) && node.nodeValue) {
      const next = replaceText(node.nodeValue, map, language);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
  }
  document
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[placeholder]')
    .forEach((el) => {
      const value = el.placeholder;
      if (pmap[value] && pmap[value] !== value) el.placeholder = pmap[value];
    });
}
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const pathname = usePathname();
  useEffect(() => {
    const id = window.setTimeout(() => {
      const saved = clientStorage.get<Language>(storageKeys.language, 'ru');
      if (saved === 'en') {
        setLanguageState('en');
        requestAnimationFrame(() => translatePage('en'));
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    requestAnimationFrame(() => translatePage(language));
    const observer = new MutationObserver(() =>
      requestAnimationFrame(() => translatePage(language)),
    );
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [language, pathname]);
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    clientStorage.set(storageKeys.language, next);
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function LanguageSwitch() {
  const context = useContext(LanguageContext);
  if (!context) return null;
  return (
    <div
      className="flex items-center border border-black/15 rounded-full p-0.5 text-[9px] tracking-wider"
      aria-label="Language"
    >
      <button
        onClick={() => context.setLanguage('ru')}
        className={`px-2 py-1 rounded-full ${context.language === 'ru' ? 'bg-ink text-white' : ''}`}
      >
        RU
      </button>
      <button
        onClick={() => context.setLanguage('en')}
        className={`px-2 py-1 rounded-full ${context.language === 'en' ? 'bg-ink text-white' : ''}`}
      >
        EN
      </button>
    </div>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
