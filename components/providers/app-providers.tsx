'use client';

import { LanguageProvider } from '@/features/i18n';
import { StoreProvider } from '@/features/cart';
import { NotificationProvider } from '@/features/notifications';
import { MotionEffects } from './motion-effects';
import { SplashScreen } from '@/components/ui/splash-screen';
import { CatalogProvider } from '@/features/catalog';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <CatalogProvider>
          <StoreProvider>
            <SplashScreen />
            <MotionEffects />
            {children}
          </StoreProvider>
        </CatalogProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}
