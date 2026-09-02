import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/features/cart';
import { AppProviders } from '@/components/providers/app-providers';

const brandLogo = '/assets/products/cd986ef7-8736-4312-a63e-2a4375055055.png';

export const metadata: Metadata = {
  title: 'SPHINX — THE GUARDIAN',
  description: 'Современный Египет в streetwear',
  icons: {
    icon: [{ url: brandLogo, type: 'image/png' }],
    shortcut: brandLogo,
    apple: brandLogo,
  },
};
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AppProviders>
          <Header />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
