'use client';

import { LanguageProvider } from '@/features/i18n';
import { StoreProvider } from '@/features/cart';
import { NotificationProvider } from '@/features/notifications';
import { MotionEffects } from './motion-effects';
import { SplashScreen } from '@/components/ui/splash-screen';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <StoreProvider>
          <SplashScreen />
          <MotionEffects />
          {children}
        </StoreProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}
