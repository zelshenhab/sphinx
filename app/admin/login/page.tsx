'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/core/supabase/client';
import { useLanguage } from '@/features/i18n';

export default function AdminLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const copy =
    language === 'ru'
      ? {
          title: 'Вход для администратора',
          email: 'Email',
          password: 'Пароль',
          submit: 'Войти',
          loading: 'Вход...',
        }
      : {
          title: 'Admin sign in',
          email: 'Email',
          password: 'Password',
          submit: 'Sign in',
          loading: 'Signing in...',
        };

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  };

  return (
    <main className="container-x min-h-[78svh] grid place-items-center py-12 sm:py-20">
      <form
        onSubmit={signIn}
        className="w-full max-w-lg bg-white border border-black/10 p-7 sm:p-10 md:p-12 shadow-[0_18px_60px_rgba(35,29,22,.08)]"
      >
        <div className="flex items-center justify-between gap-4 mb-10">
          <p className="eyebrow text-brown">SPHINX · Secure</p>
          <span className="border border-gold/40 bg-gold/10 px-3 py-1 text-[9px] uppercase tracking-widest text-brown">
            Admin
          </span>
        </div>
        <h1 className="display !text-[clamp(2.35rem,5vw,3.5rem)] leading-[1.02] max-w-full">
          {language === 'ru' ? (
            <>
              Вход для
              <br />
              администратора
            </>
          ) : (
            copy.title
          )}
        </h1>
        <p className="text-sm text-muted mt-4 mb-9">
          {language === 'ru'
            ? 'Управляйте товарами, заказами и настройками магазина.'
            : 'Manage products, orders and store settings.'}
        </p>
        <div className="space-y-4">
          <input
            className="field h-14 px-4"
            type="email"
            required
            autoComplete="email"
            placeholder={copy.email}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="field h-14 px-4"
            type="password"
            required
            autoComplete="current-password"
            placeholder={copy.password}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="btn btn-dark w-full mt-7 h-14 disabled:opacity-50">
          {loading ? copy.loading : copy.submit}
        </button>
      </form>
    </main>
  );
}
