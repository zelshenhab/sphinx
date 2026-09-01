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
    <main className="container-x min-h-[70vh] grid place-items-center py-16">
      <form
        onSubmit={signIn}
        className="w-full max-w-md bg-white border border-black/10 p-7 md:p-10"
      >
        <p className="eyebrow text-brown">SPHINX · Secure</p>
        <h1 className="display text-3xl mt-3 mb-7">{copy.title}</h1>
        <div className="space-y-4">
          <input
            className="field"
            type="email"
            required
            autoComplete="email"
            placeholder={copy.email}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="field"
            type="password"
            required
            autoComplete="current-password"
            placeholder={copy.password}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="btn btn-dark w-full mt-6 disabled:opacity-50">
          {loading ? copy.loading : copy.submit}
        </button>
      </form>
    </main>
  );
}
